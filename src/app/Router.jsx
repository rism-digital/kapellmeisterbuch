import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Search from './pages/Search.jsx';
import Inventari from './pages/Inventari.jsx';
import Consulta from './pages/Consulta.jsx';
import Inventario from './pages/Inventario.jsx';
import InventariBrowse from './pages/InventariBrowse.jsx';
import Source from './pages/Source.jsx';
import Browse from './pages/Browse.jsx';
import Pinned from './pages/Pinned.jsx';
import Book from './pages/Book.jsx';
import StaticHtml from './pages/StaticHtml.jsx';
import Index from './pages/Index.jsx';

import SearchState from './context/SearchState.jsx';
import BrowseState from './context/BrowseState.jsx';
import AnalysisState from './context/AnalysisState.jsx';
import NapoliState from './context/NapoliState.jsx';


const Router = () => (
    <BrowserRouter>
        <AnalysisState>
            {/* <SearchState>
                <Route path="/" exact component={Index} />
                <Route path="/search" component={Search} />
                <BrowseState>
                    <Route path="/browse" component={Browse} />
                </BrowseState>
            </SearchState> */}
            {/* <Route path="/pin" component={Pinned} />
            <Route path="/source/:manifest" component={Source} /> */}
            <NapoliState>
                <Route path="/page/:filename" component={StaticHtml} />
                <Route path="/" exact component={Index} />
                <Route path="/search" exact component={Inventari} />
                {/* <Route path="/inventario/:id" exact component={Inventario} />
                <Route path="/consulta" exact component={Consulta} />
                <Route path="/consulta/:inventory" exact component={Consulta} />
                <Route path="/consulta/:inventory/:page" exact component={Consulta} /> */}
                <Route path="/browse" exact component={InventariBrowse} />
                <Route path="/book" exact component={Book} />
            </NapoliState>
        </AnalysisState>
    </BrowserRouter>
);

export default Router;