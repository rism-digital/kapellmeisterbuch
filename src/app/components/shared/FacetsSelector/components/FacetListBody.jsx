import React, { useState } from 'react';

import { t } from '../../../../i18n';

import Input from '../../../form/Input.jsx';


const FacetListBody = ({ normalizedFacets, facetKey, searchTerms, toggleSearchFilter }) => {

    const [filter, setFilter] = useState('');
    const [showMore, setShowMore] = useState(false);

    const toggleShowMore = (e) => {
        e.preventDefault();
        setShowMore(!showMore);
    };

    const list = normalizedFacets.filter(facet => facet.label.toLowerCase().includes(filter.toLowerCase()));

    return (
        <React.Fragment>
            <Input
                style={{
                    width: '100%',
                    margin: '-1em 0 1.2em 0',
                    padding: '.2em'
                }}
                placeholder={t('search.facets.filter')}
                value={filter}
                onChangeHandler={value => setFilter(value)}
            />
            {
                list.map(
                    (facet, index) =>
                        (index < 10 || showMore) && (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    background: searchTerms.filters.includes(
                                        `${facetKey}:${facet.label}`
                                    )
                                        ? '#eee'
                                        : 'transparent'
                                }}
                                key={index}
                                onClick={() =>
                                    toggleSearchFilter(facetKey, facet.label)
                                }
                            >
                                <span>{facetKey === 'collection_s' ? t(`common.collections.${facet.label}`) : facet.label}</span>
                                <span style={{ fontSize: '90%', fontWeight: 'bold' }}>{facet.count}</span>
                            </div>
                        )
                )
            }
            {
                list.length > 10 && (

                    <a href="#" onClick={toggleShowMore} style={{ margin: '10px 0 0 5px', display: 'block' }}>
                        {t(showMore ? 'search.facets.less' : 'search.facets.more')}
                    </a>

                )
            }
        </React.Fragment>
    );
};

export default FacetListBody;