import React, { useEffect, useContext } from 'react';

import { useStateWithSession } from '../service/serviceStorage';

import SearchContext from './searchContext';
import AnalysisContext from './analysisContext';

import { withRouter } from 'react-router-dom';

import { useDidMount } from '../hooks/useDidMount';

import { DEFAULT_FACETS } from '../model/INDEXES';
import Solr from '../model/Solr';

const SESSION_PREFIX = 'SearchState';

const INITIAL_SEARCH_TERMS = {
    searchKey: '',
    indexes: [],
    filters: [],
    facets: {
        fields: DEFAULT_FACETS
    },
    page: 0
};

const INITIAL_SEARCH_RESULTS = {
    numFound: null,
    results: [],
    facets: [],
};

const SearchState = props => {

    const [isLoading, setIsLoading] = useStateWithSession(false, 'isLoading', SESSION_PREFIX);
    const [selectedResource, setSelectedResource] = useStateWithSession(null, 'selectedResource', SESSION_PREFIX);
    const [searchResults, setSearchResults] = useStateWithSession(INITIAL_SEARCH_RESULTS, 'searchResults', SESSION_PREFIX);
    const [searchTerms, setSearchTerms] = useStateWithSession(INITIAL_SEARCH_TERMS, 'searchTerms', SESSION_PREFIX);
    const [searchHistory, setSearchHistory] = useStateWithSession([], 'searchHistory', SESSION_PREFIX);
    const [currentSearchHistoryIndex, setCurrentSearchHistoryIndex] = useStateWithSession(0, 'currentSearchHistoryIndex', SESSION_PREFIX);

    const analysisContext = useContext(AnalysisContext);

    const searchParamChangeHandler = param => value => {
        setSearchTerms(
            (() => {
                switch (param) {
                    default: return { ...searchTerms, [param]: value };
                    case 'indexes': return { ...searchTerms, [param]: value ? [value] : [] };
                }
            })()
        );
    };

    const toggleSearchFilter = (field, value) => {
        if (searchTerms.filters.includes(`${field}:${value}`)) {
            setSearchTerms({
                ...searchTerms,
                filters: searchTerms.filters.filter(f => f !== `${field}:${value}`),
                page: 0
            });
        } else {
            setSearchTerms({
                ...searchTerms,
                filters: searchTerms.filters.concat(`${field}:${value}`),
                page: 0
            });
        }
        analysisContext.setShouldUpdateSearchHistory(true);
    };

    const setSearchSolrResponse = solr => {
        setIsLoading(false);
        setSearchResults({
            ...searchResults,
            numFound: solr.response.numFound,
            results: solr.response.docs,
            facets: solr.facet_counts ? solr.facet_counts.facet_fields : [],
        });
    };

    const setSearchSelected = element => {
        setSelectedResource(element);
    };

    const unsetSearchSelected = () => {
        setSelectedResource(null);
    };

    const searchFormSubmitHandler = e => {
        e && e.preventDefault();

        setIsLoading(true);
        setSearchResults({
            ...searchResults,
            numFound: 0,
            results: [],
            facets: []
        });

        analysisContext.setShouldUpdateSearchHistory(true);

        searchTerms.page
            ? selectPage(0)
            : performSearch(searchTerms);
    };


    const performSearch = searchTerms => {
        setIsLoading(true);

        return Solr
            .search(generateSearchTerms(searchTerms))
            .then(setSearchSolrResponse);
    };

    const selectPage = page => {
        setSearchTerms({
            ...searchTerms,
            page
        });
    };

    const purgeSearchHistory = () => {
        setCurrentSearchHistoryIndex(0);
        setSearchHistory([]);
    };

    const goToPreviousSearch = () => {
        const index = currentSearchHistoryIndex - 1 > 0
            ? currentSearchHistoryIndex - 1
            : 0;

        setCurrentSearchHistoryIndex(index);
        performSearchHistoryNavigation(searchHistory[index]);
    };

    const goToNextSearch = () => {
        const index = currentSearchHistoryIndex + 1 >= searchHistory.length
            ? searchHistory.length - 1
            : currentSearchHistoryIndex + 1;

        setCurrentSearchHistoryIndex(index);
        performSearchHistoryNavigation(searchHistory[index]);
    };

    const performSearchHistoryNavigation = updatedSearchTerms => {
        setSearchTerms(updatedSearchTerms);
        performSearch(updatedSearchTerms);
        analysisContext.setDateRange(updatedSearchTerms.dateRange);
        analysisContext.setCollections(updatedSearchTerms.collections);
    };

    const generateSearchTerms = searchTerms => ({
        ...searchTerms,
        dateRange: analysisContext.dateRange,
        collections: analysisContext.collections
    });

    // we use useDidMount Hook to let the component know whether is mounted or not
    const didMount = useDidMount();

    // The useEffect Hook calls the function as first parameter on mounting 
    // and when the dependendecies in the second parameter change

    // Search Results management useEffect
    useEffect(
        () => {
            // we want to update search results only after the first search...
            if (didMount && searchResults.numFound != null && props.location.pathname.includes('/search')) {
                performSearch(generateSearchTerms(searchTerms));
            }
        },
        [
            searchTerms.filters,
            searchTerms.page,
            analysisContext.dateRange,
            analysisContext.collections
        ]
    );

    // Search History management useEffect
    useEffect(
        () => {
            // we want to append search terms into search history only when is required
            if (didMount && analysisContext.shouldUpdateSearchHistory) {
                setCurrentSearchHistoryIndex(searchHistory.length);
                setSearchHistory(searchHistory.concat(generateSearchTerms(searchTerms)));
                analysisContext.setShouldUpdateSearchHistory(false);
            }
        },
        [analysisContext.shouldUpdateSearchHistory]
    );

    return (
        <SearchContext.Provider
            value={{
                searchResults,
                searchTerms,
                selectedResource,
                isLoading,
                searchParamChangeHandler,
                toggleSearchFilter,
                setSearchSelected,
                unsetSearchSelected,
                searchFormSubmitHandler,
                selectPage,
                setSearchTerms,
                purgeSearchHistory,
                goToPreviousSearch,
                goToNextSearch,
                searchHistory,
                currentSearchHistoryIndex
            }}
        >
            {props.children}
        </SearchContext.Provider>
    );
};

export default withRouter(SearchState);