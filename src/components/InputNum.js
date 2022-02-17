import React from 'react';
import Column from './Column';

const InputNum = ({ label, isMin, number, state, setState }) => {
    return <Column>
        <label className='text-white'>{label}</label>
        {
            isMin ? 
            <input 
                type='number' 
                min={number}
                step={1000}
                value={state} 
                onChange={e => setState(e.target.value)}
                className='text-center rounded-xl w-36 outline-8 focus:outline focus:outline-adzuna/30'
            /> :
            <input 
                type='number'
                min='0' 
                max={number}
                step={1000}
                value={state} 
                onChange={e => setState(e.target.value)}
                className='text-center rounded-xl w-36 outline-8 focus:outline focus:outline-adzuna/30'
            />
        }
    </Column>   
}

export default InputNum;