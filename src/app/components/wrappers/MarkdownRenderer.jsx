import React, { useContext } from 'react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

import { createMarkup } from '../../model/markdownHelper';
import GlobalContext from '../../context/globalContext';

import { Link } from 'react-router-dom';

import './MarkdownRenderer.scss';

export const linkRenderer = props => {
    return props.href.match(/^(https?:)?\/\//)
        ? <a href={props.href} target="_blank" rel="noopener noreferrer">{props.children}</a>
        : <Link to={props.href}>{props.children}</Link>;
};

const MarkdownRenderer = ({ filename }) => {
    const { language } = useContext(GlobalContext);

    return (
        <Markdown
            renderers={{ link: linkRenderer }}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
        >{createMarkup({ filename, language })}</Markdown>
    );

    // return (
    //     <ReactMarkdown
    //         source={createMarkup({ filename, language })}
    //         renderers={{ link: linkRenderer }}
    //         escapeHtml={false}
    //     />
    // );
};

export default MarkdownRenderer;