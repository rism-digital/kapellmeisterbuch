const notFoundDOM = '<div>Resource not found</div>';

export const fetchFileData = ({ filename, language }) => {
    try {
        const importedDOM = require(`../../../static/${filename}.${language}.md`);
        return importedDOM.default;

    } catch (e) {
        return false;
    }
};

export const createMarkup = ({ filename, language }) => fetchFileData({ filename, language }) || notFoundDOM;

export default {
    createMarkup,
    fetchFileData
};