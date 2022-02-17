import React from 'react';

const Input = ({ type, placeHolder, state, setState }) => {
    return <input 
        type={type} 
        placeholder={placeHolder} 
        value={state} 
        onChange={e => setState(e.target.value)}
        className='py-2 w-input rounded-full text-center text-adzuna outline-8 focus:outline focus:outline-adzuna/30'
    />
};

export default Input;