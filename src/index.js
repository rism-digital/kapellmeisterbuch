import React from 'react';
import ReactDOM from 'react-dom';

import Router from './app/Router.jsx';

import GlobalState from './app/context/GlobalState.jsx';
import { initI18N } from './app/i18n/index.js';

const App = () => (
    <GlobalState>
        <Router />
    </GlobalState>
);

export const renderApp = () => {
    ReactDOM.render(
        <App />,
        document.getElementById('root')
    );
};

initI18N().then(renderApp());