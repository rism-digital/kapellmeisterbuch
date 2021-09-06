import React from 'react';

const ActionLink = ({ children, action, disabled = false }) => {

    const performAction = e => {
        e.preventDefault();

        action && action();
    };

    if (disabled) {
        return (
            <span>{children}</span>
        );
    }

    return (
        <a href="#" onClick={performAction}>
            {children}
        </a>
    );
};

export default ActionLink;