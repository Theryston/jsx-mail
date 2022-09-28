function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var Router = require('next/router');
var Router__default = _interopDefault(Router);
var cn = _interopDefault(require('classnames'));
var Link = _interopDefault(require('next/link'));
var GraphemeSplitter = _interopDefault(require('grapheme-splitter'));

const splitter = new GraphemeSplitter();
const TextWithHighlights = React__default.memo(({
  content,
  ranges
}) => {
  const splittedText = content ? splitter.splitGraphemes(content) : [];
  const res = [];
  let id = 0,
      index = 0;

  for (const range of ranges) {
    res.push( /*#__PURE__*/React__default.createElement(React.Fragment, {
      key: id++
    }, splittedText.splice(0, range.beginning - index).join('')));
    res.push( /*#__PURE__*/React__default.createElement("span", {
      className: "highlight",
      key: id++
    }, splittedText.splice(0, range.end - range.beginning).join('')));
    index = range.end;
  }

  res.push( /*#__PURE__*/React__default.createElement(React.Fragment, {
    key: id++
  }, splittedText.join('')));
  return res;
});

const Item = ({
  title,
  active,
  href,
  onMouseOver,
  excerpt
}) => {
  return /*#__PURE__*/React__default.createElement(Link, {
    href: href
  }, /*#__PURE__*/React__default.createElement("a", {
    className: "block no-underline",
    onMouseOver: onMouseOver
  }, /*#__PURE__*/React__default.createElement("li", {
    className: cn('py-2 px-4', {
      active
    })
  }, /*#__PURE__*/React__default.createElement("span", {
    className: "font-semibold"
  }, title), excerpt ? /*#__PURE__*/React__default.createElement("div", {
    className: "text-gray-600"
  }, /*#__PURE__*/React__default.createElement(TextWithHighlights, {
    content: excerpt.text,
    ranges: excerpt.highlight_ranges
  })) : null)));
}; // This can be global for better caching.


const stork = {};
function Search() {
  const router = Router.useRouter();
  const [show, setShow] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [active, setActive] = React.useState(0);
  const setStork = React.useState({})[1];
  const input = React.useRef(null);
  const results = React.useMemo(() => {
    if (!search) return [];
    const localeCode = Router__default.locale || 'default';
    if (!stork[localeCode]) return [];

    try {
      const json = stork[localeCode].wasm_search(`index-${localeCode}`, search);
      const obj = JSON.parse(json);
      if (!obj.results) return [];
      return obj.results.slice(0, 20).map(result => {
        return {
          title: result.entry.title,
          route: result.entry.url,
          excerpt: result.excerpts[0]
        };
      });
    } catch (err) {
      console.error(err);
      return [];
    }
  }, [search]);
  const handleKeyDown = React.useCallback(e => {
    switch (e.key) {
      case 'ArrowDown':
        {
          e.preventDefault();

          if (active + 1 < results.length) {
            setActive(active + 1);
            const activeElement = document.querySelector(`.nextra-stork ul > :nth-child(${active + 2})`);

            if (activeElement && activeElement.scrollIntoViewIfNeeded) {
              activeElement.scrollIntoViewIfNeeded();
            }
          }

          break;
        }

      case 'ArrowUp':
        {
          e.preventDefault();

          if (active - 1 >= 0) {
            setActive(active - 1);
            const activeElement = document.querySelector(`.nextra-stork ul > :nth-child(${active})`);

            if (activeElement && activeElement.scrollIntoViewIfNeeded) {
              activeElement.scrollIntoViewIfNeeded();
            }
          }

          break;
        }

      case 'Enter':
        {
          router.push(results[active].route);
          break;
        }
    }
  }, [active, results, router]);

  const load = async () => {
    const localeCode = Router__default.locale || 'default';

    if (!stork[localeCode]) {
      stork[localeCode] = await new Promise(function (resolve) { resolve(require('./wasm-loader-b9b546ac.js')); });
      setStork({});
      const init = stork[localeCode].init('/stork.wasm');
      const res = await fetch(`/index-${localeCode}.st`);
      const buf = await res.arrayBuffer();
      await init;
      stork[localeCode].wasm_register_index(`index-${localeCode}`, new Uint8Array(buf));
    }
  };

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
    className: "nextra-search nextra-stork relative w-full md:w-64"
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
    onFocus: () => {
      load();
      setShow(true);
    },
    ref: input,
    spellCheck: false
  }), renderList && /*#__PURE__*/React__default.createElement("ul", {
    className: "p-0 m-0 mt-1 top-full absolute divide-y z-20"
  }, results.map((res, i) => {
    return /*#__PURE__*/React__default.createElement(Item, {
      key: `search-item-${i}`,
      title: res.title,
      href: res.route,
      excerpt: res.excerpt,
      active: i === active,
      onMouseOver: () => setActive(i)
    });
  })));
}

module.exports = Search;
