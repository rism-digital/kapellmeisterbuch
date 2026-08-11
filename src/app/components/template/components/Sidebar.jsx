import React from 'react';

import { Link, withRouter } from 'react-router-dom';

import { SearchIcon, BrowseIcon, BookIcon } from './Icons.jsx';
import { ClearButton } from './Buttons.jsx';

const SidebarWithRoute = props => {

    const isActive = (path) => props.location.pathname.includes(path);

    return (
        <div className="sidebar-root">
            <Link to="/search">
                <ClearButton isActive={isActive('search')}>
                    <SearchIcon />
                </ClearButton>
            </Link>

            <Link to="/browse">
                <ClearButton isActive={isActive('browse')}>
                    <BrowseIcon />
                </ClearButton>
            </Link>

            <Link to="/book">
                <ClearButton isActive={isActive('book')}>
                    <BookIcon />
                </ClearButton>
            </Link>
        </div>
    );
};

export const Sidebar = withRouter(SidebarWithRoute);
