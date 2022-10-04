(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (global = global || self, factory(global.nextra = {}, global.react));
}(this, (function (exports, React) {
  var React__default = 'default' in React ? React['default'] : React;

  const SSGContext = React.createContext({});
  const useSSG = () => React.useContext(SSGContext);
  const withSSG = Page => {
    return props => {
      return React__default.createElement(SSGContext.Provider, {
        value: props.ssg
      }, React__default.createElement(Page, props));
    };
  };

  exports.SSGContext = SSGContext;
  exports.useSSG = useSSG;
  exports.withSSG = withSSG;

})));
