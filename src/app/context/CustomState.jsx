import React, { useState } from 'react';
import { useStateWithSession } from '../service/serviceStorage';

import CurstomContext from './customContext';

const SESSION_PREFIX = 'Kapellmeisterbuch-CustomState';

const CustomState = props => {

    const [browseResults, setBrowseResults] = useState([]);
    const [searchResults, setSearchResults] = useStateWithSession([], 'searchResults', SESSION_PREFIX);

    const [loadingBrowse, setLoadingBrowse] = useState(false);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [loadingRelated, setLoadingRelated] = useState(false);

    const [related, setRelated] = useState({});


    const loadRelated = async ({ index, params }) => {

        if (!related[`${params.key}_${params.name}`]) {
            setLoadingRelated({ index, params });
            try {
                const { related: loadRelatedEntries } = await import('../model/staticBrowse');
                setRelated(current => ({ ...current, [`${params.key}_${params.name}`]: loadRelatedEntries(index, params) }));
            } catch (error) {
                console.error('Unable to load the local browse index.', error);
            } finally {
                setLoadingRelated(false);
            }
        }

    };

    const performBrowse = async index => {
        setLoadingBrowse(true);
        try {
            const { browse } = await import('../model/staticBrowse');
            setBrowseResults(browse(index));
        } catch (error) {
            setBrowseResults([]);
            console.error('Unable to load the local browse index.', error);
        } finally {
            setLoadingBrowse(false);
        }
    };

    const performSearch = async key => {
        setLoadingSearch(true);
        try {
            const { search } = await import('../model/staticSearch');
            setSearchResults(search(key));
        } catch (error) {
            setSearchResults([]);
            console.error('Unable to load the local search index.', error);
        } finally {
            setLoadingSearch(false);
        }
    };

    return (
        <CurstomContext.Provider
            value={{
                performBrowse,
                browseResults,
                loadingBrowse,
                performSearch,
                searchResults,
                loadingSearch,
                related,
                loadRelated,
                loadingRelated
            }}
        >
            {props.children}
        </CurstomContext.Provider>
    );
};

export default CustomState;
