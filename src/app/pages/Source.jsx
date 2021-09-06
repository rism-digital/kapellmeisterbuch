import React, { useState, useEffect } from 'react';

import Template from '../components/template/Template.jsx';

import DocumentDetail from '../components/shared/DocumentDetail.jsx';

import Solr from '../model/Solr';

const Source = ({ match }) => {

    const [data, setData] = useState({});

    const manifest = `${match.params.manifest}.xml`;

    useEffect(
        () => {
            Solr
                .search({ searchKey: `id:${manifest}` })
                .then(solr => setData({ ...solr.response }));
        }, []
    );

    return (
        <Template>
            {
                (data && data.docs)
                    ? (
                        <DocumentDetail
                            selectedResource={data.docs[0]}
                            unsetSearchSelected={history.length && (() => window.history.go(-1))}
                        />
                    )
                    : (
                        <span>Loading</span>
                    )
            }

        </Template>
    );
};


export default Source;