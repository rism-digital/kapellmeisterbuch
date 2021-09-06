import React from 'react';

export const ContextBar = ({ visible, ...props }) => {
    const classNames = ['contextBar-root'];

    if (visible) {
        classNames.push('contextBar__visible');
    }

    return (
        <div className={classNames.join(' ')}>
            <div className="contextBar-driver" onClick={props.toggleBar} />
            {props.children}
        </div>
    );
};