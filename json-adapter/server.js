const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for everybody
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var data = require('./public/KbIndex.json');
var fulltext = require('./public/KbFulltext.json');

app.get('/api/browse', (req, res) => {

    const index = req.query.index;
    const params = req.query.params && JSON.parse(req.query.params);

    // if related data is passed we are going to return only related data
    if (params) {
        const group = data.index.group.find(group => group.name === index).group[params.key].group;
        const dataset = group.find(group => group.name === params.name).group;

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

    res.send(group);
});


app.get('/api/search', (req, res) => {
    const key = req.query.key.toLowerCase();

    const results = [];

    fulltext.forEach(elem => {
        if (elem.transcription.toLowerCase().includes(key)) {
            results.push(elem);
        }
    });

    res.send(results);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
