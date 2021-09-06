import React from 'react';

import { t } from '../../i18n';

import Diva from '../wrappers/Diva.jsx';
import ActionLink from '../template/components/ActionLink.jsx';

import './DocumentDetail.scss';

const DocumentDetail = ({ selectedResource, unsetSearchSelected, goBackHidden }) => {
    const element = selectedResource;

    if (!element) {
        return <div>
            <h3>Resource not found</h3>
        </div>;
    }

    return (
        <div className="documentDetail-root">
            {
                unsetSearchSelected && goBackHidden == undefined && (
                    <ActionLink action={unsetSearchSelected}>
                        {t('browse.back')}
                    </ActionLink>
                )
            }

            <div className="documentDetail-wrapper">
                <div className="documentDetail-divaWrapper">
                    <Diva manifest={element.id} />
                </div>

                <div className="documentDetail-metadata">
                    <h2>{element.title_s}</h2>
                    <h3>
                        {element.place_s} - {element.year_i}
                    </h3>
                    <div>
                        {element.composer_ss && (
                            <React.Fragment>
                                <h4>Composers</h4>
                                {element.composer_ss.map(
                                    (composer, index) => (
                                        <div key={index}>
                                            {composer}
                                        </div>
                                    )
                                )}
                            </React.Fragment>
                        )}
                        {element.interpreter_ss && (
                            <React.Fragment>
                                <br />
                                <h4>Interpreters</h4>
                                {element.interpreter_ss.map(
                                    (interpreter, index) => (
                                        <div key={index}>
                                            {interpreter}
                                        </div>
                                    )
                                )}
                            </React.Fragment>
                        )}
                    </div>
                </div>

            </div>

        </div>
    );
};

export default DocumentDetail;