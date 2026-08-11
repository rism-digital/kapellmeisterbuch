import data from '../../../dataset/KbIndex.json';

const findIndex = index => data.index.group.find(group => group.name === index);

export const browse = index => {
    const group = findIndex(index);

    if (!group) {
        return [];
    }

    return group.group.map(entry => ({
        name: entry.name,
        group: entry.group
            ? Array.isArray(entry.group) ? entry.group.map(item => ({ name: item.name })) : entry.group
            : {}
    }));
};

export const related = (index, { key, name }) => {
    const group = findIndex(index)?.group?.[key]?.group;
    return group?.find(entry => entry.name === name)?.group || [];
};

export default { browse, related };
