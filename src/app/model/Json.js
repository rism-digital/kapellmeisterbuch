import RestClient from '../service/RestClient';


const debug = query => {
    if (DEBUG) {
        console.log(query.url, query.config && query.config.params);
    }

    return query;
};

export const search = params => {

    const query = debug({
        url: `${JSON_BASE_SERVER}/api/search`,
        config: { params }
    });

    return RestClient.get(query).then(r => r);
};

export const browse = params => {

    const query = debug({
        url: `${JSON_BASE_SERVER}/api/browse`,
        config: { params }
    });

    return RestClient.get(query).then(r => r);
};

export default {
    search,
    browse
};