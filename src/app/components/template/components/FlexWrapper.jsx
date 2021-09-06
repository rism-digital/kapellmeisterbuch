import React from 'react';

import './FlexWrapper.scss';

export const FlexWrapper = ({ children, className, style, ...props }) => {

    const classNames = ['flexWrapper-root'];

    if (className) {
        classNames.push(className);
    }

    const extendedStyle = {
        ...style,
        ...props.justifyContent && { justifyContent: props.justifyContent },
        ...props.alignItems && { alignItems: props.alignItems }
    };

    return (
        <div className={classNames.join(' ')} style={extendedStyle}>
            {children}
        </div>
    );
};

export default FlexWrapper;