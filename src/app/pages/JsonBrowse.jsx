import React, { useContext } from 'react';
import { useStateWithSession } from '../service/serviceStorage';

import { Link } from 'react-router-dom';

import Template from '../components/template/Template.jsx';

import CurstomContext from '../context/customContext';

import Select from '../components/form/Select.jsx';
import FlexWrapper from '../components/template/components/FlexWrapper.jsx';
import Collapsible from '../components/template/components/Collapsible.jsx';

import { PrimaryButton } from '../components/template/components/Buttons.jsx';

import { t } from '../i18n';
const indexes = () => [
    { value: 'Composers', label: 'Composers' },
    { value: 'Dates', label: 'Dates' },
    { value: 'Feasts', label: 'Feasts' },
];

const JsonBrowse = () => {

    const { performBrowse, browseResults, loadingBrowse, loadRelated, loadingRelated, related } = useContext(CurstomContext);

    const [selectedIndex, setSelectedIndex] = useStateWithSession('', 'selectedIndex', 'CustomState');
    const selectChangeHandler = value => {
        const testValue = /\S/.test(value);
        testValue && setSelectedIndex(value);
    };

    const isLoadingRelated = (key, name) => loadingRelated && loadingRelated.params.key == key && loadingRelated.params.name == name;

    return (
        <Template>
            <form style={{ marginTop: '.5em', marginBottom: '2em' }} onSubmit={(e) => { e.preventDefault(); performBrowse(selectedIndex); }}>
                <FlexWrapper>
                    <Select
                        value={selectedIndex}
                        placeholder={t('browse.form.select_placeholder')}
                        onChangeHandler={selectChangeHandler}
                        options={indexes()}
                    />
                    <PrimaryButton disabled={loadingBrowse} type="submit">{t(`browse.form.${loadingBrowse ? 'loading' : 'submit'}`)}</PrimaryButton>
                </FlexWrapper>
            </form>
            {
                loadingBrowse
                    ? <FlexWrapper justifyContent="center" alignItems="center" style={{ flexDirection: 'column', height: '70vh' }}>
                        <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                        <h4>Loading data, please wait..</h4>
                    </FlexWrapper>
                    : browseResults && browseResults.map((e, key) => (
                        <React.Fragment key={e.name}>
                            <Collapsible key={e.name} header={(<h3 className="collapsible-header-caption" style={{ borderBottom: '1px solid #e8e8e8', display: 'block', width: '100%', paddingBottom: '.5em' }}>
                                {e.name}
                            </h3>)}>
                                {e.group && Array.isArray(e.group) && e.group.map(linked => (
                                    <Collapsible
                                        key={linked.name}
                                        header={(<h4 className="collapsible-header-caption" style={{ borderBottom: '1px solid #e8e8e8', display: 'block', width: '100%', paddingBottom: '.5em' }}>{linked.name}</h4>)}
                                        onClickHandler={collapsed => !collapsed && loadRelated({ index: selectedIndex, params: { key, name: linked.name } })}
                                    >
                                        {
                                            isLoadingRelated(key, linked.name) && <div><div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                                                <h4>Loading data, please wait..</h4></div>
                                        }
                                        {
                                            (!isLoadingRelated(key, linked.name) && related[`${key}_${linked.name}`] && Array.isArray(related[`${key}_${linked.name}`])) && related[`${key}_${linked.name}`].map(data => {
                                                return <div key={data.name}>{data.name}
                                                    <ul>
                                                        {data.link && Array.isArray(data.link) && data.link.map((e, index) => <li key={index}>{e.label} <Link to={`/book#${e.target.split(';')[1]}`}>{t('search.actions.go')}</Link></li>)}
                                                        {data.link && !Array.isArray(data.link) && <li>{data.link.label} <Link to={`/book#${data.link.target.split(';')[1]}`}>{t('search.actions.go')}</Link></li>}
                                                    </ul>
                                                </div>;
                                            })
                                        }
                                        {
                                            (!isLoadingRelated(key, linked.name) && related[`${key}_${linked.name}`] && !Array.isArray(related[`${key}_${linked.name}`])) &&
                                            (
                                                <div key={related[`${key}_${linked.name}`].name}>{related[`${key}_${linked.name}`].name}
                                                    <ul>
                                                        {related[`${key}_${linked.name}`].link && Array.isArray(related[`${key}_${linked.name}`].link) && related[`${key}_${linked.name}`].link.map((e, index) => <li key={index}>{e.label} <Link target="_blank" to={`/book#${e.target.split(';')[1]}`}>{t('search.actions.go')}</Link></li>)}
                                                        {related[`${key}_${linked.name}`].link && !Array.isArray(related[`${key}_${linked.name}`].link) && <li>{related[`${key}_${linked.name}`].link.label} <Link target="_blank" to={`/book#${related[`${key}_${linked.name}`].link.target.split(';')[1]}`}>{t('search.actions.go')}</Link></li>}
                                                    </ul>
                                                </div>
                                            )

                                        }

                                    </Collapsible>
                                ))}
                            </Collapsible>

                        </React.Fragment>
                    ))
            }
        </Template >
    );
};

export default JsonBrowse;
