import React from 'react';
import { Link } from 'react-router-dom';

import { t } from '../../../i18n';

export const Navbar = () => {
    return (
        <div className="navbar-root">
            <Link to="/" style={{ color: '#323232', textDecoration: 'none', fontWeight: 800 }}>
                Kapellmeisterbuch
                {/* <img src="//iiif.rism-ch.org/onstage/images/logo_trans-75-b.png" style={{ maxHeight: '38px' }} /> */}
            </Link>
            <div className="navbar-menu">
                <Link to="/">{t('common.topMenu.pages.items.home')}</Link>
                <Link to="/page/about">{t('common.topMenu.pages.items.about')}</Link>
            </div>
        </div>
    );
};
