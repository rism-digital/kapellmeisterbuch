import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown/with-html';

import Template from '../components/template/Template.jsx';
import { fetchFileData } from '../model/markdownHelper';

import GlobalContext from '../context/globalContext.js';

const Index = () => {

    const { language } = useContext(GlobalContext);

    const indexMarkdown = fetchFileData({ filename: 'index', language });

    const defaultView = (
        <React.Fragment>
            <h1>Welcome to onStage!</h1>

            <h3>The main features of this pretty awesome research and analysis tool are <Link to="/search">Search</Link>, <Link to="/browse">Browse</Link> and <Link to="/pin">Pin</Link></h3>

            <h2>Search</h2>
            <p>The search section is designed to perform full-text or indexed researches upon the indexed data. The onStage project archive is bla bla and bla bla.</p>
            <p>Functionalities:</p>
            <ul>
                <li>Full-index research</li>
                <li>By index research</li>
                <li>Date range</li>
                <li>Collections selector</li>
                <li>Search history</li>
                <li>Facets filtering</li>
                <li>Pinning</li>
            </ul>

            <h2>Browse</h2>
            <p>The browse section is useful when you have to dive into indexes, just choose an index, select it and bla bla bla</p>
            <p>Functionalities:</p>
            <ul>
                <li>Index listing</li>
                <li>Fast alphabetical navigation</li>
                <li>Fast index navigation</li>
                <li>Nested results</li>
                <li>Go to Research</li>
                <li>Pinning</li>
            </ul>

            <h2>Pinned</h2>
            <p>The pinned section is an archive of pinned documents.</p>
        </React.Fragment>
    );

    return (
        <Template>
            <div className="markdown">
                {indexMarkdown ? <ReactMarkdown source={indexMarkdown} escapeHtml={false} /> : defaultView}
            </div>
        </Template>
    );
};

export default Index;