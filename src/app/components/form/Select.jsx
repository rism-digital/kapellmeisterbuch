import React, { Component } from 'react';

import './Select.scss';

class Select extends Component {

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
        const value = e.target.value;

        this.setState({ value }, this.emit(value));
    }

    emit(value) {
        if (this.props.onChangeHandler && typeof this.props.onChangeHandler === 'function') {
            this.props.onChangeHandler(value);
        }
    }

    render() {
        const { options, label } = this.props;

        return (
            <div className="select-root" style={this.props.style}>
                {label && <label>{label}</label>}
                <select
                    style={this.props.inputStyle}
                    className="select-input"
                    value={this.state.value}
                    onChange={this.onChangeHandler.bind(this)}
                >
                    {
                        this.props.placeholder ? (
                            <option value="" disabled>{this.props.placeholder}</option>
                        ) : null
                        // (
                        //         <option value="" />
                        //     )
                    }
                    {
                        options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)
                    }
                </select>
            </div>
        );
    }

}

Select.defaultProps = {
    options: [],
    placeholder: false
};

export default Select;