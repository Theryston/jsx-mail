function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var cn = _interopDefault(require('classnames'));
var Link = _interopDefault(require('next/link'));
var router = require('next/router');
var parseGitUrl = _interopDefault(require('parse-git-url'));

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var ArrowRight = ((_ref) => {
  let {
    height = 24
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, ["height"]);

  return /*#__PURE__*/React.createElement("svg", _extends({
    height: height,
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor"
  }, props), /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M9 5l7 7-7 7"
  }));
});

const renderComponent = (ComponentOrNode, props) => {
  if (!ComponentOrNode) return null;

  if (typeof ComponentOrNode === 'function') {
    return /*#__PURE__*/React.createElement(ComponentOrNode, props);
  }

  return ComponentOrNode;
};

const NextLink = ({
  route,
  title,
  isRTL
}) => {
  return /*#__PURE__*/React.createElement(Link, {
    href: route
  }, /*#__PURE__*/React.createElement("a", {
    className: cn('text-lg font-medium p-4 -m-4 no-underline text-gray-600 hover:text-blue-600 flex items-center', {
      'ml-2': !isRTL,
      'mr-2': isRTL
    }),
    title: title
  }, title, /*#__PURE__*/React.createElement(ArrowRight, {
    className: cn('transform inline flex-shrink-0', {
      'rotate-180 mr-1': isRTL,
      'ml-1': !isRTL
    })
  })));
};

const PrevLink = ({
  route,
  title,
  isRTL
}) => {
  return /*#__PURE__*/React.createElement(Link, {
    href: route
  }, /*#__PURE__*/React.createElement("a", {
    className: cn('text-lg font-medium p-4 -m-4 no-underline text-gray-600 hover:text-blue-600 flex items-center', {
      'mr-2': !isRTL,
      'ml-2': isRTL
    }),
    title: title
  }, /*#__PURE__*/React.createElement(ArrowRight, {
    className: cn('transform inline flex-shrink-0', {
      'rotate-180 mr-1': !isRTL,
      'ml-1': isRTL
    })
  }), title));
};

const createEditUrl = (repository, filepath) => {
  const repo = parseGitUrl(repository);
  if (!repo) throw new Error('Invalid `docsRepositoryBase` URL!');

  switch (repo.type) {
    case 'github':
      return `https://github.com/${repo.owner}/${repo.name}/blob/${repo.branch || 'main'}/${repo.subdir || 'pages'}${filepath}`;

    case 'gitlab':
      return `https://gitlab.com/${repo.owner}/${repo.name}/-/blob/${repo.branch || 'master'}/${repo.subdir || 'pages'}${filepath}`;
  }

  return '#';
};

const EditPageLink = ({
  repository,
  text,
  filepath
}) => {
  const url = createEditUrl(repository, filepath);
  const {
    locale
  } = router.useRouter();
  return /*#__PURE__*/React.createElement("a", {
    className: "text-sm",
    href: url,
    target: "_blank"
  }, text ? renderComponent(text, {
    locale
  }) : 'Edit this page');
};

const NavLinks = ({
  config,
  flatDirectories,
  currentIndex,
  isRTL
}) => {
  let prev = flatDirectories[currentIndex - 1];
  let next = flatDirectories[currentIndex + 1];
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-row items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", null, prev && config.prevLinks ? /*#__PURE__*/React.createElement(PrevLink, {
    route: prev.route,
    title: prev.title,
    isRTL: isRTL
  }) : null), /*#__PURE__*/React.createElement("div", null, config.nextLinks && next ? /*#__PURE__*/React.createElement(NextLink, {
    route: next.route,
    title: next.title,
    isRTL: isRTL
  }) : null));
};

const Footer = ({
  config,
  filepathWithName,
  children
}) => {
  const {
    locale
  } = router.useRouter();
  return /*#__PURE__*/React.createElement("footer", {
    className: "mt-24"
  }, children, /*#__PURE__*/React.createElement("hr", null), config.footer ? /*#__PURE__*/React.createElement("div", {
    className: "mt-24 flex justify-between flex-col-reverse md:flex-row items-center md:items-end"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-600"
  }, renderComponent(config.footerText, {
    locale
  })), /*#__PURE__*/React.createElement("div", {
    className: "mt-6"
  }), config.footerEditLink ? /*#__PURE__*/React.createElement(EditPageLink, {
    filepath: filepathWithName,
    repository: config.docsRepositoryBase,
    text: config.footerEditLink
  }) : null) : null);
};

exports.NavLinks = NavLinks;
exports.default = Footer;
