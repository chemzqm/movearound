/**
 * Require the module at `name`.
 *
 * @param {String} name
 * @return {Object} exports
 * @api public
 */

function require(name) {
  var module = require.modules[name];
  if (!module) throw new Error('failed to require "' + name + '"');

  if (!('exports' in module) && typeof module.definition === 'function') {
    module.client = module.component = true;
    module.definition.call(this, module.exports = {}, module);
    delete module.definition;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Register module at `name` with callback `definition`.
 *
 * @param {String} name
 * @param {Function} definition
 * @api private
 */

require.register = function (name, definition) {
  require.modules[name] = {
    definition: definition
  };
};

/**
 * Define a module's exports immediately with `exports`.
 *
 * @param {String} name
 * @param {Generic} exports
 * @api private
 */

require.define = function (name, exports) {
  require.modules[name] = {
    exports: exports
  };
};
require.register("component~emitter@1.1.3", Function("exports, module",
"\n\
/**\n\
 * Expose `Emitter`.\n\
 */\n\
\n\
module.exports = Emitter;\n\
\n\
/**\n\
 * Initialize a new `Emitter`.\n\
 *\n\
 * @api public\n\
 */\n\
\n\
function Emitter(obj) {\n\
  if (obj) return mixin(obj);\n\
};\n\
\n\
/**\n\
 * Mixin the emitter properties.\n\
 *\n\
 * @param {Object} obj\n\
 * @return {Object}\n\
 * @api private\n\
 */\n\
\n\
function mixin(obj) {\n\
  for (var key in Emitter.prototype) {\n\
    obj[key] = Emitter.prototype[key];\n\
  }\n\
  return obj;\n\
}\n\
\n\
/**\n\
 * Listen on the given `event` with `fn`.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @return {Emitter}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.on =\n\
Emitter.prototype.addEventListener = function(event, fn){\n\
  this._callbacks = this._callbacks || {};\n\
  (this._callbacks[event] = this._callbacks[event] || [])\n\
    .push(fn);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Adds an `event` listener that will be invoked a single\n\
 * time then automatically removed.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @return {Emitter}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.once = function(event, fn){\n\
  var self = this;\n\
  this._callbacks = this._callbacks || {};\n\
\n\
  function on() {\n\
    self.off(event, on);\n\
    fn.apply(this, arguments);\n\
  }\n\
\n\
  on.fn = fn;\n\
  this.on(event, on);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Remove the given callback for `event` or all\n\
 * registered callbacks.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @return {Emitter}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.off =\n\
Emitter.prototype.removeListener =\n\
Emitter.prototype.removeAllListeners =\n\
Emitter.prototype.removeEventListener = function(event, fn){\n\
  this._callbacks = this._callbacks || {};\n\
\n\
  // all\n\
  if (0 == arguments.length) {\n\
    this._callbacks = {};\n\
    return this;\n\
  }\n\
\n\
  // specific event\n\
  var callbacks = this._callbacks[event];\n\
  if (!callbacks) return this;\n\
\n\
  // remove all handlers\n\
  if (1 == arguments.length) {\n\
    delete this._callbacks[event];\n\
    return this;\n\
  }\n\
\n\
  // remove specific handler\n\
  var cb;\n\
  for (var i = 0; i < callbacks.length; i++) {\n\
    cb = callbacks[i];\n\
    if (cb === fn || cb.fn === fn) {\n\
      callbacks.splice(i, 1);\n\
      break;\n\
    }\n\
  }\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Emit `event` with the given args.\n\
 *\n\
 * @param {String} event\n\
 * @param {Mixed} ...\n\
 * @return {Emitter}\n\
 */\n\
\n\
Emitter.prototype.emit = function(event){\n\
  this._callbacks = this._callbacks || {};\n\
  var args = [].slice.call(arguments, 1)\n\
    , callbacks = this._callbacks[event];\n\
\n\
  if (callbacks) {\n\
    callbacks = callbacks.slice(0);\n\
    for (var i = 0, len = callbacks.length; i < len; ++i) {\n\
      callbacks[i].apply(this, args);\n\
    }\n\
  }\n\
\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Return array of callbacks for `event`.\n\
 *\n\
 * @param {String} event\n\
 * @return {Array}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.listeners = function(event){\n\
  this._callbacks = this._callbacks || {};\n\
  return this._callbacks[event] || [];\n\
};\n\
\n\
/**\n\
 * Check if this emitter has `event` handlers.\n\
 *\n\
 * @param {String} event\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.hasListeners = function(event){\n\
  return !! this.listeners(event).length;\n\
};\n\
\n\
//# sourceURL=components/component/emitter/1.1.3/index.js"
));

require.modules["component-emitter"] = require.modules["component~emitter@1.1.3"];
require.modules["component~emitter"] = require.modules["component~emitter@1.1.3"];
require.modules["emitter"] = require.modules["component~emitter@1.1.3"];


require.register("chemzqm~tap-event@0.0.8", Function("exports, module",
"var cancelEvents = [\n\
  'touchcancel',\n\
  'touchstart',\n\
]\n\
\n\
var endEvents = [\n\
  'touchend',\n\
]\n\
\n\
module.exports = Tap\n\
\n\
function Tap(callback) {\n\
  // to keep track of the original listener\n\
  listener.handler = callback\n\
\n\
  return listener\n\
\n\
  // el.addEventListener('touchstart', listener)\n\
  function listener(e1) {\n\
    // tap should only happen with a single finger\n\
    if (!e1.touches || e1.touches.length > 1)\n\
      return\n\
\n\
    var el = this;\n\
\n\
    cancelEvents.forEach(function (event) {\n\
      document.addEventListener(event, cleanup)\n\
    })\n\
    el.addEventListener('touchmove', cleanup);\n\
\n\
    endEvents.forEach(function (event) {\n\
      document.addEventListener(event, done)\n\
    })\n\
\n\
    function done(e2) {\n\
      // since touchstart is added on the same tick\n\
      // and because of bubbling,\n\
      // it'll execute this on the same touchstart.\n\
      // this filters out the same touchstart event.\n\
      if (e1 === e2)\n\
        return\n\
\n\
      cleanup()\n\
\n\
      // already handled\n\
      if (e2.defaultPrevented)\n\
        return\n\
\n\
      var preventDefault = e1.preventDefault\n\
      var stopPropagation = e1.stopPropagation\n\
\n\
      e2.stopPropagation = function () {\n\
        stopPropagation.call(e1)\n\
        stopPropagation.call(e2)\n\
      }\n\
\n\
      e2.preventDefault = function () {\n\
        preventDefault.call(e1)\n\
        preventDefault.call(e2)\n\
      }\n\
\n\
      // calls the handler with the `end` event,\n\
      // but i don't think it matters.\n\
      callback.call(el, e2)\n\
    }\n\
\n\
    function cleanup(e2) {\n\
      if (e1 === e2)\n\
        return\n\
\n\
      cancelEvents.forEach(function (event) {\n\
        document.removeEventListener(event, cleanup)\n\
      })\n\
      el.removeEventListener('touchmove', cleanup);\n\
\n\
      endEvents.forEach(function (event) {\n\
        document.removeEventListener(event, done)\n\
      })\n\
    }\n\
  }\n\
}\n\
\n\
//# sourceURL=components/chemzqm/tap-event/0.0.8/index.js"
));

require.modules["chemzqm-tap-event"] = require.modules["chemzqm~tap-event@0.0.8"];
require.modules["chemzqm~tap-event"] = require.modules["chemzqm~tap-event@0.0.8"];
require.modules["tap-event"] = require.modules["chemzqm~tap-event@0.0.8"];


require.register("component~event@0.1.4", Function("exports, module",
"var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',\n\
    unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',\n\
    prefix = bind !== 'addEventListener' ? 'on' : '';\n\
\n\
/**\n\
 * Bind `el` event `type` to `fn`.\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} type\n\
 * @param {Function} fn\n\
 * @param {Boolean} capture\n\
 * @return {Function}\n\
 * @api public\n\
 */\n\
\n\
exports.bind = function(el, type, fn, capture){\n\
  el[bind](prefix + type, fn, capture || false);\n\
  return fn;\n\
};\n\
\n\
/**\n\
 * Unbind `el` event `type`'s callback `fn`.\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} type\n\
 * @param {Function} fn\n\
 * @param {Boolean} capture\n\
 * @return {Function}\n\
 * @api public\n\
 */\n\
\n\
exports.unbind = function(el, type, fn, capture){\n\
  el[unbind](prefix + type, fn, capture || false);\n\
  return fn;\n\
};\n\
//# sourceURL=components/component/event/0.1.4/index.js"
));

require.modules["component-event"] = require.modules["component~event@0.1.4"];
require.modules["component~event"] = require.modules["component~event@0.1.4"];
require.modules["event"] = require.modules["component~event@0.1.4"];


require.register("component~query@0.0.3", Function("exports, module",
"function one(selector, el) {\n\
  return el.querySelector(selector);\n\
}\n\
\n\
exports = module.exports = function(selector, el){\n\
  el = el || document;\n\
  return one(selector, el);\n\
};\n\
\n\
exports.all = function(selector, el){\n\
  el = el || document;\n\
  return el.querySelectorAll(selector);\n\
};\n\
\n\
exports.engine = function(obj){\n\
  if (!obj.one) throw new Error('.one callback required');\n\
  if (!obj.all) throw new Error('.all callback required');\n\
  one = obj.one;\n\
  exports.all = obj.all;\n\
  return exports;\n\
};\n\
\n\
//# sourceURL=components/component/query/0.0.3/index.js"
));

require.modules["component-query"] = require.modules["component~query@0.0.3"];
require.modules["component~query"] = require.modules["component~query@0.0.3"];
require.modules["query"] = require.modules["component~query@0.0.3"];


require.register("component~matches-selector@0.1.2", Function("exports, module",
"/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var query = require(\"component~query@0.0.3\");\n\
\n\
/**\n\
 * Element prototype.\n\
 */\n\
\n\
var proto = Element.prototype;\n\
\n\
/**\n\
 * Vendor function.\n\
 */\n\
\n\
var vendor = proto.matches\n\
  || proto.webkitMatchesSelector\n\
  || proto.mozMatchesSelector\n\
  || proto.msMatchesSelector\n\
  || proto.oMatchesSelector;\n\
\n\
/**\n\
 * Expose `match()`.\n\
 */\n\
\n\
module.exports = match;\n\
\n\
/**\n\
 * Match `el` to `selector`.\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} selector\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
\n\
function match(el, selector) {\n\
  if (vendor) return vendor.call(el, selector);\n\
  var nodes = query.all(selector, el.parentNode);\n\
  for (var i = 0; i < nodes.length; ++i) {\n\
    if (nodes[i] == el) return true;\n\
  }\n\
  return false;\n\
}\n\
\n\
//# sourceURL=components/component/matches-selector/0.1.2/index.js"
));

require.modules["component-matches-selector"] = require.modules["component~matches-selector@0.1.2"];
require.modules["component~matches-selector"] = require.modules["component~matches-selector@0.1.2"];
require.modules["matches-selector"] = require.modules["component~matches-selector@0.1.2"];


require.register("discore~closest@0.1.2", Function("exports, module",
"var matches = require(\"component~matches-selector@0.1.2\")\n\
\n\
module.exports = function (element, selector, checkYoSelf, root) {\n\
  element = checkYoSelf ? {parentNode: element} : element\n\
\n\
  root = root || document\n\
\n\
  // Make sure `element !== document` and `element != null`\n\
  // otherwise we get an illegal invocation\n\
  while ((element = element.parentNode) && element !== document) {\n\
    if (matches(element, selector))\n\
      return element\n\
    // After `matches` on the edge case that\n\
    // the selector matches the root\n\
    // (when the root is not the document)\n\
    if (element === root)\n\
      return  \n\
  }\n\
}\n\
//# sourceURL=components/discore/closest/0.1.2/index.js"
));

require.modules["discore-closest"] = require.modules["discore~closest@0.1.2"];
require.modules["discore~closest"] = require.modules["discore~closest@0.1.2"];
require.modules["closest"] = require.modules["discore~closest@0.1.2"];


require.register("component~delegate@0.2.2", Function("exports, module",
"/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var closest = require(\"discore~closest@0.1.2\")\n\
  , event = require(\"component~event@0.1.4\");\n\
\n\
/**\n\
 * Delegate event `type` to `selector`\n\
 * and invoke `fn(e)`. A callback function\n\
 * is returned which may be passed to `.unbind()`.\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} selector\n\
 * @param {String} type\n\
 * @param {Function} fn\n\
 * @param {Boolean} capture\n\
 * @return {Function}\n\
 * @api public\n\
 */\n\
\n\
exports.bind = function(el, selector, type, fn, capture){\n\
  return event.bind(el, type, function(e){\n\
    var target = e.target || e.srcElement;\n\
    e.delegateTarget = closest(target, selector, true, el);\n\
    if (e.delegateTarget) fn.call(el, e);\n\
  }, capture);\n\
};\n\
\n\
/**\n\
 * Unbind event `type`'s callback `fn`.\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} type\n\
 * @param {Function} fn\n\
 * @param {Boolean} capture\n\
 * @api public\n\
 */\n\
\n\
exports.unbind = function(el, type, fn, capture){\n\
  event.unbind(el, type, fn, capture);\n\
};\n\
\n\
//# sourceURL=components/component/delegate/0.2.2/index.js"
));

require.modules["component-delegate"] = require.modules["component~delegate@0.2.2"];
require.modules["component~delegate"] = require.modules["component~delegate@0.2.2"];
require.modules["delegate"] = require.modules["component~delegate@0.2.2"];


require.register("chemzqm~events@1.0.9", Function("exports, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var events = require(\"component~event@0.1.4\");\n\
var delegate = require(\"component~delegate@0.2.2\");\n\
var tap = require(\"chemzqm~tap-event@0.0.8\");\n\
var closest = require(\"discore~closest@0.1.2\");\n\
\n\
/**\n\
 * Expose `Events`.\n\
 */\n\
\n\
module.exports = Events;\n\
\n\
/**\n\
 * Initialize an `Events` with the given\n\
 * `el` object which events will be bound to,\n\
 * and the `obj` which will receive method calls.\n\
 *\n\
 * @param {Object} el\n\
 * @param {Object} obj\n\
 * @api public\n\
 */\n\
\n\
function Events(el, obj) {\n\
  if (!(this instanceof Events)) return new Events(el, obj);\n\
  if (!el) throw new Error('element required');\n\
  if (!obj) throw new Error('object required');\n\
  this.el = el;\n\
  this.obj = obj;\n\
  this._events = {};\n\
}\n\
\n\
/**\n\
 * Subscription helper.\n\
 */\n\
\n\
Events.prototype.sub = function(event, method, cb){\n\
  this._events[event] = this._events[event] || {};\n\
  this._events[event][method] = cb;\n\
};\n\
\n\
/**\n\
 * Bind to `event` with optional `method` name.\n\
 * When `method` is undefined it becomes `event`\n\
 * with the \"on\" prefix.\n\
 *\n\
 * Examples:\n\
 *\n\
 *  Direct event handling:\n\
 *\n\
 *    events.bind('click') // implies \"onclick\"\n\
 *    events.bind('click', 'remove')\n\
 *    events.bind('click', 'sort', 'asc')\n\
 *\n\
 *  Delegated event handling:\n\
 *\n\
 *    events.bind('click li > a')\n\
 *    events.bind('click li > a', 'remove')\n\
 *    events.bind('click a.sort-ascending', 'sort', 'asc')\n\
 *    events.bind('click a.sort-descending', 'sort', 'desc')\n\
 *\n\
 * @param {String} event\n\
 * @param {String|function} [method]\n\
 * @return {Function} callback\n\
 * @api public\n\
 */\n\
\n\
Events.prototype.bind = function(event, method){\n\
  var e = parse(event);\n\
  var el = this.el;\n\
  var obj = this.obj;\n\
  var name = e.name;\n\
  var method = method || 'on' + name;\n\
  var args = [].slice.call(arguments, 2);\n\
  var cb;\n\
\n\
  if (name === 'tap') {\n\
    cb = this.getTapCallback(e, method, args);\n\
    name = 'touchstart';\n\
  } else {\n\
    // callback\n\
    cb = function (){\n\
      var a = [].slice.call(arguments).concat(args);\n\
      obj[method].apply(obj, a);\n\
    }\n\
  }\n\
\n\
  // bind\n\
  if (e.selector) {\n\
    cb = delegate.bind(el, e.selector, name, cb);\n\
  } else {\n\
    events.bind(el, name, cb);\n\
  }\n\
\n\
  // subscription for unbinding\n\
  this.sub(name, method, cb);\n\
\n\
  return cb;\n\
};\n\
\n\
Events.prototype.getTapCallback = function (e, method, args) {\n\
  var obj = this.obj;\n\
  var el = this.el;\n\
  var selector = e.selector;\n\
  return tap(function (ev) {\n\
    if (selector) {\n\
      ev.delegateTarget = closest(ev.target, selector, true, el);\n\
    }\n\
    var a = [].slice.call(arguments).concat(args);\n\
    obj[method].apply(obj, a);\n\
  })\n\
}\n\
\n\
/**\n\
 * Unbind a single binding, all bindings for `event`,\n\
 * or all bindings within the manager.\n\
 *\n\
 * Examples:\n\
 *\n\
 *  Unbind direct handlers:\n\
 *\n\
 *     events.unbind('click', 'remove')\n\
 *     events.unbind('click')\n\
 *     events.unbind()\n\
 *\n\
 * Unbind delegate handlers:\n\
 *\n\
 *     events.unbind('click', 'remove')\n\
 *     events.unbind('click')\n\
 *     events.unbind()\n\
 *\n\
 * @param {String|Function} [event]\n\
 * @param {String|Function} [method]\n\
 * @api public\n\
 */\n\
\n\
Events.prototype.unbind = function(event, method){\n\
  if (0 == arguments.length) return this.unbindAll();\n\
  if (1 == arguments.length) return this.unbindAllOf(event);\n\
\n\
  // no bindings for this event\n\
  var bindings = this._events[event];\n\
  if (!bindings) return;\n\
\n\
  // no bindings for this method\n\
  var cb = bindings[method];\n\
  if (!cb) return;\n\
\n\
  events.unbind(this.el, event, cb);\n\
};\n\
\n\
/**\n\
 * Unbind all events.\n\
 *\n\
 * @api private\n\
 */\n\
\n\
Events.prototype.unbindAll = function(){\n\
  for (var event in this._events) {\n\
    this.unbindAllOf(event);\n\
  }\n\
};\n\
\n\
/**\n\
 * Unbind all events for `event`.\n\
 *\n\
 * @param {String} event\n\
 * @api private\n\
 */\n\
\n\
Events.prototype.unbindAllOf = function(event){\n\
  var bindings = this._events[event];\n\
  if (!bindings) return;\n\
\n\
  for (var method in bindings) {\n\
    this.unbind(event, method);\n\
  }\n\
};\n\
\n\
/**\n\
 * Parse `event`.\n\
 *\n\
 * @param {String} event\n\
 * @return {Object}\n\
 * @api private\n\
 */\n\
\n\
function parse(event) {\n\
  var parts = event.split(/ +/);\n\
  return {\n\
    name: parts.shift(),\n\
    selector: parts.join(' ')\n\
  }\n\
}\n\
\n\
//# sourceURL=components/chemzqm/events/1.0.9/index.js"
));

require.modules["chemzqm-events"] = require.modules["chemzqm~events@1.0.9"];
require.modules["chemzqm~events"] = require.modules["chemzqm~events@1.0.9"];
require.modules["events"] = require.modules["chemzqm~events@1.0.9"];


require.register("component~indexof@0.0.3", Function("exports, module",
"module.exports = function(arr, obj){\n\
  if (arr.indexOf) return arr.indexOf(obj);\n\
  for (var i = 0; i < arr.length; ++i) {\n\
    if (arr[i] === obj) return i;\n\
  }\n\
  return -1;\n\
};\n\
//# sourceURL=components/component/indexof/0.0.3/index.js"
));

require.modules["component-indexof"] = require.modules["component~indexof@0.0.3"];
require.modules["component~indexof"] = require.modules["component~indexof@0.0.3"];
require.modules["indexof"] = require.modules["component~indexof@0.0.3"];


require.register("component~classes@1.2.1", Function("exports, module",
"/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var index = require(\"component~indexof@0.0.3\");\n\
\n\
/**\n\
 * Whitespace regexp.\n\
 */\n\
\n\
var re = /\\s+/;\n\
\n\
/**\n\
 * toString reference.\n\
 */\n\
\n\
var toString = Object.prototype.toString;\n\
\n\
/**\n\
 * Wrap `el` in a `ClassList`.\n\
 *\n\
 * @param {Element} el\n\
 * @return {ClassList}\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(el){\n\
  return new ClassList(el);\n\
};\n\
\n\
/**\n\
 * Initialize a new ClassList for `el`.\n\
 *\n\
 * @param {Element} el\n\
 * @api private\n\
 */\n\
\n\
function ClassList(el) {\n\
  if (!el) throw new Error('A DOM element reference is required');\n\
  this.el = el;\n\
  this.list = el.classList;\n\
}\n\
\n\
/**\n\
 * Add class `name` if not already present.\n\
 *\n\
 * @param {String} name\n\
 * @return {ClassList}\n\
 * @api public\n\
 */\n\
\n\
ClassList.prototype.add = function(name){\n\
  // classList\n\
  if (this.list) {\n\
    this.list.add(name);\n\
    return this;\n\
  }\n\
\n\
  // fallback\n\
  var arr = this.array();\n\
  var i = index(arr, name);\n\
  if (!~i) arr.push(name);\n\
  this.el.className = arr.join(' ');\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Remove class `name` when present, or\n\
 * pass a regular expression to remove\n\
 * any which match.\n\
 *\n\
 * @param {String|RegExp} name\n\
 * @return {ClassList}\n\
 * @api public\n\
 */\n\
\n\
ClassList.prototype.remove = function(name){\n\
  if ('[object RegExp]' == toString.call(name)) {\n\
    return this.removeMatching(name);\n\
  }\n\
\n\
  // classList\n\
  if (this.list) {\n\
    this.list.remove(name);\n\
    return this;\n\
  }\n\
\n\
  // fallback\n\
  var arr = this.array();\n\
  var i = index(arr, name);\n\
  if (~i) arr.splice(i, 1);\n\
  this.el.className = arr.join(' ');\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Remove all classes matching `re`.\n\
 *\n\
 * @param {RegExp} re\n\
 * @return {ClassList}\n\
 * @api private\n\
 */\n\
\n\
ClassList.prototype.removeMatching = function(re){\n\
  var arr = this.array();\n\
  for (var i = 0; i < arr.length; i++) {\n\
    if (re.test(arr[i])) {\n\
      this.remove(arr[i]);\n\
    }\n\
  }\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Toggle class `name`, can force state via `force`.\n\
 *\n\
 * For browsers that support classList, but do not support `force` yet,\n\
 * the mistake will be detected and corrected.\n\
 *\n\
 * @param {String} name\n\
 * @param {Boolean} force\n\
 * @return {ClassList}\n\
 * @api public\n\
 */\n\
\n\
ClassList.prototype.toggle = function(name, force){\n\
  // classList\n\
  if (this.list) {\n\
    if (\"undefined\" !== typeof force) {\n\
      if (force !== this.list.toggle(name, force)) {\n\
        this.list.toggle(name); // toggle again to correct\n\
      }\n\
    } else {\n\
      this.list.toggle(name);\n\
    }\n\
    return this;\n\
  }\n\
\n\
  // fallback\n\
  if (\"undefined\" !== typeof force) {\n\
    if (!force) {\n\
      this.remove(name);\n\
    } else {\n\
      this.add(name);\n\
    }\n\
  } else {\n\
    if (this.has(name)) {\n\
      this.remove(name);\n\
    } else {\n\
      this.add(name);\n\
    }\n\
  }\n\
\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Return an array of classes.\n\
 *\n\
 * @return {Array}\n\
 * @api public\n\
 */\n\
\n\
ClassList.prototype.array = function(){\n\
  var str = this.el.className.replace(/^\\s+|\\s+$/g, '');\n\
  var arr = str.split(re);\n\
  if ('' === arr[0]) arr.shift();\n\
  return arr;\n\
};\n\
\n\
/**\n\
 * Check if class `name` is present.\n\
 *\n\
 * @param {String} name\n\
 * @return {ClassList}\n\
 * @api public\n\
 */\n\
\n\
ClassList.prototype.has =\n\
ClassList.prototype.contains = function(name){\n\
  return this.list\n\
    ? this.list.contains(name)\n\
    : !! ~index(this.array(), name);\n\
};\n\
\n\
//# sourceURL=components/component/classes/1.2.1/index.js"
));

require.modules["component-classes"] = require.modules["component~classes@1.2.1"];
require.modules["component~classes"] = require.modules["component~classes@1.2.1"];
require.modules["classes"] = require.modules["component~classes@1.2.1"];


require.register("yields~indexof@1.0.0", Function("exports, module",
"\n\
/**\n\
 * indexof\n\
 */\n\
\n\
var indexof = [].indexOf;\n\
\n\
/**\n\
 * Get the index of the given `el`.\n\
 *\n\
 * @param {Element} el\n\
 * @return {Number}\n\
 */\n\
\n\
module.exports = function(el){\n\
  if (!el.parentNode) return -1;\n\
\n\
  var list = el.parentNode.children\n\
    , len = list.length;\n\
\n\
  if (indexof) return indexof.call(list, el);\n\
  for (var i = 0; i < len; ++i) {\n\
    if (el == list[i]) return i;\n\
  }\n\
  return -1;\n\
};\n\
\n\
//# sourceURL=components/yields/indexof/1.0.0/index.js"
));

require.modules["yields-indexof"] = require.modules["yields~indexof@1.0.0"];
require.modules["yields~indexof"] = require.modules["yields~indexof@1.0.0"];
require.modules["indexof"] = require.modules["yields~indexof@1.0.0"];


require.register("movearound", Function("exports, module",
"/**\n\
 * dependencies\n\
 */\n\
\n\
var emitter = require(\"component~emitter@1.1.3\")\n\
  , classes = require(\"component~classes@1.2.1\")\n\
  , events = require(\"chemzqm~events@1.0.9\")\n\
  , indexof = require(\"yields~indexof@1.0.0\");\n\
\n\
/**\n\
 * export `Movearound`\n\
 */\n\
\n\
module.exports = Movearound;\n\
\n\
/**\n\
 * Initialize `Movearound` with `el`.\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} className class name to find the draggable elements\n\
 * @param {Boolean} handle [optional] whether to set handler element\n\
 * @param {String} class name used for finding sortable elements\n\
 */\n\
\n\
function Movearound(el, className, handle){\n\
  if (!(this instanceof Movearound)) return new Movearound(el, className);\n\
  if (!el) throw new TypeError('connector(): expects an element');\n\
  this.className = className;\n\
  this.handle = handle;\n\
  this.events = events(el, this);\n\
  this.el = el;\n\
}\n\
\n\
/**\n\
 * mixins.\n\
 */\n\
\n\
emitter(Movearound.prototype);\n\
\n\
/**\n\
 * bind internal events.\n\
 *\n\
 * @return {Movearound}\n\
 */\n\
\n\
Movearound.prototype.bind = function(){\n\
  this.events.unbind();\n\
  this.events.bind('dragstart');\n\
  this.events.bind('dragover');\n\
  this.events.bind('dragenter');\n\
  this.events.bind('dragend');\n\
  this.events.bind('drop');\n\
  this.events.bind('mousedown');\n\
  this.events.bind('mouseup');\n\
  return this;\n\
};\n\
\n\
Movearound.prototype._clone = function(node) {\n\
  this.clone = null;\n\
  this.clone = node.cloneNode(true);\n\
  this.clone.innerHTML = '';\n\
  classes(this.clone).add('movearound-placeholder');\n\
};\n\
\n\
/**\n\
 * unbind internal events.\n\
 *\n\
 * @return {Movearound}\n\
 */\n\
\n\
Movearound.prototype.unbind = function(e){\n\
  this.events.unbind();\n\
  this.parents = null;\n\
  this.clone = null;\n\
  return this;\n\
};\n\
\n\
/**\n\
 * destroy movearound\n\
 *\n\
 * @return  {Movearound}\n\
 */\n\
\n\
Movearound.prototype.remove = function() {\n\
  this.events.unbind();\n\
  this.off();\n\
  this.unbind();\n\
};\n\
\n\
Movearound.prototype.onmousedown = function(e) {\n\
  var node = e.target;\n\
  this.parents = this.el.querySelectorAll('.' + this.className);\n\
  this.els = [];\n\
  for (var i = 0; i < this.parents.length; i++) {\n\
    var children = this.parents[i].children;\n\
    for (var j = 0; j < children.length; j++) {\n\
      if (!this.handle) {\n\
        children[j].classList.add('movearound-handler')\n\
      }\n\
      this.els.push(children[j]);\n\
    }\n\
  }\n\
  while (node && node !== this.el){\n\
    if (node.classList.contains('movearound-handler')) {\n\
      for (var k = 0; k < this.els.length; k++) {\n\
        if (this.els[k].contains(node)) {\n\
          this.draggable = this.els[k];\n\
          this.draggable.draggable = true;\n\
        }\n\
      }\n\
      this._handler = node;\n\
      return;\n\
    }\n\
    node = node.parentNode;\n\
  }\n\
  this._handler = null;\n\
};\n\
\n\
Movearound.prototype.onmouseup = function(e) {\n\
  if (this.draggable) {\n\
    this.draggable.draggable = false;\n\
  }\n\
};\n\
/**\n\
 * on-dragstart\n\
 */\n\
\n\
Movearound.prototype.ondragstart = function(e){\n\
  if (!this._handler) {\n\
    return e.preventDefault();\n\
  }\n\
  this._handler = null;\n\
  this._clone(this.draggable);\n\
  this.i = indexof(e.target);\n\
  this.parent = e.target.parentNode;\n\
  this.display = window.getComputedStyle(e.target).display;\n\
  var h = window.getComputedStyle(e.target).height;\n\
  this.clone.style.height = h;\n\
  e.dataTransfer.setData('text', ' ');\n\
  e.dataTransfer.effectAllowed = 'move';\n\
  classes(e.target).add('dragging');\n\
  this.emit('start', e);\n\
};\n\
\n\
/**\n\
 * on-dragover\n\
 * on-dragenter\n\
 */\n\
\n\
Movearound.prototype.ondragenter =\n\
Movearound.prototype.ondragover = function(e){\n\
  e.preventDefault();\n\
  if (!this.draggable || !this.clone) return;\n\
  if (e.target === this.el) return;\n\
  var el = e.target;\n\
  var parent;\n\
  if (within(this.parents, el)) {\n\
    parent = el;\n\
    el = null;\n\
  } else {\n\
    while (el && el !== this.el) {\n\
      parent = el.parentNode;\n\
      if ( parent && within(this.parents, parent))  break;\n\
      el = parent;\n\
    }\n\
  }\n\
  if (!parent || parent === this.el) return;\n\
  e.dataTransfer.dropEffect = 'move';\n\
  this.draggable.style.display = 'none';\n\
  if (el) {\n\
    var ci = indexof(this.clone);\n\
    var i = indexof(el);\n\
    if (ci < i) el = el.nextSibling;\n\
  }\n\
  parent.insertBefore(this.clone, el);\n\
};\n\
\n\
/**\n\
 * on-dragend\n\
 */\n\
\n\
Movearound.prototype.ondragend = function(e){\n\
  if (this.clone) remove(this.clone);\n\
  if (!this.draggable) return;\n\
  this.draggable.style.display = this.display;\n\
  classes(this.draggable).remove('dragging');\n\
  this.draggable.draggable = false;\n\
  if (indexof(this.draggable) !== this.i\n\
      || this.draggable.parentNode !== this.parent){\n\
      this.emit('update');\n\
  }\n\
};\n\
\n\
/**\n\
 * on-drop\n\
 */\n\
\n\
Movearound.prototype.ondrop = function(e){\n\
  e.stopPropagation();\n\
  this.clone.parentNode.insertBefore(this.draggable, this.clone);\n\
  this.ondragend(e);\n\
  this.emit('drop');\n\
  this.reset();\n\
};\n\
\n\
/**\n\
 * Reset sortable.\n\
 *\n\
 * @api private\n\
 * @return {Movearound}\n\
 */\n\
\n\
Movearound.prototype.reset = function(){\n\
  this.i = null;\n\
  this.parent = null;\n\
  this.draggable = null;\n\
  this.display = null;\n\
};\n\
\n\
/**\n\
 * Remove the given `el`.\n\
 *\n\
 * @param {Element} el\n\
 * @return {Element}\n\
 */\n\
\n\
function remove(el){\n\
  if (!el.parentNode) return;\n\
  el.parentNode.removeChild(el);\n\
}\n\
\n\
/**\n\
 * set `els` `prop` to `val`.\n\
 *\n\
 * TODO: separate component\n\
 *\n\
 * @param {NodeList} els\n\
 * @param {String} prop\n\
 * @param {Mixed} val\n\
 */\n\
\n\
function prop(els, p, val){\n\
  if(!els) return;\n\
  for (var i = 0, len = els.length; i < len; ++i) {\n\
    els[i][p] = val\n\
  }\n\
}\n\
\n\
function within (list, element) {\n\
  for (var i = 0; i < list.length; i++) {\n\
    if (list[i] === element) {\n\
      return true;\n\
    }\n\
  }\n\
  return false;\n\
}\n\
\n\
//# sourceURL=index.js"
));

require.modules["movearound"] = require.modules["movearound"];


