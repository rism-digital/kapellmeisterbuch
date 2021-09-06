import React from 'react';

import Template from '../components/template/Template.jsx';
import MarkdownRenderer from '../components/wrappers/MarkdownRenderer.jsx';

const StaticHtmlPage = ({ match }) => {
    const { filename } = match.params;

    return (
        <Template>
            <div className="markdown">
                <MarkdownRenderer filename={filename} />
            </div>
        </Template>
    );

};

export default StaticHtmlPage;