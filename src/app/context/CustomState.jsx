import React, { useState } from 'react';
import { useStateWithSession } from '../service/serviceStorage';

import CurstomContext from './customContext';

const SESSION_PREFIX = 'Kapellmeisterbuch-CustomState';

import Json from '../model/Json';

const CustomState = props => {

    const [browseResults, setBrowseResults] = useState([], 'browseResults', SESSION_PREFIX);
    const [searchResults, setSearchResults] = useStateWithSession([], 'searchResults', SESSION_PREFIX);

    const [loadingBrowse, setLoadingBrowse] = useState(false);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [loadingRelated, setLoadingRelated] = useState(false);

    const [related, setRelated] = useState([]);


    const loadRelated = ({ index, params }) => {

        if (!related[`${params.key}_${params.name}`]) {
            setLoadingRelated({ index, params });
            Json.browse({ index, params }).then(r => {
                setRelated({ ...related, [`${params.key}_${params.name}`]: r });
                setLoadingRelated(false);
            });
        }

    };

    const performBrowse = (index) => {
        setLoadingBrowse(true);
        Json.browse({ index }).then(r => {
            // console.log(r);
            setBrowseResults(r);
            setLoadingBrowse(false);
        });
    };

    const performSearch = (key) => {
        setLoadingSearch(true);
        Json.search({ key }).then(r => {
            // console.log(r);
            setSearchResults(r);
            setLoadingSearch(false);
        });
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