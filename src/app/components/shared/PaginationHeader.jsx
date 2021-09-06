import React from 'react';

import { t } from '../../i18n';

import ActionLink from '../template/components/ActionLink.jsx';

const getPrevPage = page => page && page - 1;
const getNextPage = (page, totalPages) => page + 1 < totalPages ? page + 1 : page;

const PaginationHeader = ({ isLoading, searchResults, searchTerms, selectPage }) => {

    const totalPages = Math.ceil(searchResults.numFound / 100);

    const counts = {
        from: searchTerms.page * 100 + 1,
        to: searchTerms.page + 1 < totalPages ? (searchTerms.page + 1) * 100 : searchResults.numFound,
        total: searchResults.numFound
    };

    return (
        <React.Fragment>
            {
                !isLoading && searchResults.numFound
                    ? (
                        <div className="small" style={{ margin: '1.5em 0 1.5em 0' }}>
                            <ActionLink
                                action={() => selectPage(getPrevPage(searchTerms.page))}
                                disabled={getPrevPage(searchTerms.page) === searchTerms.page}
                            >
                                {t('search.nav.prev')}
                            </ActionLink>
                            <span> | </span><b>{t('search.nav.count', counts)}</b><span> | </span>
                            <ActionLink
                                action={() => selectPage(getNextPage(searchTerms.page, totalPages))}
                                disabled={getNextPage(searchTerms.page, totalPages) === searchTerms.page}
                            >
                                {t('search.nav.next')}
                            </ActionLink>
                        </div>
                    )
                    : null
            }
        </React.Fragment>
    );
};

export default PaginationHeader;