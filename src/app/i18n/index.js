const english = require('./en.json');
const italian = require('./it.json');
const francais = require('./fr.json');
const deutsch = require('./de.json');

const resources = {
    en: english,
    it: italian,
    fr: francais,
    de: deutsch
};

const FALLBACK_LANGUAGE = 'en';

let resource;

export const fetchLanguageFromBrowser = () => {
    // if (window.navigator.userLanguage) {
    //     return window.navigator.userLanguage.substring(0, 2);
    // }

    // if (window.navigator.language) {
    //     return window.navigator.language.substring(0, 2);
    // }

    return FALLBACK_LANGUAGE;
};

const injectValues = (label, values = {}, plural = undefined) => {

    if (values.count != null && values.count !== 1 && plural) {
        label = plural;
    }

    Object
        .keys(values)
        .forEach(key => label = label.replace(`{{${key}}}`, values[key]));

    return label;
};

export const initLanguage = language => {
    resource = resources[language.substring(0, 2)];
};

export const initI18N = () => new Promise((resolve, reject) => {
    try {
        resource = resources[fetchLanguageFromBrowser()];
        resolve();

    } catch (e) {
        reject(e);
    }
});

export const t = (keyString = '', keyValueReplacesObject = {}) => {
    let label = keyString;

    const keys = keyString.split('.');

    let arrayWalk = [resource[keys[0]]];

    let plural;

    for (let k = 1; k < keys.length; k++) {
        if (arrayWalk[k - 1] && arrayWalk[k - 1][keys[k]]) {
            arrayWalk.push(arrayWalk[k - 1][keys[k]]);
            plural = arrayWalk[k - 1][`${keys[k]}_plural`];
        }
    }

    label = arrayWalk[keys.length - 1] || label;

    return injectValues(label, keyValueReplacesObject, plural);
};