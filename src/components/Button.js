import React from 'react';

const Button = ({ children, extraClasses, isRow, isCol, onClick, type }) => {
    return <button 
        className={`
            px-4 py-2 bg-adzuna/50 text-white font-extralight uppercase rounded-full 
            hover:bg-adzuna/70 hover:cursor-pointer
            active:bg-adzuna/30
            ${extraClasses} 
            ${isRow && 'flex items-center'}
            ${isCol && 'flex flex-col items-center'}
        `}
        onClick={onClick}
        type={type}
    >
        {children}
    </button>
};

export default Button;