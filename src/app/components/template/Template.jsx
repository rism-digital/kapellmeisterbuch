import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';

import { Navbar } from './components/Navbar.jsx';
import { Sidebar } from './components/Sidebar.jsx';

import AnalysisContext from '../../context/analysisContext';

import '../../../index.scss';

import './Template.scss';

const Template = props => {

    const contentClassNames = ['template-content'];

    const { isContextBarVisible } = useContext(AnalysisContext);

    if (!props.hiddenContextBar && isContextBarVisible) {
        contentClassNames.push('template-content__with-contextBar');
    }

    return (
        <div className="template-root">
            <Navbar />
            <Sidebar />
            <div className={contentClassNames.join(' ')}>
                {props.children}
            </div>
        </div >
    );

};

export default withRouter(Template);