function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var matchSorter = _interopDefault(require('match-sorter'));
var cn = _interopDefault(require('classnames'));
var router = require('next/router');
var Link = _interopDefault(require('next/link'));

const Item = ({
  title,
  active,
  href,
  onMouseOver,
  search
}) => {
  const highlight = title.toLowerCase().indexOf(search.toLowerCase());
  return /*#__PURE__*/React__default.createElement(Link, {
    href: href
  }, /*#__PURE__*/React__default.createElement("a", {
    className: "block no-underline",
    onMouseOver: onMouseOver
  }, /*#__PURE__*/React__default.createElement("li", {
    className: cn('p-2', {
      active
    })
  }, title.substring(0, highlight), /*#__PURE__*/React__default.createElement("span", {
    className: "highlight"
  }, title.substring(highlight, highlight + search.length)), title.substring(highlight + search.length))));
};

const UP = true;
const DOWN = false;

const Search = ({
  directories = []
}) => {
  const router$1 = router.useRouter();
  const [show, setShow] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [active, setActive] = React.useState(0);
  const input = React.useRef(null);
  const results = React.useMemo(() => {
    if (!search) return []; // Will need to scrape all the headers from each page and search through them here
    // (similar to what we already do to render the hash links in sidebar)
    // We could also try to search the entire string text from each page

    return matchSorter(directories, search, {
      keys: ['title']
    });
  }, [search]);

  const moveActiveItem = up => {
    const position = active + (up ? -1 : 1);
    const {
      length
    } = results; // Modulo instead of remainder,
    // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder

    const next = (position + length) % length;
    setActive(next);
  };

  const handleKeyDown = React.useCallback(e => {
    const {
      key,
      ctrlKey
    } = e;

    if (ctrlKey && key === 'n' || key === 'ArrowDown') {
      e.preventDefault();
      moveActiveItem(DOWN);
    }

    if (ctrlKey && key === 'p' || key === 'ArrowUp') {
      e.preventDefault();
      moveActiveItem(UP);
    }

    if (key === 'Enter') {
      router$1.push(results[active].route);
    }
  }, [active, results, router$1]);
  React.useEffect(() => {
    setActive(0);
  }, [search]);
  React.useEffect(() => {
    const inputs = ['input', 'select', 'button', 'textarea'];

    const down = e => {
      if (document.activeElement && inputs.indexOf(document.activeElement.tagName.toLowerCase()) === -1) {
        if (e.key === '/') {
          e.preventDefault();
          input.current.focus();
        } else if (e.key === 'Escape') {
          setShow(false);
        }
      }
    };

    window.addEventListener('keydown', down);
    return () => window.removeEventListener('keydown', down);
  }, []);
  const renderList = show && results.length > 0;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "nextra-search relative w-full md:w-64"
  }, renderList && /*#__PURE__*/React__default.createElement("div", {
    className: "search-overlay z-10",
    onClick: () => setShow(false)
  }), /*#__PURE__*/React__default.createElement("input", {
    onChange: e => {
      setSearch(e.target.value);
      setShow(true);
    },
    className: "appearance-none border rounded py-2 px-3 leading-tight focus:outline-none focus:ring w-full",
    type: "search",
    placeholder: "Search (\"/\" to focus)",
    onKeyDown: handleKeyDown,
    onFocus: () => setShow(true),
    ref: input
  }), renderList && /*#__PURE__*/React__default.createElement("ul", {
    className: "shadow-md list-none p-0 m-0 absolute left-0 md:right-0 rounded mt-1 border top-100 divide-y z-20 w-full md:w-auto"
  }, results.map((res, i) => {
    return /*#__PURE__*/React__default.createElement(Item, {
      key: `search-item-${i}`,
      title: res.title,
      href: res.route,
      active: i === active,
      search: search,
      onMouseOver: () => setActive(i)
    });
  })));
};

module.exports = Search;
