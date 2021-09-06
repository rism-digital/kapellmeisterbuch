import React from 'react';

import './Buttons.scss';

import ActionButton from './ActionButton.jsx';

export const ClearButton = props => <button className={`clearButton-root${props.isActive ? ' clearButton__active' : ''}`}>{props.children}</button>;

export const PrimaryButton = props => <button className={'primaryButton-root'} disabled={props.disabled} type={props.type}>{props.children}</button>;

export const PrimaryButtonSmall = props => <ActionButton className={'primaryButton-root primaryButton-small'} {...props}>{props.children}</ActionButton>;