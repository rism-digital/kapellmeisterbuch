import React, { useState } from 'react';

import { useStateWithSession } from '../service/serviceStorage';

import { withRouter } from 'react-router-dom';

import { useDidMount } from '../hooks/useDidMount';

import { generateCollections } from '../model/INDEXES';

import AnalysisContext from './analysisContext';

const SESSION_PREFIX = 'AnalysisState';

const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const AnalysisState = props => {

    const [dateRange, setDateRange] = useStateWithSession({}, 'dateRange', SESSION_PREFIX);

    const [collections, setCollections] = useStateWithSession(generateCollections().map(element => element.field), 'collections', SESSION_PREFIX);

    const [isContextBarVisible, setContextBarVisibility] = useStateWithSession(false, 'isContextBarVisible', SESSION_PREFIX);

    const [pinnedDocuments, setPinnedDocuments] = useStateWithSession([], 'pinnedDocuments', SESSION_PREFIX);
    const [shouldUpdateSearchHistory, setShouldUpdateSearchHistory] = useState(false);

    const didMount = useDidMount();

    const dateRangeChangeHandler = updatedDateRange => {
        setDateRange(updatedDateRange);

        if (didMount && !isEqual(dateRange, updatedDateRange) && props.location.pathname.includes('/search')) {
            setShouldUpdateSearchHistory(true);
        }
    };

    const changeCollectionsSelectorHandler = updatedCollections => {
        setCollections(updatedCollections);

        if (didMount && !isEqual(collections, updatedCollections) && props.location.pathname.includes('/search')) {
            setShouldUpdateSearchHistory(true);
        }
    };

    const toggleContextBar = () => setContextBarVisibility(!isContextBarVisible);

    const togglePinnedDocument = document => {
        if (isPinned(document)) {
            setPinnedDocuments(pinnedDocuments.filter(d => d.id !== document.id));
        } else {
            setPinnedDocuments(pinnedDocuments.concat([document]));
        }
    };

    const isPinned = document => pinnedDocuments.some(d => d.id == document.id);

    const removeAllPinnedDocuments = () => setPinnedDocuments([]);

    return (
        <AnalysisContext.Provider
            value={{
                dateRange,
                collections,
                dateRangeChangeHandler,
                changeCollectionsSelectorHandler,
                isContextBarVisible,
                toggleContextBar,
                pinnedDocuments,
                togglePinnedDocument,
                isPinned,
                removeAllPinnedDocuments,
                setDateRange,
                setCollections,
                shouldUpdateSearchHistory,
                setShouldUpdateSearchHistory
            }}
        >
            {props.children}
        </AnalysisContext.Provider>
    );
};

export default withRouter(AnalysisState);