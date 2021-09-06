import React, { Component } from 'react';

import Diva from 'diva.js/source/js/diva';
import 'diva.js/build/diva.css';

import './permalink.js';
import './snackbar.css';

import './Diva.scss';

export default class DivaReact extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loaded: false
        };

        this.diva;
        this.divaWrapper;

        this.debouncer;

        this.debounce = (cb, delay) => {
            if (this.debouncer == null) {
                this.debouncer = setTimeout(() => { cb(); this.debouncer = null; }, delay);
            }
        };
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.manifest !== this.props.manifest;
    }

    componentDidMount() {
        this.initDiva();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.currentPage != null && this.props.currentPage !== nextProps.currentPage) {
            this.state.loaded && this.diva.gotoPageByIndex(nextProps.currentPage);
        }

        if (nextProps.currentPageURI != null && this.props.currentPageURI !== nextProps.currentPageURI) {
            this.state.loaded && this.diva.gotoPageByURI(nextProps.currentPageURI);
        }

        if (this.props.onPageChangeHandler && this.state.loaded) {
            this.diva && this.props.onPageChangeHandler(this.diva.getActivePageIndex());
        }

        // console.log(nextProps.initialPageURI, this.props.initialPageURI);

        if (nextProps.initialPageURI && this.props.initialPageURI !== nextProps.initialPageURI) {
            this.state.loaded && this.diva.gotoPageByURI(nextProps.initialPageURI);
        }
    }

    initDiva() {

        if (this.props.manifest) {

            fetch(`${DIVA_BASE_MANIFEST_SERVER}${this.props.manifest}`)
                .then((r) => {
                    if (!r.ok) {
                        this.divaWrapper.innerHTML = '<div class="no-content"><h5>No image found</h5></div>';
                    } else {
                        this.diva = new Diva(this.divaWrapper.id, {
                            objectData: `${DIVA_BASE_MANIFEST_SERVER}${this.props.manifest}`,
                            enableGotoPage: this.props.enableGotoPage != undefined,
                            enableGridIcon: this.props.enableGridIcon != undefined,
                            enableLinkIcon: this.props.enableLinkIcon != undefined,
                            ...this.props.enablePlugins != undefined && { plugins: [Diva.PermalinkPlugin] }
                        });



                        if (this.props.onScrollHandler) {
                            Diva.Events.subscribe('ViewerDidScroll', () => this.debounce(() => {
                                if (this.props.currentPageURI !== this.diva.getCurrentPageURI()) {
                                    this.props.onScrollHandler(this.diva.getCurrentPageURI());
                                }
                            }, 500));
                        }

                        Diva.Events.subscribe('ViewerDidLoad', () => {
                            this.setState({ loaded: true });

                            if (this.props.initialPageURI) {
                                // console.log(this.props.initialPageURI);
                                this.diva.gotoPageByURI(this.props.initialPageURI);
                            }

                            // if (this.props.initialPage) {
                            //     this.diva.gotoPageByIndex(this.props.initialPage);
                            // }

                            if (this.props.onLoad) {
                                this.props.onLoad(this.diva.getNumberOfPages());
                            }
                        });
                    }
                })
                .catch((e) => { console.log(e); this.divaWrapper.innerHTML = '<div class="no-content"><h5>No image found</h5></div>'; });
        }
    }

    render() {
        return (
            <div id="diva-wrapper" ref={c => this.divaWrapper = c}></div>
        );

    }

}