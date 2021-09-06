import { createContext } from 'react';

export default createContext({
    collections: [],
    dateRange: {},
    isContextBarVisible: true,
    pinnedDocuments: []
});