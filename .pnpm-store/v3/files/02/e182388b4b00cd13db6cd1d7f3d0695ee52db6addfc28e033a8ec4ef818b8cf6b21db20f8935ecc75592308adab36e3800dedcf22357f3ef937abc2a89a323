function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);

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
