'use_strict';

import React, { Component } from 'react';

import './Paginator.scss';

export default class Paginator extends Component {

    onClickHandler(e) {
        e.preventDefault();
        return page => {
            if (this.props.onClickHandler) {
                this.props.onClickHandler(page);
            }
        };
    }

    renderButtons() {
        const links = [];

        let separatorBefore = false;
        let separatorAfter = false;
        let from = 2;
        let to = this.props.totalPages - 1;

        if (this.props.page <= 3) {
            to = 5;
            to = to > this.props.totalPages - 1 ? this.props.totalPages - 1 : to;
        }

        if (3 < this.props.page && this.props.page <= this.props.totalPages - 3) {
            from = this.props.page - 2;
            to = this.props.page + 2;
        }

        if (this.props.page > this.props.totalPages - 3) {
            from = this.props.totalPages - 5;
            from = from < 2 ? 2 : from;
        }

        if (from > 2) separatorBefore = true;
        if (to < this.props.totalPages - 1) separatorAfter = true;


        for (let k = from; k <= to; k++) {
            links.push(k);
        }

        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {
                    this.props.page > 1 && (
                        <a href="#" onClick={e => this.onClickHandler(e)(this.props.page - 1)}>
                            &laquo;
                        </a>
                    )
                }
                <a className={1 === this.props.page ? 'current' : ''} key={1} href="#" onClick={e => this.onClickHandler(e)(1)}>{1}</a>
                {separatorBefore && <div className="Paginator-separator" />}
                {links.map(l => <a className={l === this.props.page ? 'current' : ''} key={l} href="#" onClick={e => this.onClickHandler(e)(l)}>{l}</a>)}
                {separatorAfter && <div className="Paginator-separator" />}
                <a className={this.props.totalPages === this.props.page ? 'current' : ''} key={this.props.totalPages} href="#" onClick={e => this.onClickHandler(e)(this.props.totalPages)}>{this.props.totalPages}</a>
                {
                    this.props.page < this.props.totalPages && (
                        <a href="#" onClick={e => this.onClickHandler(e)(this.props.page + 1)}>
                            &raquo;
                        </a>
                    )
                }
            </div>
        );

    }

    render() {
        if (this.props.totalPages > 1) {
            return (
                <div className="Paginator-root">
                    {this.renderButtons()}
                </div>
            );
        }

        return null;
    }

}