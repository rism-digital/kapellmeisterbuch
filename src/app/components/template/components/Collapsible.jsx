import React, { useState } from 'react';

import './Collapsible.scss';

const BASE_CLASS_NAMES = ['collapsible-root'];

const Collapsible = props => {

    const [collapsed, setCollapsed] = useState(false);

    const [classNames, setClassNames] = useState(BASE_CLASS_NAMES);

    let animationTimer;

    const toggleCollapsed = () => {
        if (!collapsed) {
            setCollapsed(true);
            setClassNames([
                ...classNames,
                'collapsible__collapsed'
            ]);
            animationTimer = setTimeout(() => {
                setClassNames([
                    ...classNames,
                    'collapsible__collapsed',
                    'collapsible__collapsed-finished'
                ]);
            }, 200);
        } else {
            setCollapsed(false);
            setClassNames(BASE_CLASS_NAMES);
            clearTimeout(animationTimer);
        }

        props.onClickHandler && props.onClickHandler(collapsed);
    };

    return (
        <div className={classNames.join(' ')}>
            <div className="collapsible-header" onClick={toggleCollapsed}>
                {props.header}
            </div>

            <div className="collapsible-body">
                {props.children}
            </div>

        </div>
    );
};

export default Collapsible;