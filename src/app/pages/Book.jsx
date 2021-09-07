import React, { useEffect, useState } from 'react';

import KbTagged from '../../../public/KbTagged.html';

import Template from '../components/template/Template.jsx';

import Diva from '../components/wrappers/Diva.jsx';

import { PrimaryButtonSmall } from '../components/template/components/Buttons.jsx';
import Select from '../components/form/Select.jsx';
import FlexWrapper from '../components/template/components/FlexWrapper.jsx';

import { useDidMount } from '../hooks/useDidMount';

const anchorClickHandler = (id) => {
    const highlighted = document.getElementsByClassName('highlight');

    for (let item of highlighted) {
        item.classList.remove('highlight');
    }

    const element = document.getElementById(id);

    const position = id.includes('d1e') ? 'center' : 'start';

    if (element) {
        element.classList.add('highlight');
        element.scrollIntoView({
            behavior: 'auto',
            block: position,
            inline: position
        });

        document.getElementById('scroller').scrollLeft = 0;
    }

};

const TestHtml = () => {

    const [currentPage, setCurrentPage] = useState(0);
    const [currentPageURI, setCurrentPageURI] = useState('');
    const [currentHash, setCurrentHash] = useState();
    const [pageOptions, setPageOptions] = useState([]);
    const [isMobile, setIsMobile] = useState(window.outerWidth < 1440);
    const [leftSideSize, setLeftSideSize] = useState(window.outerWidth >= 1440 ? 60 : 100);
    const [divaVisible, setDivaVisible] = useState(!isMobile);
    const [initialPageURI, setInitialPageURI] = useState();

    const onHashChange = () => {
        if (currentHash) {
            anchorClickHandler(currentHash);
        } else {
            window.scrollTop = 0;
        }
    };

    const setCurrentHashByWindowHash = () => {
        const anchor = window.location.hash.substring(1);
        setCurrentHash(anchor);

        if (anchor) {
            anchorClickHandler(anchor);

            const scroller = document.getElementById('scroller');

            const scrollTop = scroller.scrollTop;
            const boxHeight = scroller.offsetHeight;

            const pagebreaks = document.getElementsByClassName('pagebreak');

            let min = 9999999999;
            let page;

            for (let item of pagebreaks) {

                const offset = Math.abs(item.offsetTop - (scrollTop - boxHeight / 2));

                if (min >= offset) {
                    min = offset;
                    page = item;
                }
            }

            page && setInitialPageURI(`https://iiif.rism.digital/image/ch/CH_E_925_03/pyr_${page.id}.tif`);
        }

    };

    const didMount = useDidMount();

    const onScrollHtmlHandler = (e) => {
        if (e.target.id !== 'scroller') {
            return;
        }

        const scrollTop = e.target.scrollTop;
        const boxHeight = e.target.offsetHeight;

        const pagebreaks = document.getElementsByClassName('pagebreak');

        let min = 9999999999;
        let page;

        for (let item of pagebreaks) {

            const offset = Math.abs(item.offsetTop - (scrollTop - boxHeight / 2));

            if (min >= offset) {
                min = offset;
                page = item;
            }
        }

        setCurrentPageURI(`https://iiif.rism.digital/image/ch/CH_E_925_03/pyr_${page.id}.tif`);
    };

    const updateLayout = () => {
        setIsMobile(window.outerWidth < 1440);

        if (window.outerWidth >= 1440) {
            setLeftSideSize(60);
        } else {
            setLeftSideSize(100);
        }
    };

    if (!didMount) {
        window.addEventListener('hashchange', setCurrentHashByWindowHash, false);
        window.addEventListener('resize', updateLayout, false);
    }

    useEffect(onHashChange, [currentHash]);

    useEffect(() => {
        if (!didMount) {
            setCurrentHashByWindowHash();
        }
    }, [didMount]);

    useEffect(() => {
        setDivaVisible(!isMobile);
    }, [isMobile]);


    const generateSelectPageOptions = (pageCount) => {
        const options = [];
        for (let k = 0; k < pageCount; k++) {
            options.push({ value: k, label: k == 0 ? 'Cover' : k });
        }

        setPageOptions(options);
    };

    const divaWrapperStyle = isMobile
        ? {
            width: 'calc(100% - 75px)', padding: '1em', right: divaVisible ? 0 : '-100%', zIndex: 1, position: 'fixed', transition: 'right 1s ease-in-out', background: '#fff'
        }
        : {
            width: '40%', padding: '1em', marginRight: '-100%'
        };

    return (
        <Template>
            <div style={{ display: 'flex', maxWidth: 'calc(100% - 75px)', position: 'fixed', height: 'calc(100vh - 73px)', margin: '-45px 0 -2em -3em' }}>
                <div style={{ width: divaVisible ? `${leftSideSize}%` : '100%', height: '100%', overflowY: 'auto', borderRight: '2px solid #e3e3e3', transition: 'width 1s ease-in-out' }}>

                    <div
                        id="scroller"
                        onScroll={onScrollHtmlHandler}
                        style={{ width: '100%', height: 'calc(100% - 70px)', overflowY: 'auto', paddingRight: '2em' }}
                        dangerouslySetInnerHTML={{ __html: KbTagged }}
                    />

                    <a href="#" style={{ position: 'fixed', bottom: '26px', right: '1em', zIndex: 1 }} onClick={e => { e && e.preventDefault(); setDivaVisible(!divaVisible); }}>
                        {divaVisible ? 'Hide Diva' : 'Show Diva'}
                    </a>

                    <FlexWrapper justifyContent="center" style={{ borderTop: '2px solid #e3e3e3', position: 'absolute', bottom: 0, height: '70px', padding: '10px 70px 10px 0', width: '100%', background: '#fff' }}>


                        <FlexWrapper style={{ width: '250px' }} className="nav">
                            <div style={{ marginTop: '-6px' }}>
                                <label>Navigation</label>
                                <FlexWrapper>

                                    <PrimaryButtonSmall disabled={currentPage === 0} action={() => setCurrentPage(currentPage - 1 || 0)}>
                                        <span>&laquo;&nbsp;Prev</span>
                                    </PrimaryButtonSmall>

                                    <PrimaryButtonSmall style={{ marginLeft: '2px' }} disabled={currentPage === pageOptions.length - 1} action={() => setCurrentPage(currentPage + 1)}>
                                        <span>Next&nbsp;&raquo;</span>
                                    </PrimaryButtonSmall>
                                </FlexWrapper>
                            </div>

                            <Select
                                label="Current page"
                                style={{ marginLeft: '1em', marginTop: '-6px' }}
                                inputStyle={{ padding: '.5rem' }}
                                options={pageOptions}
                                value={currentPage}
                                onChangeHandler={value => setCurrentPage(parseInt(value, 10))}
                            />

                        </FlexWrapper>
                    </FlexWrapper>
                </div>

                <div style={divaWrapperStyle}>

                    <Diva
                        manifest="CH_E_925_03.json"
                        currentPage={currentPage}
                        initialPage={currentPage}
                        currentPageURI={currentPageURI}
                        initialPageURI={initialPageURI}
                        onLoad={count => { generateSelectPageOptions(count); }}
                        onPageChangeHandler={setCurrentPage}
                        onScrollHandler={index => anchorClickHandler(index.replace('https://iiif.rism.digital/image/ch/CH_E_925_03/pyr_', '').slice(0, -4))}
                        enableLinkIcon
                        enablePlugins
                    />
                </div>
            </div>
        </Template >
    );
};

export default TestHtml;