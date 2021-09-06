import React, { useContext, useEffect } from 'react';

import { withRouter } from 'react-router-dom';

import { useStateWithSession } from '../service/serviceStorage';
import { useDidMount } from '../hooks/useDidMount';

import { DEFAULT_FACETS } from '../model/INDEXES';
import Solr from '../model/Solr';

import BrowseContext from './browseContext';
import AnalysisContext from './analysisContext';
import SearchContext from './searchContext';

const SESSION_PREFIX = 'BrowseState';

const DEFAULT_INDEX_NAME = "composer_ss"

const INITIAL_BROWSE_TERMS = {
    facets: {
        fields: [DEFAULT_INDEX_NAME],
        prefix: '',
        sort: 'index'
    }
};

const INITIAL_INDEX = {
    index: DEFAULT_INDEX_NAME,
};

const BrowseState = props => {

    const [browseResults, setBrowseResults] = useStateWithSession([], 'browseResults', SESSION_PREFIX);
    const [browseTerms, setBrowseTerms] = useStateWithSession(INITIAL_BROWSE_TERMS, 'browseTerms', SESSION_PREFIX);
    const [searchResults, setSearchResults] = useStateWithSession({}, 'searchResults', SESSION_PREFIX);
    const [searchTerms, setSearchTerms] = useStateWithSession({}, 'searchTerms', SESSION_PREFIX);
    const [currentIndex, setCurrentIndex] = useStateWithSession(INITIAL_INDEX, 'currentIndex', SESSION_PREFIX);
    const [isLoading, setIsLoading] = useStateWithSession(false, 'isLoading', SESSION_PREFIX);
    const [selectedResource, setSelectedResource] = useStateWithSession(null, 'selectedResource', SESSION_PREFIX);

    const analysisContext = useContext(AnalysisContext);
    const searchContext = useContext(SearchContext);

    const setSearchSelected = element => {
        setSelectedResource(element);
    };

    const unsetSearchSelected = () => {
        setSelectedResource(null);
    };

    const onSelectChangeHandler = index => {
        const updateBrowseTerms = { ...browseTerms, facets: { ...browseTerms.facets, fields: [index] } };
        setCurrentIndex({ index });
        setBrowseTerms(updateBrowseTerms);
    };

    const onPrefixFilterChangeHandler = prefix => {
        const updateBrowseTerms = { ...browseTerms, facets: { ...browseTerms.facets, prefix } };
        setBrowseTerms(updateBrowseTerms);
    };

    const fetchIndexElements = (searchKey, position) => {
        setIsLoading(true);
        setCurrentIndex({
            ...currentIndex,
            position
        });
        performSearch(generateSearchTermsBySearchKey(searchKey));
    };

    const generateSearchTermsBySearchKey = searchKey => {
        let searchTerms = {
            collections: analysisContext.collections
        };

        if (currentIndex.index === 'year_i') {
            searchTerms = {
                ...searchTerms,
                dateRange: {
                    from: searchKey,
                    to: searchKey
                },
                searchKey,
                page: 0
            };
        } else {
            searchTerms = {
                ...searchTerms,
                searchKey,
                indexes: [currentIndex.index],
                dateRange: analysisContext.dateRange,
                page: 0
            };
        }

        setSearchTerms(searchTerms);

        return searchTerms;
    };

    const doNewBrowse = browseTerms => {
        //e && e.preventDefault();

        setIsLoading(true);
        setSearchResults([]);
        setBrowseResults([]);

        performBrowse(browseTerms);
    };

    const storeSolrBrowseResults = solrBrowseResults => {
        setIsLoading(false);
        setBrowseResults(solrBrowseResults.facet_counts.facet_fields[currentIndex.index]);
    };

    const performBrowse = browseTerms => {
        return Solr
            .search({
                ...browseTerms,
                dateRange: analysisContext.dateRange,
                collections: analysisContext.collections
            })
            .then(storeSolrBrowseResults);
    };

    const storeSolrSearchResults = searchKey => solrSearchResults => {
        setSearchResults({
            index: searchKey,
            results: solrSearchResults.response.docs,
            numFound: solrSearchResults.response.numFound
        });
        setIsLoading(false);
    };

    const unsetSearchResults = () => {
        setSearchResults({});
        setCurrentIndex({
            ...currentIndex,
            position: null
        });
    };

    const performSearch = searchTerms => {
        window.scrollTo(0, 0);
        return Solr
            .search(searchTerms)
            .then(storeSolrSearchResults(searchTerms.searchKey));
    };

    const selectNext = () => {
        const nextKey = currentIndex.position + 1;
        const normalizedResults = Solr.normalizeFacetsResults(browseResults);

        if (normalizedResults[nextKey]) {
            const term = normalizedResults[nextKey];

            fetchIndexElements(term.label, nextKey);
            setCurrentIndex({
                ...currentIndex,
                position: nextKey
            });
        }
    };


    const selectPrevious = () => {
        const prevKey = currentIndex.position - 1;
        const normalizedResults = Solr.normalizeFacetsResults(browseResults);

        if (normalizedResults[prevKey]) {
            const term = normalizedResults[prevKey];

            fetchIndexElements(term.label, prevKey);
            setCurrentIndex({
                ...currentIndex,
                position: prevKey
            });
        }
    };

    const gotoSearch = searchKey => {
        searchContext.setSearchTerms({
            ...generateSearchTermsBySearchKey(searchKey),
            filters: [],
            facets: {
                fields: DEFAULT_FACETS
            },
            page: 0
        });
        analysisContext.setShouldUpdateSearchHistory(true);
        props.history.push('/search');
    };

    const selectPage = page => {
        setSearchTerms({
            ...searchTerms,
            page
        });
    };

    // we use useDidMount Hook to let the component know whether is mounted or not
    const didMount = useDidMount();

    // The useEffect Hook calls the function as first parameter on mounting 
    // and when the dependendecies in the second parameter change
    useEffect(
        () => {
            if (didMount) {
                
                // we want to update index search results only if a browse result record is selected
                currentIndex.position != null && performSearch({
                    ...searchTerms,
                    dateRange: analysisContext.dateRange,
                    collections: analysisContext.collections
                });

                // we want to update browse results only after index browse selection
                currentIndex.index && performBrowse(browseTerms);
            }
        },
        [
            searchTerms.page,
            analysisContext.dateRange,
            analysisContext.collections,
            browseTerms
        ]
    );

    return (
        <BrowseContext.Provider
            value={{
                isLoading,
                browseTerms,
                currentIndex,
                browseResults,
                searchResults,
                searchTerms,
                selectPage,
                selectedResource,
                setSearchSelected,
                unsetSearchSelected,
                //onFormSubmitHandler,
                onSelectChangeHandler,
                onPrefixFilterChangeHandler,
                fetchIndexElements,
                unsetSearchResults,
                selectNext,
                selectPrevious,
                gotoSearch
            }}
        >
            {props.children}
        </BrowseContext.Provider>
    );
};

export default withRouter(BrowseState);