import React from 'react';

const Column = ({ children, extraClasses }) => {
  return <div className={`flex flex-col items-center ${extraClasses}`}>
      {children}
  </div>
};

export default Column;