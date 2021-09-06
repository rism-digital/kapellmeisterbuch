import React from 'react';

import './Breadcrumbs.scss';

const Breadcrumbs = props => (
    <div className="breadcrumbs-root">
        {props.elements.map((e, index) => <span key={index} className="breadcrumbs-element">{e}{
            index !== props.elements.length - 1 && <span className="breadcrumbs-spacer">/</span>
        }</span>)}
    </div>
);

export default Breadcrumbs;