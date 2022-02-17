import React from 'react';
import Row from './Row';
import { ReactComponent as SadFaceIcon } from '../res/icons/emoji-sad.svg';

const NoData = ({ text, extraClasses }) => {
    return <Row extraClasses={`fixed z-10 fill-slate-300 ${extraClasses}`}>
    <h1 className='text-slate-300'>{text}</h1>
    &nbsp;
    &nbsp;
    <SadFaceIcon/>
</Row>
}

export default NoData;