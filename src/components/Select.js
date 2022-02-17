import React from 'react';
import Column from './Column';

const Select = ({ label, state, setState, options }) => {
    return <Column>
        <label className='text-white'>{label}</label>
        <select 
            value={state} 
            onChange={e => setState(e.target.value)}
            className='rounded-xl w-36 outline-8 focus:outline focus:outline-adzuna/30'
        >
            {
                options.map((curr, index) =>
                    <option 
                        key={index} 
                        value={curr}
                        className='text-center'
                    >
                        {curr}
                    </option>
                )
            }
        </select>
    </Column>
    
    
    
    
        
        
    
}

export default Select;