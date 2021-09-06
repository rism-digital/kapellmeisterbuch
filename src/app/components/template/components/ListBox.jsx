import React, { useState } from 'react';

import './ListBox.scss';

const BASE_CLASS_NAMES = ['listBox-root'];

const ListBox = props => {

    const [collapsed, setCollapsed] = useState(false);

    const [classNames, setClassNames] = useState(BASE_CLASS_NAMES);

    let animationTimer;

    const toggleCollapsed = () => {
        if (!collapsed) {
            setCollapsed(true);
            setClassNames([
                ...classNames,
                'listBox__collapsed'
            ]);
            animationTimer = setTimeout(() => {
                setClassNames([
                    ...classNames,
                    'listBox__collapsed',
                    'listBox__collapsed-finished'
                ]);
            }, 200);
        } else {
            setCollapsed(false);
            setClassNames(BASE_CLASS_NAMES);
            clearTimeout(animationTimer);
        }
    };

    return (
        <div className={classNames.join(' ')}>
            <div className="listBox-header" onClick={toggleCollapsed}>
                {props.header}
            </div>

            <div className="listBox-body">
                {props.children}
            </div>

        </div>
    );
};

export default ListBox;