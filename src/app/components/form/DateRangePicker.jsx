import React, { Component } from 'react';

import Input from './Input.jsx';
import SliderRange from './SliderRange.jsx';

import './DateRangePicker.scss';

export default class DateRangePicker extends Component {

    constructor(props) {
        super(props);

        this.state = {
            input_from: props.from ? props.from : props.minFrom || '',
            input_to: props.to ? props.to : props.maxTo || '',
            from: props.from ? props.from : props.minFrom || '',
            to: props.to ? props.to : props.maxTo || ''
        };

        this.onChangeHandler = this.onChangeHandler.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.from !== this.props.from) {
            this.setState({ from: this.props.from });
        }

        if (prevProps.to !== this.props.to) {
            this.setState({ to: this.props.to });
        }
    }

    componentDidMount() {
        this.emitData();
    }

    onChangeHandler(field) {
        return value => {
            this.setState({ [`input_${field}`]: value }, this.emitData);
        };
    }

    onBlurHandler(field) {
        return value => {
            const { minFrom = 0, maxTo } = this.props;
            const { from, to } = this.state;
            switch (field) {
            case 'from': {
                if (value < minFrom) {
                    value = minFrom;
                }

                if (value > to) {
                    value = to;
                }

                break;
            }
            case 'to': {
                if (maxTo && value > maxTo) {
                    value = maxTo;
                }

                if (value < from) {
                    value = from;
                }

                break;
            }
            }
            this.setState({
                [field]: value,
                [`input_${field}`]: value
            }, this.emitData);
        };
    }

    onSliderChangeHandler({ from, to }) {
        this.setState({
            from,
            to,
            input_from: from,
            input_to: to
        });
    }

    onSliderUpdatedHandler({ from, to }) {
        this.setState({
            from,
            to,
            input_from: from,
            input_to: to
        }, this.emitData);
    }

    emitData() {
        if (this.props.onChangeHandler && typeof this.props.onChangeHandler === 'function') {
            const { from, to } = this.state;
            this.props.onChangeHandler({ from, to });
        }
    }

    render() {
        const { from, to, input_from, input_to } = this.state;

        return (
            <div className="dateRangePicker-root">
                <div className="dateRangePicker-inputs" style={{}}>
                    <Input
                        style={{ width: '80px' }}
                        value={input_from}
                        onChangeHandler={this.onChangeHandler('from')}
                        onBlurHandler={this.onBlurHandler('from')}
                    />

                    <Input
                        style={{ width: '80px' }}
                        value={input_to}
                        onChangeHandler={this.onChangeHandler('to')}
                        onBlurHandler={this.onBlurHandler('to')}
                    />
                </div>
                <SliderRange
                    onChangeHandler={this.onSliderChangeHandler.bind(this)}
                    sliderUpdatedHandler={this.onSliderUpdatedHandler.bind(this)}
                    from={from}
                    to={to}
                    min={this.props.minFrom}
                    max={this.props.maxTo}
                />
            </div>
        );
    }
}