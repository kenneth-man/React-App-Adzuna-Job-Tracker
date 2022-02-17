import React from 'react';

const RowResults = ({ children, extraClasses }) => {
    return <div className={`flex flex-wrap items-start justify-center pt-16 ${extraClasses}`}>
        {children}
    </div>
}

export default RowResults;