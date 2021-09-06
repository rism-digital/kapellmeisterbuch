import React, { useContext } from 'react';

import './FixedHeader.scss';
import AnalysisContext from '../../../context/analysisContext';

const FixedHeader = ({ children, style }) => {

    const { isContextBarVisible } = useContext(AnalysisContext);

    const classNames = ['fixedHeader'];

    if (isContextBarVisible) {
        classNames.push('fixedHeader__with-contextBar');
    }


    return (
        <div className={classNames.join(' ')} {...style}>
            {children}
        </div>
    );
};

export default FixedHeader;