import { createContext } from 'react';

export default createContext({
    searchResults: {},
    browseResults: [],
    browseTerms: {},
    isLoading: false,
    selectedIndex: '',
    selectedResource: null
});