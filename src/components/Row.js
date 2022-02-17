import React from 'react';

const Row = ({ children, extraClasses }) => {
  return <div className={`flex items-center ${extraClasses}`}>
      {children}
  </div>
};

export default Row;