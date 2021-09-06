import React from 'react';

import './SearchResultsItem.scss';

const SearchResultsItem = ({ children }) => (
    <div className="searchResultsItem">
        {children}
    </div>
);

export default SearchResultsItem;