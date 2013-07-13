
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("component-indexof/index.js", Function("exports, require, module",
"\nvar indexOf = [].indexOf;\n\nmodule.exports = function(arr, obj){\n  if (indexOf) return arr.indexOf(obj);\n  for (var i = 0; i < arr.length; ++i) {\n    if (arr[i] === obj) return i;\n  }\n  return -1;\n};//@ sourceURL=component-indexof/index.js"
));
require.register("component-emitter/index.js", Function("exports, require, module",
"\n/**\n * Module dependencies.\n */\n\nvar index = require('indexof');\n\n/**\n * Expose `Emitter`.\n */\n\nmodule.exports = Emitter;\n\n/**\n * Initialize a new `Emitter`.\n *\n * @api public\n */\n\nfunction Emitter(obj) {\n  if (obj) return mixin(obj);\n};\n\n/**\n * Mixin the emitter properties.\n *\n * @param {Object} obj\n * @return {Object}\n * @api private\n */\n\nfunction mixin(obj) {\n  for (var key in Emitter.prototype) {\n    obj[key] = Emitter.prototype[key];\n  }\n  return obj;\n}\n\n/**\n * Listen on the given `event` with `fn`.\n *\n * @param {String} event\n * @param {Function} fn\n * @return {Emitter}\n * @api public\n */\n\nEmitter.prototype.on = function(event, fn){\n  this._callbacks = this._callbacks || {};\n  (this._callbacks[event] = this._callbacks[event] || [])\n    .push(fn);\n  return this;\n};\n\n/**\n * Adds an `event` listener that will be invoked a single\n * time then automatically removed.\n *\n * @param {String} event\n * @param {Function} fn\n * @return {Emitter}\n * @api public\n */\n\nEmitter.prototype.once = function(event, fn){\n  var self = this;\n  this._callbacks = this._callbacks || {};\n\n  function on() {\n    self.off(event, on);\n    fn.apply(this, arguments);\n  }\n\n  fn._off = on;\n  this.on(event, on);\n  return this;\n};\n\n/**\n * Remove the given callback for `event` or all\n * registered callbacks.\n *\n * @param {String} event\n * @param {Function} fn\n * @return {Emitter}\n * @api public\n */\n\nEmitter.prototype.off =\nEmitter.prototype.removeListener =\nEmitter.prototype.removeAllListeners = function(event, fn){\n  this._callbacks = this._callbacks || {};\n\n  // all\n  if (0 == arguments.length) {\n    this._callbacks = {};\n    return this;\n  }\n\n  // specific event\n  var callbacks = this._callbacks[event];\n  if (!callbacks) return this;\n\n  // remove all handlers\n  if (1 == arguments.length) {\n    delete this._callbacks[event];\n    return this;\n  }\n\n  // remove specific handler\n  var i = index(callbacks, fn._off || fn);\n  if (~i) callbacks.splice(i, 1);\n  return this;\n};\n\n/**\n * Emit `event` with the given args.\n *\n * @param {String} event\n * @param {Mixed} ...\n * @return {Emitter}\n */\n\nEmitter.prototype.emit = function(event){\n  this._callbacks = this._callbacks || {};\n  var args = [].slice.call(arguments, 1)\n    , callbacks = this._callbacks[event];\n\n  if (callbacks) {\n    callbacks = callbacks.slice(0);\n    for (var i = 0, len = callbacks.length; i < len; ++i) {\n      callbacks[i].apply(this, args);\n    }\n  }\n\n  return this;\n};\n\n/**\n * Return array of callbacks for `event`.\n *\n * @param {String} event\n * @return {Array}\n * @api public\n */\n\nEmitter.prototype.listeners = function(event){\n  this._callbacks = this._callbacks || {};\n  return this._callbacks[event] || [];\n};\n\n/**\n * Check if this emitter has `event` handlers.\n *\n * @param {String} event\n * @return {Boolean}\n * @api public\n */\n\nEmitter.prototype.hasListeners = function(event){\n  return !! this.listeners(event).length;\n};\n//@ sourceURL=component-emitter/index.js"
));
require.register("component-event/index.js", Function("exports, require, module",
"\n/**\n * Bind `el` event `type` to `fn`.\n *\n * @param {Element} el\n * @param {String} type\n * @param {Function} fn\n * @param {Boolean} capture\n * @return {Function}\n * @api public\n */\n\nexports.bind = function(el, type, fn, capture){\n  if (el.addEventListener) {\n    el.addEventListener(type, fn, capture);\n  } else {\n    el.attachEvent('on' + type, fn);\n  }\n  return fn;\n};\n\n/**\n * Unbind `el` event `type`'s callback `fn`.\n *\n * @param {Element} el\n * @param {String} type\n * @param {Function} fn\n * @param {Boolean} capture\n * @return {Function}\n * @api public\n */\n\nexports.unbind = function(el, type, fn, capture){\n  if (el.removeEventListener) {\n    el.removeEventListener(type, fn, capture);\n  } else {\n    el.detachEvent('on' + type, fn);\n  }\n  return fn;\n};\n//@ sourceURL=component-event/index.js"
));
require.register("component-query/index.js", Function("exports, require, module",
"\nfunction one(selector, el) {\n  return el.querySelector(selector);\n}\n\nexports = module.exports = function(selector, el){\n  el = el || document;\n  return one(selector, el);\n};\n\nexports.all = function(selector, el){\n  el = el || document;\n  return el.querySelectorAll(selector);\n};\n\nexports.engine = function(obj){\n  if (!obj.one) throw new Error('.one callback required');\n  if (!obj.all) throw new Error('.all callback required');\n  one = obj.one;\n  exports.all = obj.all;\n};\n//@ sourceURL=component-query/index.js"
));
require.register("component-matches-selector/index.js", Function("exports, require, module",
"/**\n * Module dependencies.\n */\n\nvar query = require('query');\n\n/**\n * Element prototype.\n */\n\nvar proto = Element.prototype;\n\n/**\n * Vendor function.\n */\n\nvar vendor = proto.matchesSelector\n  || proto.webkitMatchesSelector\n  || proto.mozMatchesSelector\n  || proto.msMatchesSelector\n  || proto.oMatchesSelector;\n\n/**\n * Expose `match()`.\n */\n\nmodule.exports = match;\n\n/**\n * Match `el` to `selector`.\n *\n * @param {Element} el\n * @param {String} selector\n * @return {Boolean}\n * @api public\n */\n\nfunction match(el, selector) {\n  if (vendor) return vendor.call(el, selector);\n  var nodes = query.all(selector, el.parentNode);\n  for (var i = 0; i < nodes.length; ++i) {\n    if (nodes[i] == el) return true;\n  }\n  return false;\n}\n//@ sourceURL=component-matches-selector/index.js"
));
require.register("component-delegate/index.js", Function("exports, require, module",
"\n/**\n * Module dependencies.\n */\n\nvar matches = require('matches-selector')\n  , event = require('event');\n\n/**\n * Delegate event `type` to `selector`\n * and invoke `fn(e)`. A callback function\n * is returned which may be passed to `.unbind()`.\n *\n * @param {Element} el\n * @param {String} selector\n * @param {String} type\n * @param {Function} fn\n * @param {Boolean} capture\n * @return {Function}\n * @api public\n */\n\nexports.bind = function(el, selector, type, fn, capture){\n  return event.bind(el, type, function(e){\n    if (matches(e.target, selector)) fn(e);\n  }, capture);\n  return callback;\n};\n\n/**\n * Unbind event `type`'s callback `fn`.\n *\n * @param {Element} el\n * @param {String} type\n * @param {Function} fn\n * @param {Boolean} capture\n * @api public\n */\n\nexports.unbind = function(el, type, fn, capture){\n  event.unbind(el, type, fn, capture);\n};\n//@ sourceURL=component-delegate/index.js"
));
require.register("component-events/index.js", Function("exports, require, module",
"\n/**\n * Module dependencies.\n */\n\nvar events = require('event');\nvar delegate = require('delegate');\n\n/**\n * Expose `Events`.\n */\n\nmodule.exports = Events;\n\n/**\n * Initialize an `Events` with the given\n * `el` object which events will be bound to,\n * and the `obj` which will receive method calls.\n *\n * @param {Object} el\n * @param {Object} obj\n * @api public\n */\n\nfunction Events(el, obj) {\n  if (!(this instanceof Events)) return new Events(el, obj);\n  if (!el) throw new Error('element required');\n  if (!obj) throw new Error('object required');\n  this.el = el;\n  this.obj = obj;\n  this._events = {};\n}\n\n/**\n * Subscription helper.\n */\n\nEvents.prototype.sub = function(event, method, cb){\n  this._events[event] = this._events[event] || {};\n  this._events[event][method] = cb;\n};\n\n/**\n * Bind to `event` with optional `method` name.\n * When `method` is undefined it becomes `event`\n * with the \"on\" prefix.\n *\n * Examples:\n *\n *  Direct event handling:\n *\n *    events.bind('click') // implies \"onclick\"\n *    events.bind('click', 'remove')\n *    events.bind('click', 'sort', 'asc')\n *\n *  Delegated event handling:\n *\n *    events.bind('click li > a')\n *    events.bind('click li > a', 'remove')\n *    events.bind('click a.sort-ascending', 'sort', 'asc')\n *    events.bind('click a.sort-descending', 'sort', 'desc')\n *\n * @param {String} event\n * @param {String|function} [method]\n * @return {Function} callback\n * @api public\n */\n\nEvents.prototype.bind = function(event, method){\n  var e = parse(event);\n  var el = this.el;\n  var obj = this.obj;\n  var name = e.name;\n  var method = method || 'on' + name;\n  var args = [].slice.call(arguments, 2);\n\n  // callback\n  function cb(){\n    var a = [].slice.call(arguments).concat(args);\n    obj[method].apply(obj, a);\n  }\n\n  // bind\n  if (e.selector) {\n    cb = delegate.bind(el, e.selector, name, cb);\n  } else {\n    events.bind(el, name, cb);\n  }\n\n  // subscription for unbinding\n  this.sub(name, method, cb);\n\n  return cb;\n};\n\n/**\n * Unbind a single binding, all bindings for `event`,\n * or all bindings within the manager.\n *\n * Examples:\n *\n *  Unbind direct handlers:\n *\n *     events.unbind('click', 'remove')\n *     events.unbind('click')\n *     events.unbind()\n *\n * Unbind delegate handlers:\n *\n *     events.unbind('click', 'remove')\n *     events.unbind('click')\n *     events.unbind()\n *\n * @param {String|Function} [event]\n * @param {String|Function} [method]\n * @api public\n */\n\nEvents.prototype.unbind = function(event, method){\n  if (0 == arguments.length) return this.unbindAll();\n  if (1 == arguments.length) return this.unbindAllOf(event);\n\n  // no bindings for this event\n  var bindings = this._events[event];\n  if (!bindings) return;\n\n  // no bindings for this method\n  var cb = bindings[method];\n  if (!cb) return;\n\n  events.unbind(this.el, event, cb);\n};\n\n/**\n * Unbind all events.\n *\n * @api private\n */\n\nEvents.prototype.unbindAll = function(){\n  for (var event in this._events) {\n    this.unbindAllOf(event);\n  }\n};\n\n/**\n * Unbind all events for `event`.\n *\n * @param {String} event\n * @api private\n */\n\nEvents.prototype.unbindAllOf = function(event){\n  var bindings = this._events[event];\n  if (!bindings) return;\n\n  for (var method in bindings) {\n    this.unbind(event, method);\n  }\n};\n\n/**\n * Parse `event`.\n *\n * @param {String} event\n * @return {Object}\n * @api private\n */\n\nfunction parse(event) {\n  var parts = event.split(/ +/);\n  return {\n    name: parts.shift(),\n    selector: parts.join(' ')\n  }\n}\n//@ sourceURL=component-events/index.js"
));
require.register("component-classes/index.js", Function("exports, require, module",
"\n/**\n * Module dependencies.\n */\n\nvar index = require('indexof');\n\n/**\n * Whitespace regexp.\n */\n\nvar re = /\\s+/;\n\n/**\n * toString reference.\n */\n\nvar toString = Object.prototype.toString;\n\n/**\n * Wrap `el` in a `ClassList`.\n *\n * @param {Element} el\n * @return {ClassList}\n * @api public\n */\n\nmodule.exports = function(el){\n  return new ClassList(el);\n};\n\n/**\n * Initialize a new ClassList for `el`.\n *\n * @param {Element} el\n * @api private\n */\n\nfunction ClassList(el) {\n  this.el = el;\n  this.list = el.classList;\n}\n\n/**\n * Add class `name` if not already present.\n *\n * @param {String} name\n * @return {ClassList}\n * @api public\n */\n\nClassList.prototype.add = function(name){\n  // classList\n  if (this.list) {\n    this.list.add(name);\n    return this;\n  }\n\n  // fallback\n  var arr = this.array();\n  var i = index(arr, name);\n  if (!~i) arr.push(name);\n  this.el.className = arr.join(' ');\n  return this;\n};\n\n/**\n * Remove class `name` when present, or\n * pass a regular expression to remove\n * any which match.\n *\n * @param {String|RegExp} name\n * @return {ClassList}\n * @api public\n */\n\nClassList.prototype.remove = function(name){\n  if ('[object RegExp]' == toString.call(name)) {\n    return this.removeMatching(name);\n  }\n\n  // classList\n  if (this.list) {\n    this.list.remove(name);\n    return this;\n  }\n\n  // fallback\n  var arr = this.array();\n  var i = index(arr, name);\n  if (~i) arr.splice(i, 1);\n  this.el.className = arr.join(' ');\n  return this;\n};\n\n/**\n * Remove all classes matching `re`.\n *\n * @param {RegExp} re\n * @return {ClassList}\n * @api private\n */\n\nClassList.prototype.removeMatching = function(re){\n  var arr = this.array();\n  for (var i = 0; i < arr.length; i++) {\n    if (re.test(arr[i])) {\n      this.remove(arr[i]);\n    }\n  }\n  return this;\n};\n\n/**\n * Toggle class `name`.\n *\n * @param {String} name\n * @return {ClassList}\n * @api public\n */\n\nClassList.prototype.toggle = function(name){\n  // classList\n  if (this.list) {\n    this.list.toggle(name);\n    return this;\n  }\n\n  // fallback\n  if (this.has(name)) {\n    this.remove(name);\n  } else {\n    this.add(name);\n  }\n  return this;\n};\n\n/**\n * Return an array of classes.\n *\n * @return {Array}\n * @api public\n */\n\nClassList.prototype.array = function(){\n  var str = this.el.className.replace(/^\\s+|\\s+$/g, '');\n  var arr = str.split(re);\n  if ('' === arr[0]) arr.shift();\n  return arr;\n};\n\n/**\n * Check if class `name` is present.\n *\n * @param {String} name\n * @return {ClassList}\n * @api public\n */\n\nClassList.prototype.has =\nClassList.prototype.contains = function(name){\n  return this.list\n    ? this.list.contains(name)\n    : !! ~index(this.array(), name);\n};\n//@ sourceURL=component-classes/index.js"
));
require.register("yields-indexof/index.js", Function("exports, require, module",
"\n/**\n * indexof\n */\n\nvar indexof = [].indexOf;\n\n/**\n * Get the index of the given `el`.\n *\n * @param {Element} el\n * @return {Number}\n */\n\nmodule.exports = function(el){\n  if (!el.parentNode) return -1;\n\n  var list = el.parentNode.children\n    , len = list.length;\n\n  if (indexof) return indexof.call(list, el);\n  for (var i = 0; i < len; ++i) {\n    if (el == list[i]) return i;\n  }\n  return -1;\n};\n//@ sourceURL=yields-indexof/index.js"
));
require.register("movearound/index.js", Function("exports, require, module",
"/**\n * dependencies\n */\n\nvar emitter = require('emitter')\n  , classes = require('classes')\n  , events = require('events')\n  , indexof = require('indexof');\n\n/**\n * export `Movearound`\n */\n\nmodule.exports = Movearound;\n\n/**\n * Initialize `Movearound` with `el`.\n *\n * @param {Element} el\n * @param {String} className class name to find the draggable elements\n * @param {Boolean} handle [optional] whether to set handler element\n * @param {String} class name used for finding sortable elements\n */\n\nfunction Movearound(el, className, handle){\n  if (!(this instanceof Movearound)) return new Movearound(el, className);\n  if (!el) throw new TypeError('connector(): expects an element');\n  this.className = className;\n  this.handle = handle;\n  this.events = events(el, this);\n  this.el = el;\n}\n\n/**\n * mixins.\n */\n\nemitter(Movearound.prototype);\n\n/**\n * bind internal events.\n *\n * @return {Movearound}\n */\n\nMovearound.prototype.bind = function(e){\n  this.events.unbind();\n  this.events.bind('dragstart');\n  this.events.bind('dragover');\n  this.events.bind('dragenter');\n  this.events.bind('dragend');\n  this.events.bind('drop');\n  this.events.bind('mousedown');\n  this.events.bind('mouseup');\n  this.parents = this.el.querySelectorAll('.' + this.className);\n  this.els = [];\n  for (var i = 0; i < this.parents.length; i++) {\n    var children = this.parents[i].children;\n    for (var j = 0; j < children.length; j++) {\n      if (!this.handle) {\n        children[j].classList.add('handler')\n      }\n      this.els.push(children[j]);\n    }\n  }\n  if (this.els.length === 0) return;\n  return this;\n};\n\nMovearound.prototype._clone = function(node) {\n  this.clone = null;\n  this.clone = node.cloneNode(true);\n  this.clone.innerHTML = '';\n  classes(this.clone).add('sortable-placeholder');\n};\n\n/**\n * unbind internal events.\n *\n * @return {Movearound}\n */\n\nMovearound.prototype.unbind = function(e){\n  this.events.unbind();\n  this.parents = null;\n  this.clone = null;\n  return this;\n};\n\n/**\n * destroy movearound\n *\n * @return  {Movearound}\n */\n\nMovearound.prototype.remove = function() {\n  this.events.unbind();\n  this.off();\n  this.unbind();\n};\n\nMovearound.prototype.onmousedown = function(e) {\n  var node = e.target;\n  while (node && node !== this.el){\n    if (node.classList.contains('handler')) {\n      for (var i = 0; i < this.els.length; i++) {\n        if (this.els[i].contains(node)) {\n          this.draggable = this.els[i];\n          this.draggable.draggable = true;\n        }\n      }\n      this._handler = node;\n      return;\n    }\n    node = node.parentNode;\n  }\n  this._handler = null;\n};\n\nMovearound.prototype.onmouseup = function(e) {\n  if (this.draggable) {\n    this.draggable.draggable = false;\n  }\n};\n/**\n * on-dragstart\n */\n\nMovearound.prototype.ondragstart = function(e){\n  if (!this._handler) {\n    return e.preventDefault();\n  }\n  this._handler = null;\n  this._clone(this.draggable);\n  this.i = indexof(e.target);\n  this.parent = e.target.parentNode;\n  this.display = window.getComputedStyle(e.target).display;\n  var h = window.getComputedStyle(e.target).height;\n  this.clone.style.height = h;\n  e.dataTransfer.setData('text', ' ');\n  e.dataTransfer.effectAllowed = 'move';\n  classes(e.target).add('dragging');\n  this.emit('start', e);\n};\n\n/**\n * on-dragover\n * on-dragenter\n */\n\nMovearound.prototype.ondragenter =\nMovearound.prototype.ondragover = function(e){\n  e.preventDefault();\n  if (!this.draggable || !this.clone) return;\n  if (e.target === this.el) return;\n  var el = e.target;\n  var parent;\n  if (contains(this.parents, el)) {\n    parent = el;\n    el = null;\n  } else {\n    while (el && el !== this.el) {\n      parent = el.parentNode;\n      if ( parent && contains(this.parents, parent))  break;\n      el = parent;\n    }\n  }\n  if (!parent) return;\n  e.dataTransfer.dropEffect = 'move';\n  this.draggable.style.display = 'none';\n  if (el) {\n    var ci = indexof(this.clone);\n    var i = indexof(el);\n    if (ci < i) el = el.nextSibling;\n  }\n  parent.insertBefore(this.clone, el);\n};\n\n/**\n * on-dragend\n */\n\nMovearound.prototype.ondragend = function(e){\n  if (this.clone) remove(this.clone);\n  if (!this.draggable) return;\n  this.draggable.style.display = this.display;\n  classes(this.draggable).remove('dragging');\n  this.draggable.draggable = false;\n  if (indexof(this.draggable) !== this.i\n      || this.draggable.parentNode !== this.parent){\n      this.emit('update');\n  }\n};\n\n/**\n * on-drop\n */\n\nMovearound.prototype.ondrop = function(e){\n  e.stopPropagation();\n  this.clone.parentNode.insertBefore(this.draggable, this.clone);\n  this.ondragend(e);\n  this.emit('drop');\n  this.reset();\n};\n\n/**\n * Reset sortable.\n *\n * @api private\n * @return {Movearound}\n */\n\nMovearound.prototype.reset = function(){\n  this.i = null;\n  this.parent = null;\n  this.draggable = null;\n  this.display = null;\n};\n\n/**\n * Remove the given `el`.\n *\n * @param {Element} el\n * @return {Element}\n */\n\nfunction remove(el){\n  if (!el.parentNode) return;\n  el.parentNode.removeChild(el);\n}\n\n/**\n * set `els` `prop` to `val`.\n *\n * TODO: separate component\n *\n * @param {NodeList} els\n * @param {String} prop\n * @param {Mixed} val\n */\n\nfunction prop(els, prop, val){\n  if(!els) return;\n  for (var i = 0, len = els.length; i < len; ++i) {\n    els[i][prop] = val\n  }\n}\n\nfunction contains (list, element) {\n  for (var i = 0; i < list.length; i++) {\n    if (list[i] === element) {\n      return true;\n    }\n  }\n  return false;\n}\n//@ sourceURL=movearound/index.js"
));
require.alias("component-emitter/index.js", "movearound/deps/emitter/index.js");
require.alias("component-emitter/index.js", "emitter/index.js");
require.alias("component-indexof/index.js", "component-emitter/deps/indexof/index.js");

require.alias("component-events/index.js", "movearound/deps/events/index.js");
require.alias("component-events/index.js", "events/index.js");
require.alias("component-event/index.js", "component-events/deps/event/index.js");

require.alias("component-delegate/index.js", "component-events/deps/delegate/index.js");
require.alias("component-matches-selector/index.js", "component-delegate/deps/matches-selector/index.js");
require.alias("component-query/index.js", "component-matches-selector/deps/query/index.js");

require.alias("component-event/index.js", "component-delegate/deps/event/index.js");

require.alias("component-classes/index.js", "movearound/deps/classes/index.js");
require.alias("component-classes/index.js", "classes/index.js");
require.alias("component-indexof/index.js", "component-classes/deps/indexof/index.js");

require.alias("yields-indexof/index.js", "movearound/deps/indexof/index.js");
require.alias("yields-indexof/index.js", "movearound/deps/indexof/index.js");
require.alias("yields-indexof/index.js", "indexof/index.js");
require.alias("yields-indexof/index.js", "yields-indexof/index.js");

require.alias("movearound/index.js", "movearound/index.js");

