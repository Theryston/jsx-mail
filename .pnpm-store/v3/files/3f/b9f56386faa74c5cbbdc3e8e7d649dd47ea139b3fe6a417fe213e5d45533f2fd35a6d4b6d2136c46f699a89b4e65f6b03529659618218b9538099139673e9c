import React, { createContext, useContext } from 'react';

const SSGContext = createContext({});
const useSSG = () => useContext(SSGContext);
const withSSG = Page => {
  return props => {
    return React.createElement(SSGContext.Provider, {
      value: props.ssg
    }, React.createElement(Page, props));
  };
};

export { SSGContext, useSSG, withSSG };
