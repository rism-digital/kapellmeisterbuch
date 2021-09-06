import React, { Component } from 'react';

import './SliderRange.scss';

export default class SliderRange extends Component {

    constructor(props) {
        super(props);

        this.state = {
            cursorFromLeft: 0,
            cursorToLeft: 0,
            mousePointerOffset: 0,
            from: props.from ? props.from : props.min,
            to: props.to ? props.to : props.max,
            steps: props.max - props.min,
            trackWidth: 0,
            dragging: false,
        };

        this.cursorWidth = 20;
        this.root;

        this.onMouseMoveFrom = this.onMouseMoveFrom.bind(this);
        this.onMouseMoveTo = this.onMouseMoveTo.bind(this);
        this.disableDrag = this.disableDrag.bind(this);
        this.enableDrag = this.enableDrag.bind(this);
        this.preventDragEvent = this.preventDragEvent.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.from !== this.props.from) {
            this.setState({
                from: this.props.from,
                cursorFromLeft: (this.props.from - this.props.min) * this.state.stepWidth
            });
        }

        if (prevProps.to !== this.props.to) {
            this.setState({
                to: this.props.to,
                cursorToLeft: this.state.trackWidth - ((this.props.max - this.props.to) * this.state.stepWidth)
            });
        }
    }

    componentDidMount() {
        const { from, to, min, max } = this.props;

        const stepWidth = (this.root.offsetWidth - (this.cursorWidth * 2)) / this.state.steps;
        const trackWidth = this.root.offsetWidth - this.cursorWidth;

        this.setState({
            cursorFromLeft: from ? (from - min) * stepWidth : 0,
            cursorToLeft: to ? trackWidth - ((max - to) * stepWidth) : this.root.offsetWidth - this.cursorWidth,
            stepWidth,
            trackWidth
        });
    }

    onMouseMoveFrom(e) {
        if (this.state.dragging) {
            // left cursor position relative to the mouse pointer
            let left = e.pageX - this.root.offsetLeft - this.state.mousePointerOffset;

            // check relative position with to cursor
            if (left > this.state.cursorToLeft - this.cursorWidth) {
                left = this.state.cursorToLeft - this.cursorWidth;
            }

            // set left amount in steps
            left = Math.ceil((left - (this.state.stepWidth / 2)) / (this.state.stepWidth)) * this.state.stepWidth;

            // limit left into the domain
            left = left < 0 ? 0 : left > this.state.trackWidth ? this.state.trackWidth : left;

            this.setState({
                cursorFromLeft: left,
                from: this.props.min + Math.round(left / this.state.stepWidth)
            }, this.emitData);
        }
    }

    onMouseMoveTo(e) {
        if (this.state.dragging) {
            // left cursor position relative to the mouse pointer
            let left = e.pageX - this.root.offsetLeft - this.state.mousePointerOffset;

            // check relative position with from cursor
            if (left < this.state.cursorFromLeft + this.cursorWidth) {
                left = this.state.cursorFromLeft + this.cursorWidth;
            }

            // set left amount in steps
            left = Math.ceil((left - (this.state.stepWidth / 2)) / (this.state.stepWidth)) * this.state.stepWidth;

            // limit left into the domain
            left = left < 0 ? 0 : left > this.state.trackWidth ? this.state.trackWidth : left;

            this.setState({
                cursorToLeft: left,
                to: this.props.max - Math.round((this.state.trackWidth - left) / this.state.stepWidth)
            }, this.emitData);
        }
    }

    emitData() {
        if (this.props.onChangeHandler && typeof this.props.onChangeHandler === 'function') {
            const { from, to } = this.state;
            this.props.onChangeHandler({ from, to });
        }
    }

    enableDrag(cursor) {
        return e => {
            e.persist();
            this.setState(
                () => ({
                    dragging: true,
                    mousePointerOffset: e.pageX - this.root.offsetLeft - this.state[cursor]
                }),
                () => {
                    if (cursor === 'cursorFromLeft') {
                        window.addEventListener('mousemove', this.onMouseMoveFrom);
                    }

                    if (cursor === 'cursorToLeft') {
                        window.addEventListener('mousemove', this.onMouseMoveTo);
                    }

                    // if mouse moves out of the cursor we have to catch mouseup event into whole window
                    window.addEventListener('mouseup', this.disableDrag);

                    // we want to disable default drag behaviour to prevent a blocking event
                    window.addEventListener('dragstart', this.preventDragEvent);
                }
            );
        };
    }

    preventDragEvent(e) {
        e.preventDefault();
    }

    disableDrag() {
        this.setState(
            () => ({ dragging: false }),
            () => {
                window.removeEventListener('mousemove', this.onMouseMoveFrom);
                window.removeEventListener('mousemove', this.onMouseMoveTo);
                window.removeEventListener('mouseup', this.disableDrag);
                window.removeEventListener('dragstart', this.preventDragEvent);
                this.callOnSliderUpdated();
            }
        );
    }

    callOnSliderUpdated() {
        if (this.props.sliderUpdatedHandler && typeof this.props.sliderUpdatedHandler === 'function') {
            const { from, to } = this.state;
            this.props.sliderUpdatedHandler({ from, to });
        }
    }

    calculateSelectionTrackWidth() {
        return this.root
            && (this.root.offsetWidth - (this.root.offsetWidth - this.state.cursorToLeft) - this.state.cursorFromLeft)
            || '100%';
    }

    render() {
        return (
            <div
                className="slider-root"
                ref={c => this.root = c}
            >
                <div
                    className="slider-cursor"
                    style={{
                        left: this.state.cursorFromLeft,
                        width: this.cursorWidth,
                        height: this.cursorWidth
                    }}
                    onMouseDown={this.enableDrag('cursorFromLeft')}
                />

                <div
                    className="slider-cursor"
                    style={{
                        left: this.state.cursorToLeft,
                        width: this.cursorWidth,
                        height: this.cursorWidth
                    }}
                    onMouseDown={this.enableDrag('cursorToLeft')}
                />

                <div
                    className="slider-track"
                />

                <div
                    className="slider-track slider-track-selection"
                    style={{
                        left: this.state.cursorFromLeft,
                        width: this.calculateSelectionTrackWidth()
                    }}
                />
            </div>
        );
    }

}