import React, { Component } from 'react';

import './Input.scss';

export default class Input extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value: props.value || ''
        };
    }

    componentDidUpdate(prevProps) {
        // set the value if is changed outside the component
        if (prevProps.value !== this.props.value) {
            this.setState({ value: this.props.value });
        }
    }

    onChangeHandler(e) {
        const value = e.target.value || '';

        this.setState(
            () => ({ value }),
            () => this.emitValue(value)
        );
    }

    onBlurHandler(e) {
        const value = e.target.value || '';

        this.setState(
            () => ({ value }),
            () => {
                if (this.props.onBlurHandler && typeof this.props.onBlurHandler === 'function') {
                    this.props.onBlurHandler(value || this.state.value);
                }
            }
        );
    }

    onKeyDownHandler(e) {
        // listen for Enter key pressed
        if (e.keyCode == 13) {
            this.onBlurHandler(e);
        }
    }

    emitValue(value) {
        if (this.props.onChangeHandler && typeof this.props.onChangeHandler === 'function') {
            this.props.onChangeHandler(value || this.state.value);
        }
    }

    render() {
        const classNames = ['input-root'];

        if (this.props.className) {
            classNames.push(this.props.className);
        }

        return (
            <input
                className={classNames.join(' ')}
                style={this.props.style}
                value={this.state.value}
                onChange={this.onChangeHandler.bind(this)}
                onBlur={this.onBlurHandler.bind(this)}
                onKeyDown={this.onKeyDownHandler.bind(this)}
                placeholder={this.props.placeholder}
            />
        );
    }

}