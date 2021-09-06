import React from 'react';

import './ButtonGroup.scss';

export const ButtonGroup = ({ children, style }) => (
    <div className="buttonGroup-root" style={style}>
        {children}
    </div>
);

export default ButtonGroup;