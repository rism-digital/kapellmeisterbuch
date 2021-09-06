import React, { useContext } from 'react';

import Template from '../components/template/Template.jsx';
import { PrimaryButton, PrimaryButtonSmall } from '../components/template/components/Buttons.jsx';

import Input from '../components/form/Input.jsx';
import Select from '../components/form/Select.jsx';

import FixedHeader from '../components/template/components/FixedHeader.jsx';
import ActionLink from '../components/template/components/ActionLink.jsx';
import Chip from '../components/template/components/Chip.jsx';
import Paginator from '../components/template/components/Paginator.jsx';
import Breadcrumbs from '../components/template/components/Breadcrumbs.jsx';
import ButtonGroup from '../components/template/components/ButtonGroup.jsx';
import FlexWrapper from '../components/template/components/FlexWrapper.jsx';

import DocumentDetail from '../components/shared/DocumentDetail.jsx';
import FacetsSelector from '../components/shared/FacetsSelector/FacetsSelector.jsx';
import SearchResults from '../components/shared/SearchResults.jsx';
import PaginationHeader from '../components/shared/PaginationHeader.jsx';

import { generateSearchIndexes, renderFacetLabel } from '../model/INDEXES';

import SearchContext from '../context/searchContext';
import AnalysisContext from '../context/analysisContext';

import { t } from '../i18n';

const SearchPage = () => {

    // we store the SearchContext into the context const here to be able to
    // use the data and functions stored into the SearchState component
    // which provides the SearchContext.Provider
    const searchContext = useContext(SearchContext);
    const analysisContext = useContext(AnalysisContext);

    const totalPages = Math.ceil(searchContext.searchResults.numFound / 100);

    const renderLoading = () => {
        return searchContext.isLoading ? 'loading' : null;
    };

    const renderSearchResults = () => {
        return searchContext.searchResults.results.length > 0 ? (
            <React.Fragment>
                <div style={{ display: 'flex', jusityContent: 'space-between', width: '100%' }}>
                    <div style={{ padding: '1em 2em 1em 0', width: 'calc(100% - 318px)' }}>
                        <SearchResults {...searchContext} {...analysisContext} />
                    </div>
                    <div style={{ padding: '1em 0', minWidth: '318px', maxWidth: '318px' }}>
                        <FacetsSelector {...searchContext} />
                    </div>
                </div>
                <Paginator
                    onClickHandler={page => searchContext.selectPage(page - 1)}
                    page={searchContext.searchTerms.page + 1}
                    totalPages={totalPages}
                />

            </React.Fragment>
        ) : !searchContext.isLoading && searchContext.searchResults.numFound === 0 && <h3>{t('search.noResults')}</h3>;
    };

    const renderForm = () => (
        <FixedHeader>
            <FlexWrapper justifyContent="space-between">
                <Breadcrumbs
                    elements={[
                        <span>{t('search.path')}</span>
                    ]}
                />

                <FlexWrapper justifyContent="flex-end" alignItems="center">
                    <ButtonGroup style={{ margin: '0 .5em' }}>
                        <PrimaryButtonSmall disabled={searchContext.searchHistory.length == 0 || searchContext.currentSearchHistoryIndex == 0} action={searchContext.goToPreviousSearch}>
                            {'<<'}
                        </PrimaryButtonSmall>
                        <PrimaryButtonSmall disabled={searchContext.searchHistory.length == 0 || searchContext.currentSearchHistoryIndex == searchContext.searchHistory.length - 1} action={searchContext.goToNextSearch}>
                            {'>>'}
                        </PrimaryButtonSmall>
                    </ButtonGroup>
                    <PrimaryButtonSmall disabled={searchContext.searchHistory.length == 0} action={() => confirm('Are you sure?') && searchContext.purgeSearchHistory()}>
                        {'reset'}
                    </PrimaryButtonSmall>
                </FlexWrapper>

            </FlexWrapper>
            <form style={{ marginTop: '.5em' }} onSubmit={searchContext.searchFormSubmitHandler} >
                <FlexWrapper justifyContent="flex-start">
                    <Input
                        style={{ width: '100%' }}
                        className="input__search"
                        placeholder={t('search.form.search_placeholder')}
                        value={searchContext.searchTerms.searchKey}
                        onChangeHandler={searchContext.searchParamChangeHandler('searchKey')}
                    />
                    <Select
                        style={{ flex: 1, minWidth: '211px' }}
                        value={searchContext.searchTerms.indexes[0]}
                        // placeholder={t('search.form.select_placeholder')}
                        options={[{ label: 'Full-text', value: '' }].concat(generateSearchIndexes())}
                        onChangeHandler={searchContext.searchParamChangeHandler('indexes')}
                    />
                    <PrimaryButton type="submit">{t('search.form.submit')}</PrimaryButton>
                </FlexWrapper>
            </form>
            {renderChips()}
            <PaginationHeader {...searchContext} />
        </FixedHeader >
    );

    const renderChips = () => (
        <React.Fragment>
            {
                searchContext.searchTerms.filters.length > 0 ? (
                    <div style={{ padding: '.5em 0' }}>
                        {
                            searchContext.searchTerms.filters.map(filter => {
                                const filterData = filter.split(':');
                                return (
                                    <Chip removeAction={() => searchContext.toggleSearchFilter(filterData[0], filterData[1])} key={filter}>{`${renderFacetLabel(filterData[0])} > ${filterData[1]}`}</Chip>
                                );
                            })
                        }
                    </div>

                ) : null
            }
        </React.Fragment>
    );

    return (
        <Template>
            {
                searchContext.selectedResource
                    ? (
                        <React.Fragment>
                            <Breadcrumbs
                                elements={[
                                    <ActionLink action={searchContext.unsetSearchSelected}>{t('search.path')}</ActionLink>,
                                    <span>{searchContext.searchTerms.searchKey}</span>
                                ]}
                            />
                            <DocumentDetail {...searchContext} goBackHidden />
                        </React.Fragment>
                    )
                    : (
                        <React.Fragment>
                            {renderForm()}
                            <div style={{ marginTop: searchContext.searchTerms.filters.length > 0 ? '11.5em' : '8.5em' }}>
                                {searchContext.isLoading ? renderLoading() : renderSearchResults()}
                            </div>
                        </React.Fragment>
                    )
            }
        </Template>
    );
};

export default SearchPage;
