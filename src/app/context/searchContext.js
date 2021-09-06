import { createContext } from 'react';

export default createContext({
    searchResults: {},
    searchTerms: {},
    isLoading: false,
    selectedResource: null
});