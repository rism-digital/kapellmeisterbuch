import React from 'react';

import './Chip.scss';

const Chip = (props) => (
    <div className="chip-root">
        {props.children}
        <span className="chip-closebtn" onClick={props.removeAction}>×</span>
    </div>
);

export default Chip;