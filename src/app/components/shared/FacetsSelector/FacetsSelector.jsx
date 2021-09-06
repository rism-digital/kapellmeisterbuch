import React from 'react';

import { normalizeFacetsResults } from '../../../model/Solr';
import { renderFacetLabel } from '../../../model/INDEXES';

import ListBox from '../../template/components/ListBox.jsx';
import FacetListBody from './components/FacetListBody.jsx';

const FacetsSelector = ({ searchResults, ...props }) => Object.keys(searchResults.facets).map(facetKey => {

    const normalizedFacets = normalizeFacetsResults(searchResults.facets[facetKey]);

    if (normalizedFacets.length == 0) {
        return null;
    }

    return (
        <ListBox
            key={facetKey}
            header={(
                <React.Fragment>
                    <span>{renderFacetLabel(facetKey)}</span>
                    <span>{normalizedFacets.length}</span>
                </React.Fragment>
            )}>
            <FacetListBody
                normalizedFacets={normalizedFacets}
                facetKey={facetKey}
                {...props}
            />
        </ListBox>
    );
});

export default FacetsSelector;