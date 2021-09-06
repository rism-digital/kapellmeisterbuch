import React, { useEffect } from 'react';

import { useStateWithSession } from '../service/serviceStorage';
import { initLanguage, fetchLanguageFromBrowser } from '../i18n';

import GlobalContext from './globalContext';

const SESSION_PREFIX = 'GlobalState';

const GlobalState = props => {

    const [language, setLanguage] = useStateWithSession('en', 'language', SESSION_PREFIX);

    useEffect(() => initLanguage(language), [language]);

    return (
        <GlobalContext.Provider
            value={{
                language,
                setLanguage
            }}
        >
            {props.children}
        </GlobalContext.Provider>
    );
};

export default GlobalState;