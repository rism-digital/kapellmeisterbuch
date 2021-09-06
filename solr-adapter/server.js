const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for everybody
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const SOLR_URL_PRFIX = 'http://localhost:8984';


const sanitizeIndex = (index, searchKey) => index.includes('_s') ? `${index}:"${searchKey}"` : `${index}:${searchKey}`;

const generateSearchQueryByIndexes = ({ searchKey, indexes }) => indexes.map(index => sanitizeIndex(index, searchKey)).join();

const generateFacetsQueryString = ({ facets }) => `facet=on${facets.prefix ? `&facet.prefix=${facets.prefix}` : ''}&facet.sort=${facets.sort || 'count'}&facet.limit=${facets.limit || '-1'}&facet.mincount=${facets.mincount || 1}&facet.field=${facets.fields.join('&facet.field=')}`;

const generateFilterQueryByFilters = ({ filters }) => `fq=${filters.join('&fq=')}`;

const generateCollectionsQueryByFilters = ({ collections }) => `fq=collection_s:(${collections.join(' OR ')})`;


const generateQueryString = ({ facets, filters, collections }) => {
    const params = [];

    if (facets.fields && facets.fields.length > 0) {
        params.push(generateFacetsQueryString({ facets }));
    }

    if (filters.length > 0) {
        params.push(generateFilterQueryByFilters({ filters }));
    }

    if (collections.length > 0) {
        params.push(generateCollectionsQueryByFilters({ collections }));
    }

    return params.length > 0 ? encodeURI(`?${params.join('&')}`) : '';
};

const generateSearchQuery = params => {
    const {
        searchKey,
        indexes = [],
        dateRange = {},
        rows = 100,
        page = 0
    } = params;

    let query = {
        params: {
            q: indexes.length ? generateSearchQueryByIndexes({ searchKey, indexes }) : searchKey ? `${searchKey}` : '*:*',
            start: page * rows,
            rows,
            wt: 'json'
        }
    };

    if (dateRange.from || dateRange.to) {
        Object.assign(query.params, {
            fq: `year_i:[${dateRange.from || '*'} TO ${dateRange.to || '*'}]`
        });
    }

    return query;
};

const generateBrowseQuery = params => {
    const { index, prefix, sort } = params;

    let query = {
        params: {
            'terms.fl': index,
            'terms.limit': -1,
        }
    };

    if (prefix) {
        Object.assign(query.params, {
            'terms.regex': `${prefix}.*`,
            'terms.regex.flag': 'case_insensitive'
        });
    }

    if (['count', 'index'].includes(sort)) {
        Object.assign(query.params, {
            'terms.sort': sort
        });
    }

    return query;
};

const sanitizeFilter = filter => {
    const toks = filter.split(':');
    return `${toks[0]}:"${toks[1]}"`;
};

app.get('/api/search', (req, res) => {

    const facets = req.query.facets && JSON.parse(req.query.facets) || {};
    const dateRange = req.query.dateRange && JSON.parse(req.query.dateRange) || {};
    const filters = req.query.filters && req.query.filters.map(sanitizeFilter) || [];
    const collections = req.query.collections || [];



    const params = generateSearchQuery({
        searchKey: req.query.searchKey,
        indexes: req.query.indexes,
        dateRange,
        rows: req.query.rows,
        page: req.query.page
    });

    axios.get(`${SOLR_URL_PRFIX}/solr/onstage/select${generateQueryString({ facets, filters, collections })}`, params)
        .then(function (response) {
            //console.log(response);
            const resp = response.data;
            res.send(resp);
        }).catch(function (error) {
            console.log(error);
        });
});

app.get('/api/browse', (req, res) => {

    const params = generateBrowseQuery({
        index: req.query.index,
        prefix: req.query.prefix,
        sort: req.query.sort
    });

    axios.get(SOLR_URL_PRFIX + '/solr/onstage/terms', params)
        .then(function (response) {
            //console.log(response);
            const resp = response.data;
            res.send(resp);
        });

});

app.listen(port, () => console.log(`Listening on port ${port}`));
