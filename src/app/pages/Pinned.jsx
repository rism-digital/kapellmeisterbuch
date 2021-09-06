import React, { useContext } from 'react';

import { Link } from 'react-router-dom';

import Template from '../components/template/Template.jsx';
import SearchResultsItem from '../components/template/components/SearchResultsItem.jsx';
import Breadcrumbs from '../components/template/components/Breadcrumbs.jsx';
import { PrimaryButtonSmall } from '../components/template/components/Buttons.jsx';
import FlexWrapper from '../components/template/components/FlexWrapper.jsx';
import FixedHeader from '../components/template/components/FixedHeader.jsx';

import AnalysisContext from '../context/analysisContext';

import { t } from '../i18n';

const PinnedPage = () => {

    const { pinnedDocuments, togglePinnedDocument, removeAllPinnedDocuments } = useContext(AnalysisContext);

    const removeAll = () => {
        confirm('Are you sure?') && removeAllPinnedDocuments();
    };

    return (
        <Template>
            <FixedHeader>
                <FlexWrapper justifyContent="space-between">
                    <Breadcrumbs elements={[
                        <span>{t('pinned.path')}</span>
                    ]} />

                    <FlexWrapper justifyContent="flex-end" alignItems="center">
                        <PrimaryButtonSmall disabled={pinnedDocuments.length == 0} action={removeAll}>{t('pinned.purge')}</PrimaryButtonSmall>
                    </FlexWrapper>
                </FlexWrapper>
                <h3>
                    {
                        pinnedDocuments.length > 0
                            ? t('pinned.header', { count: pinnedDocuments.length })
                            : t('pinned.noPins')
                    }
                </h3>
            </FixedHeader>
            <div style={{ paddingTop: '5em' }}>
                {pinnedDocuments.map(element => (
                    <SearchResultsItem key={element.id}>
                        <FlexWrapper justifyContent="space-between" alignItems="center">
                            <FlexWrapper style={{ width: '70%' }}>
                                <img src={`//iiif.rism-ch.org/cgi-bin/iipsrv.fcgi?FIF=/usr/local/images/lausanne/${element.images_ss[0]}&WID=40&CVT=JPG`} />
                                <div style={{ marginLeft: '1.5em' }}>
                                    <h4 style={{ padding: '.25rem 0' }}>
                                        <Link to={`/source/${element.id.replace('.xml', '')}`}>
                                            <b>{element.title_s}</b>
                                        </Link>
                                    </h4>
                                    {element.place_s}
                                    <br />
                                    <span className="small">{element.year_i}</span>
                                </div>
                            </FlexWrapper>
                            <PrimaryButtonSmall action={() => togglePinnedDocument(element)}>
                                {t('search.actions.unpin')}
                            </PrimaryButtonSmall>
                        </FlexWrapper>
                    </SearchResultsItem>
                ))}
            </div>
        </Template>
    );

};

export default PinnedPage;