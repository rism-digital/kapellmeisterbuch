import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import JsonSearch from './pages/JsonSearch.jsx';
import JsonBrowse from './pages/JsonBrowse.jsx';
import Book from './pages/Book.jsx';
import StaticHtml from './pages/StaticHtml.jsx';
import Index from './pages/Index.jsx';

import AnalysisState from './context/AnalysisState.jsx';
import CustomState from './context/CustomState.jsx';


const Router = () => (
    <BrowserRouter>
        <AnalysisState>
            <CustomState>
                <Route path="/page/:filename" component={StaticHtml} />
                <Route path="/" exact component={Index} />
                <Route path="/search" exact component={JsonSearch} />
                <Route path="/browse" exact component={JsonBrowse} />
                <Route path="/book" exact component={Book} />
            </CustomState>
        </AnalysisState>
    </BrowserRouter>
);

export default Router;