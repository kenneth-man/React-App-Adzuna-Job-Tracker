import React from 'react';
import Row from './Row';
import loadingGif from '../res/images/1494.gif';

const Loading = () => {
    return <Row extraClasses='fixed z-10'>
        <h1 className='text-white'>Loading results...</h1>
        &nbsp;
        <img src={loadingGif} alt='loading-gif' className='z-10'/>
    </Row>
}

export default Loading;