import React from 'react';
import { withRouter } from 'react-router-dom';

import { Navbar } from './components/Navbar.jsx';
import { Sidebar } from './components/Sidebar.jsx';

import '../../../index.scss';

import './Template.scss';

const Template = props => {

    return (
        <div className="template-root">
            <Navbar />
            <Sidebar />
            <div className="template-content">
                {props.children}
            </div>
        </div >
    );

};

export default withRouter(Template);
