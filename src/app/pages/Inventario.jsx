import React, { useContext/* , useState */ } from 'react';
import { Link } from 'react-router-dom';

import Template from '../components/template/Template.jsx';

import NapoliContext from '../context/napoliContext';
import { PrimaryClearButtonSmall } from '../components/template/components/Buttons.jsx';

// import Input from '../components/form/Input.jsx';
// import FlexWrapper from '../components/template/components/FlexWrapper.jsx';

// import { PrimaryButton } from '../components/template/components/Buttons.jsx';

import { t } from '../i18n';

import Diva from '../components/wrappers/Diva.jsx';

const printByKey = (string, key) => {
    switch (key) {
        case 'holding': { return <a href={string} target="_blank">{string}</a>; }
        case 'links': { return string.includes(';') ? <ul>{string.split(';').map((link, index) => <li style={{ paddingBottom: '.3em' }} key={index}><a href={link} target="_blank">{link}</a></li>)}</ul> : <a href={string} target="_blank">{string}</a>; }
        case 'other_names':
        case 'composer_names':
        case 'call_no': { return string.includes(';') ? <ul>{string.split(';').map((label, index) => <li style={{ paddingBottom: '.3em' }} key={index}>{label.replace(/ *\{[^}]*\} */g, '')}</li>)}</ul> : string.replace(/ *\{[^}]*\} */g, ''); }
        default: { return string; }
    }
};

const Inventario = ({ match }) => {

    const { dataStore, booted } = useContext(NapoliContext);

    const { id } = match.params;

    const element = dataStore[id];

    return (
        <Template>
            {booted && (
                <div>
                    <div style={{ display: 'flex', width: '100%' }}>
                        <div style={{ width: '60%', marginRight: '2em' }}>
                            <Diva manifest={`pyr_${element.inventory}_pyr_${element.inventory}-${parseInt(element.page, 10) < 10 ? `0${element.page}` : element.page}.tif.json`} />
                        </div>
                        <div style={{ width: '40%' }}>
                            <div style={{ float: 'right' }}>
                                <Link to={`/consulta/${element.inventory}/${element.page}`}>
                                    <span style={{ fontFamily: 'Lato', fontSize: '80%', margin: '0 3px', borderRadius: '.25rem', padding: '.5em 1em', color: '#fff', fontWeight: 900, background: '#00b5d6' }}>
                                        {t('inventory.actions.consult')}
                                    </span>
                                </Link>
                            </div>
                            {
                                Object.keys(element).map(key => element[key] && (
                                    <div key={key} style={{ paddingBottom: '.5em', marginTop: '1em' }}>
                                        <h5 style={{ padding: '.3em 0' }}>{t(`inventory.definitions.${key}`)}</h5>
                                        <div>{printByKey(element[key], key)}</div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            )}
        </Template>
    );
};

export default Inventario;