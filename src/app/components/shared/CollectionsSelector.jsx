import React from 'react';

import Checkbox from '../form/Checkbox.jsx';

import { generateCollections } from '../../model/INDEXES';

const CollectionSelector = ({ onChangeHandler, ...props }) => {
    const { collections } = props;

    return generateCollections().map(element => (
        <React.Fragment key={element.field}>
            <Checkbox
                onChangeHandler={checked => {
                    if (checked) {
                        onChangeHandler(collections.concat(element.field));
                    } else {
                        onChangeHandler(collections.filter(e => e !== element.field));
                    }
                }}
                value={element.field}
                name="collection_s"
                checked={collections.includes(element.field)}
                label={element.label}
            />
        </React.Fragment>
    ));
};

export default CollectionSelector;