import React, { useContext } from 'react';
import ReactMarkdown from 'react-markdown/with-html';
import { createMarkup } from '../../model/markdownHelper';
import GlobalContext from '../../context/globalContext';

import { Link } from 'react-router-dom';

import './MarkdownRenderer.scss';

const linkRenderer = props => {
    return props.href.match(/^(https?:)?\/\//)
        ? <a href={props.href} target="_blank" rel="noopener noreferrer">{props.children}</a>
        : <Link to={props.href}>{props.children}</Link>;
};

const MarkdownRenderer = ({ filename }) => {
    const { language } = useContext(GlobalContext);

    return (
        <ReactMarkdown
            source={createMarkup({ filename, language })}
            renderers={{ link: linkRenderer }}
            escapeHtml={false}
        />
    );
};

export default MarkdownRenderer;