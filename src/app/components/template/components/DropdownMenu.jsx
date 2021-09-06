'use_strict';

import React, { useState } from 'react';

import './DropdownMenu.scss';

const DropdownMenu = ({ label, items = [], ...props }) => {
    const [visible, setVisible] = useState(false);

    const toggleVisibility = () => setVisible(!visible);

    return (
        <div className={`dropdownMenu-root ${visible ? 'dropdownMenu-root__visible' : ''}`}>
            <a href="#" onClick={toggleVisibility}>{label}</a>
            <ul className={`dropdownMenu-submenu ${visible ? 'dropdownMenu-submenu__visible' : ''}`}>
                {items.map((item, k) => <li key={k}>{item}</li>)}
            </ul>
            <div className={`dropdownMenu-closeMask ${visible ? 'dropdownMenu-closeMask__visible' : ''}`} onClick={toggleVisibility} />
        </div>
    );
};

export default DropdownMenu;