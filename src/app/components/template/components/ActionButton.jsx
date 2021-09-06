import React from 'react';

const ActionButton = ({ children, action, disabled = false, ...props }) => {

    const performAction = e => {
        e.preventDefault();

        action && action();
    };

    return (
        <button
            className={props.className}
            style={props.style}
            onClick={performAction}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default ActionButton;