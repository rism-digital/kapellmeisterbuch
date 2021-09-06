import React, { Component } from 'react';

import './Checkbox.scss';


export default class Checkbox extends Component {

    constructor(props) {
        super(props);

        this.state = {
            checked: props.checked || false
        };
    }

    componentDidUpdate(props) {
        if (this.state.checked !== props.checked) {
            this.setState({ checked: props.checked });
        }
    }

    onChangeHandler() {
        this.setState({ checked: !this.state.checked }, this.emitChecked());
    }

    emitChecked() {
        if (this.props.onChangeHandler && typeof this.props.onChangeHandler === 'function') {
            this.props.onChangeHandler(!this.state.checked);
        }
    }

    render() {
        return (
            <label className="checkbox-root">{this.props.label}
                <input
                    onChange={this.onChangeHandler.bind(this)}
                    type="checkbox"
                    value={this.props.value}
                    name={this.props.name}
                    checked={this.state.checked}
                />
                <span className="checkmark"></span>
            </label>

        );
    }

}