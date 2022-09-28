'use strict'

module.exports = strip

// Expose modifiers for available node types.
// Node types not listed here are not changed (but their children are).
var defaults = {
  heading: paragraph,
  text: text,
  inlineCode: text,
  image: image,
  imageReference: image,
  break: lineBreak,

  blockquote: children,
  list: children,
  listItem: children,
  strong: children,
  emphasis: children,
  delete: children,
  link: children,
  linkReference: children,

  code: empty,
  horizontalRule: empty,
  thematicBreak: empty,
  html: empty,
  table: empty,
  tableCell: empty,
  definition: empty,
  yaml: empty,
  toml: empty,

  footnoteReference: empty,
  footnoteDefinition: empty
}

var own = {}.hasOwnProperty

function strip(options) {
  var handlers = {}
  var map = {}
  var settings = options || {}
  var remove = settings.remove || []
  var keep = settings.keep || []
  var length = keep.length
  var index = -1
  var key

  if (remove.length === 0) {
    handlers = defaults
  } else {
    handlers = Object.assign({}, defaults)
    remove.forEach((name) => {
      if (Array.isArray(name)) {
        handlers[name[0]] = name[1]
      } else {
        handlers[name] = empty
      }
    })
  }

  if (length === 0) {
    map = handlers
  } else {
    for (key in handlers) {
      if (keep.indexOf(key) === -1) {
        map[key] = handlers[key]
      }
    }

    // Warn if unknown keys are turned off.
    while (++index < length) {
      key = keep[index]

      if (!own.call(handlers, key)) {
        throw new Error(
          'Invalid `keep` option: No modifier is defined for node type `' +
            key +
            '`'
        )
      }
    }
  }

  return one

  function one(node) {
    var type = node && node.type

    if (type in map) {
      node = map[type](node)
    }

    if ('length' in node) {
      node = all(node)
    }

    if (node.children) {
      node.children = all(node.children)
    }

    return node
  }

  function all(nodes) {
    var index = -1
    var length = nodes.length
    var result = []
    var value

    while (++index < length) {
      value = one(nodes[index])

      if (value && typeof value.length === 'number') {
        result = result.concat(value.map(one))
      } else {
        result.push(value)
      }
    }

    return clean(result)
  }
}

// Clean nodes: merges texts.
function clean(values) {
  var index = -1
  var length = values.length
  var result = []
  var previous = null
  var value

  while (++index < length) {
    value = values[index]

    if (previous && 'value' in value && value.type === previous.type) {
      previous.value += value.value
    } else {
      result.push(value)
      previous = value
    }
  }

  return result
}

function image(node) {
  return {type: 'text', value: node.alt || node.title || ''}
}

function text(node) {
  return {type: 'text', value: node.value}
}

function paragraph(node) {
  return {type: 'paragraph', children: node.children}
}

function children(node) {
  return node.children || []
}

function lineBreak() {
  return {type: 'text', value: '\n'}
}

function empty() {
  return {type: 'text', value: ''}
}
