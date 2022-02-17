import React from 'react';
import { Link } from 'react-router-dom';

const LinkComponent = ({ children, extraClasses, to }) => {
    return <Link to={to} className={`${extraClasses}`}>
        {children}
    </Link>
};

export default LinkComponent;