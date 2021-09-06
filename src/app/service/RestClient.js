import Http from './Http';

const manageHttpError = (error) => {
    // TODO: if needed error management goes here
    return Promise.reject(error);
};

const get = params => {
    const { url, config } = params;

    return Http
        .get(url, config)
        .then(r => r.data)
        .catch(e => manageHttpError(e));
};

const put = params => {
    const { url, data, config } = params;

    return Http
        .put(url, data, config)
        .then(r => r.data)
        .catch(e => manageHttpError(e));
};

const post = params => {
    const { url, data, config } = params;

    return Http
        .post(url, data, config)
        .then(r => r.data)
        .catch(e => manageHttpError(e));
};

const httpDelete = params => {
    const { url, config } = params;

    return Http
        .delete(url, config)
        .then(r => r.data)
        .catch(e => manageHttpError(e));
};

export default {
    get,
    put,
    post,
    delete: httpDelete
};