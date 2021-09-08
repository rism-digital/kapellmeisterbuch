const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

const getArgs = require('./model/argvHelper.js');


// Enable CORS for everybody
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const args = getArgs();
const devMode = args.env && args.env == 'dev';
const path = devMode ? '../' : './';

// import the dataset
const data = require(`${path}dataset/KbIndex.json`);
const fulltext = require(`${path}dataset/KbFulltext.json`);

app.get('/api/browse', (req, res) => {

    const index = req.query.index;
    const params = req.query.params && JSON.parse(req.query.params);

    if (devMode) {
        console.log('[REQUEST_PAYLOAD]');
        console.log(req.query);
    }

    // if related data is passed we are going to return only related data
    if (params) {
        const group = data.index.group.find(group => group.name === index).group[params.key].group;
        const dataset = group.find(group => group.name === params.name).group;

        if (devMode) {
            console.log('[RESPONSE_PAYLOAD]');
            console.log(dataset);
        }

        res.send(dataset);
        return;
    }

    // we want to return a subset of data purged of related 
    const group = data.index.group
        .find(group => group.name === index).group
        .map(e => ({
            name: e.name,
            group: e.group
                ? Array.isArray(e.group) ? e.group.map(group => ({ name: group.name })) : e.group
                : {}
        }));

    if (devMode) {
        console.log('[RESPONSE_PAYLOAD]');
        console.log(group);
    }

    res.send(group);
});


app.get('/api/search', (req, res) => {
    const key = req.query.key.toLowerCase();

    if (devMode) {
        console.log('[REQUEST_PAYLOAD]');
        console.log(req.query);
    }

    const results = [];

    fulltext.forEach(elem => {
        if (elem.transcription.toLowerCase().includes(key)) {
            results.push(elem);
        }
    });

    if (devMode) {
        console.log('[RESPONSE_PAYLOAD]');
        console.log(results);
    }

    res.send(results);
});

app.listen(port, () => devMode && console.log(`Listening on port ${port}`));
