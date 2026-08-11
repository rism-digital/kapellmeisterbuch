import { Document } from 'flexsearch';
import records from '../../../dataset/KbFulltext.json';

const documents = records.map((record, id) => ({ id, ...record }));

const index = new Document({
    document: {
        id: 'id',
        index: [{ field: 'transcription', tokenize: 'full' }],
        store: ['ref', 'transcription']
    }
});

documents.forEach(document => index.add(document));

export const search = query => {
    const key = query.trim();

    if (!key) {
        return [];
    }

    return index
        .search(key, { index: 'transcription', enrich: true, limit: documents.length })
        .flatMap(result => result.result.map(match => match.doc));
};

export default { search };
