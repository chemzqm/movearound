/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Movearound = __webpack_require__(1);
	var dom = document.querySelector('.languages');

	// all
	var movearound = new Movearound(dom, 'col');
	movearound.bind();
	movearound.on('update', function(){
	    console.log(11);
	});

	var numbers = document.getElementById('numbers');
	var m = new Movearound(numbers, 'column');
	m.bind();

	document.querySelector('#add').addEventListener('click', function(){
	    var el = document.createElement('div');
	    el.innerHTML = 'Go';
	    var target = document.querySelector('.languages .col:first-child');
	    target.appendChild(el);
	})

	document.querySelector('#remove').addEventListener('click', function(){
	    var el = document.querySelector('.col div:first-child');
	    el.parentNode.removeChild(el);
	})

	document.querySelector('#addcolumn').addEventListener('click', function(){
	    var el = document.createElement('div');
	    el.style.height = '300px';
	    el.className = 'col';
	    document.querySelector('.languages').appendChild(el);
	})


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * dependencies
	 */

	var emitter = __webpack_require__(2)
	  , classes = __webpack_require__(3)
	  , events = __webpack_require__(5)
	  , indexOf = __webpack_require__(4);

	/**
	 * export `Movearound`
	 */

	module.exports = Movearound;

	function indexof(el) {
	  if (!el.parentNode) return -1;
	  var list = el.parentNode.children;
	  if (!list || list.length === 0) return -1;
	  return indexOf(list, el);
	}

	/**
	 * Initialize `Movearound` with `el`.
	 *
	 * @param {Element} el
	 * @param {String} className class name to find the draggable elements
	 * @param {Boolean} handle [optional] whether to set handler element
	 * @param {String} class name used for finding sortable elements
	 */

	function Movearound(el, className, handle){
	  if (!(this instanceof Movearound)) return new Movearound(el, className);
	  if (!el) throw new TypeError('connector(): expects an element');
	  this.className = className;
	  this.handle = handle;
	  this.events = events(el, this);
	  this.el = el;
	}

	/**
	 * mixins.
	 */

	emitter(Movearound.prototype);

	/**
	 * bind internal events.
	 *
	 * @return {Movearound}
	 */

	Movearound.prototype.bind = function(){
	  this.events.unbind();
	  this.events.bind('dragstart');
	  this.events.bind('dragover');
	  this.events.bind('dragenter');
	  this.events.bind('dragend');
	  this.events.bind('drop');
	  this.events.bind('mousedown');
	  this.events.bind('mouseup');
	  return this;
	};

	Movearound.prototype._clone = function(node) {
	  this.clone = null;
	  this.clone = node.cloneNode(true);
	  this.clone.innerHTML = '';
	  classes(this.clone).add('movearound-placeholder');
	};

	/**
	 * unbind internal events.
	 *
	 * @return {Movearound}
	 */

	Movearound.prototype.unbind = function(e){
	  this.events.unbind();
	  this.parents = null;
	  this.clone = null;
	  return this;
	};

	/**
	 * destroy movearound
	 *
	 * @return  {Movearound}
	 */

	Movearound.prototype.remove = function() {
	  this.events.unbind();
	  this.off();
	  this.unbind();
	};

	Movearound.prototype.onmousedown = function(e) {
	  var node = e.target;
	  this.parents = this.el.querySelectorAll('.' + this.className);
	  this.els = [];
	  for (var i = 0; i < this.parents.length; i++) {
	    var children = this.parents[i].children;
	    for (var j = 0; j < children.length; j++) {
	      if (!this.handle) {
	        children[j].classList.add('movearound-handler')
	      }
	      this.els.push(children[j]);
	    }
	  }
	  while (node && node !== this.el){
	    if (node.classList.contains('movearound-handler')) {
	      for (var k = 0; k < this.els.length; k++) {
	        if (this.els[k].contains(node)) {
	          this.draggable = this.els[k];
	          this.draggable.draggable = true;
	        }
	      }
	      this._handler = node;
	      return;
	    }
	    node = node.parentNode;
	  }
	  this._handler = null;
	};

	Movearound.prototype.onmouseup = function(e) {
	  if (this.draggable) {
	    this.draggable.draggable = false;
	  }
	};
	/**
	 * on-dragstart
	 */

	Movearound.prototype.ondragstart = function(e){
	  if (!this._handler) {
	    return e.preventDefault();
	  }
	  this._handler = null;
	  this._clone(this.draggable);
	  this.i = indexof(e.target);
	  this.parent = e.target.parentNode;
	  this.display = window.getComputedStyle(e.target).display;
	  var h = window.getComputedStyle(e.target).height;
	  this.clone.style.height = h;
	  e.dataTransfer.setData('text', ' ');
	  e.dataTransfer.effectAllowed = 'move';
	  classes(e.target).add('dragging');
	  this.emit('start', e);
	};

	/**
	 * on-dragover
	 * on-dragenter
	 */

	Movearound.prototype.ondragenter =
	Movearound.prototype.ondragover = function(e){
	  e.preventDefault();
	  if (!this.draggable || !this.clone) return;
	  if (e.target === this.el) return;
	  var el = e.target;
	  var parent;
	  if (within(this.parents, el)) {
	    parent = el;
	    el = null;
	  } else {
	    while (el && el !== this.el) {
	      parent = el.parentNode;
	      if ( parent && within(this.parents, parent))  break;
	      el = parent;
	    }
	  }
	  if (!parent || parent === this.el) return;
	  e.dataTransfer.dropEffect = 'move';
	  this.draggable.style.display = 'none';
	  if (el) {
	    var ci = indexof(this.clone);
	    var i = indexof(el);
	    if (ci < i) el = el.nextSibling;
	  }
	  parent.insertBefore(this.clone, el);
	};

	/**
	 * on-dragend
	 */

	Movearound.prototype.ondragend = function(e){
	  if (this.clone) remove(this.clone);
	  if (!this.draggable) return;
	  this.draggable.style.display = this.display;
	  classes(this.draggable).remove('dragging');
	  this.draggable.draggable = false;
	  if (indexof(this.draggable) !== this.i
	      || this.draggable.parentNode !== this.parent){
	      this.emit('update');
	  }
	};

	/**
	 * on-drop
	 */

	Movearound.prototype.ondrop = function(e){
	  e.stopPropagation();
	  this.clone.parentNode.insertBefore(this.draggable, this.clone);
	  this.ondragend(e);
	  this.emit('drop');
	  this.reset();
	};

	/**
	 * Reset sortable.
	 *
	 * @api private
	 * @return {Movearound}
	 */

	Movearound.prototype.reset = function(){
	  this.i = null;
	  this.parent = null;
	  this.draggable = null;
	  this.display = null;
	};

	/**
	 * Remove the given `el`.
	 *
	 * @param {Element} el
	 * @return {Element}
	 */

	function remove(el){
	  if (!el.parentNode) return;
	  el.parentNode.removeChild(el);
	}

	/**
	 * set `els` `prop` to `val`.
	 *
	 * TODO: separate component
	 *
	 * @param {NodeList} els
	 * @param {String} prop
	 * @param {Mixed} val
	 */

	function prop(els, p, val){
	  if(!els) return;
	  for (var i = 0, len = els.length; i < len; ++i) {
	    els[i][p] = val
	  }
	}

	function within (list, element) {
	  for (var i = 0; i < list.length; i++) {
	    if (list[i] === element) {
	      return true;
	    }
	  }
	  return false;
	}


/***/ },
/* 2 */
/***/ function(module, exports) {

	
	/**
	 * Expose `Emitter`.
	 */

	module.exports = Emitter;

	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */

	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};

	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */

	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}

	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.on =
	Emitter.prototype.addEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
	    .push(fn);
	  return this;
	};

	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.once = function(event, fn){
	  function on() {
	    this.off(event, on);
	    fn.apply(this, arguments);
	  }

	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};

	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.off =
	Emitter.prototype.removeListener =
	Emitter.prototype.removeAllListeners =
	Emitter.prototype.removeEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};

	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }

	  // specific event
	  var callbacks = this._callbacks['$' + event];
	  if (!callbacks) return this;

	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks['$' + event];
	    return this;
	  }

	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};

	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */

	Emitter.prototype.emit = function(event){
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1)
	    , callbacks = this._callbacks['$' + event];

	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }

	  return this;
	};

	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */

	Emitter.prototype.listeners = function(event){
	  this._callbacks = this._callbacks || {};
	  return this._callbacks['$' + event] || [];
	};

	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */

	Emitter.prototype.hasListeners = function(event){
	  return !! this.listeners(event).length;
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var index = __webpack_require__(4);

	/**
	 * Whitespace regexp.
	 */

	var re = /\s+/;

	/**
	 * toString reference.
	 */

	var toString = Object.prototype.toString;

	/**
	 * Wrap `el` in a `ClassList`.
	 *
	 * @param {Element} el
	 * @return {ClassList}
	 * @api public
	 */

	module.exports = function(el){
	  return new ClassList(el);
	};

	/**
	 * Initialize a new ClassList for `el`.
	 *
	 * @param {Element} el
	 * @api private
	 */

	function ClassList(el) {
	  if (!el || !el.nodeType) {
	    throw new Error('A DOM element reference is required');
	  }
	  this.el = el;
	  this.list = el.classList;
	}

	/**
	 * Add class `name` if not already present.
	 *
	 * @param {String} name
	 * @return {ClassList}
	 * @api public
	 */

	ClassList.prototype.add = function(name){
	  // classList
	  if (this.list) {
	    this.list.add(name);
	    return this;
	  }

	  // fallback
	  var arr = this.array();
	  var i = index(arr, name);
	  if (!~i) arr.push(name);
	  this.el.className = arr.join(' ');
	  return this;
	};

	/**
	 * Remove class `name` when present, or
	 * pass a regular expression to remove
	 * any which match.
	 *
	 * @param {String|RegExp} name
	 * @return {ClassList}
	 * @api public
	 */

	ClassList.prototype.remove = function(name){
	  if ('[object RegExp]' == toString.call(name)) {
	    return this.removeMatching(name);
	  }

	  // classList
	  if (this.list) {
	    this.list.remove(name);
	    return this;
	  }

	  // fallback
	  var arr = this.array();
	  var i = index(arr, name);
	  if (~i) arr.splice(i, 1);
	  this.el.className = arr.join(' ');
	  return this;
	};

	/**
	 * Remove all classes matching `re`.
	 *
	 * @param {RegExp} re
	 * @return {ClassList}
	 * @api private
	 */

	ClassList.prototype.removeMatching = function(re){
	  var arr = this.array();
	  for (var i = 0; i < arr.length; i++) {
	    if (re.test(arr[i])) {
	      this.remove(arr[i]);
	    }
	  }
	  return this;
	};

	/**
	 * Toggle class `name`, can force state via `force`.
	 *
	 * For browsers that support classList, but do not support `force` yet,
	 * the mistake will be detected and corrected.
	 *
	 * @param {String} name
	 * @param {Boolean} force
	 * @return {ClassList}
	 * @api public
	 */

	ClassList.prototype.toggle = function(name, force){
	  // classList
	  if (this.list) {
	    if ("undefined" !== typeof force) {
	      if (force !== this.list.toggle(name, force)) {
	        this.list.toggle(name); // toggle again to correct
	      }
	    } else {
	      this.list.toggle(name);
	    }
	    return this;
	  }

	  // fallback
	  if ("undefined" !== typeof force) {
	    if (!force) {
	      this.remove(name);
	    } else {
	      this.add(name);
	    }
	  } else {
	    if (this.has(name)) {
	      this.remove(name);
	    } else {
	      this.add(name);
	    }
	  }

	  return this;
	};

	/**
	 * Return an array of classes.
	 *
	 * @return {Array}
	 * @api public
	 */

	ClassList.prototype.array = function(){
	  var className = this.el.getAttribute('class') || '';
	  var str = className.replace(/^\s+|\s+$/g, '');
	  var arr = str.split(re);
	  if ('' === arr[0]) arr.shift();
	  return arr;
	};

	/**
	 * Check if class `name` is present.
	 *
	 * @param {String} name
	 * @return {ClassList}
	 * @api public
	 */

	ClassList.prototype.has =
	ClassList.prototype.contains = function(name){
	  return this.list
	    ? this.list.contains(name)
	    : !! ~index(this.array(), name);
	};


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = function(arr, obj){
	  if (arr.indexOf) return arr.indexOf(obj);
	  for (var i = 0; i < arr.length; ++i) {
	    if (arr[i] === obj) return i;
	  }
	  return -1;
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */

	var events = __webpack_require__(6);
	var delegate = __webpack_require__(7);

	/**
	 * Expose `Events`.
	 */

	module.exports = Events;

	/**
	 * Initialize an `Events` with the given
	 * `el` object which events will be bound to,
	 * and the `obj` which will receive method calls.
	 *
	 * @param {Object} el
	 * @param {Object} obj
	 * @api public
	 */

	function Events(el, obj) {
	  if (!(this instanceof Events)) return new Events(el, obj);
	  if (!el) throw new Error('element required');
	  if (!obj) throw new Error('object required');
	  this.el = el;
	  this.obj = obj;
	  this._events = {};
	}

	/**
	 * Subscription helper.
	 */

	Events.prototype.sub = function(event, method, cb){
	  this._events[event] = this._events[event] || {};
	  this._events[event][method] = cb;
	};

	/**
	 * Bind to `event` with optional `method` name.
	 * When `method` is undefined it becomes `event`
	 * with the "on" prefix.
	 *
	 * Examples:
	 *
	 *  Direct event handling:
	 *
	 *    events.bind('click') // implies "onclick"
	 *    events.bind('click', 'remove')
	 *    events.bind('click', 'sort', 'asc')
	 *
	 *  Delegated event handling:
	 *
	 *    events.bind('click li > a')
	 *    events.bind('click li > a', 'remove')
	 *    events.bind('click a.sort-ascending', 'sort', 'asc')
	 *    events.bind('click a.sort-descending', 'sort', 'desc')
	 *
	 * @param {String} event
	 * @param {String|function} [method]
	 * @return {Function} callback
	 * @api public
	 */

	Events.prototype.bind = function(event, method){
	  var e = parse(event);
	  var el = this.el;
	  var obj = this.obj;
	  var name = e.name;
	  var method = method || 'on' + name;
	  var args = [].slice.call(arguments, 2);

	  // callback
	  function cb(){
	    var a = [].slice.call(arguments).concat(args);
	    obj[method].apply(obj, a);
	  }

	  // bind
	  if (e.selector) {
	    cb = delegate.bind(el, e.selector, name, cb);
	  } else {
	    events.bind(el, name, cb);
	  }

	  // subscription for unbinding
	  this.sub(name, method, cb);

	  return cb;
	};

	/**
	 * Unbind a single binding, all bindings for `event`,
	 * or all bindings within the manager.
	 *
	 * Examples:
	 *
	 *  Unbind direct handlers:
	 *
	 *     events.unbind('click', 'remove')
	 *     events.unbind('click')
	 *     events.unbind()
	 *
	 * Unbind delegate handlers:
	 *
	 *     events.unbind('click', 'remove')
	 *     events.unbind('click')
	 *     events.unbind()
	 *
	 * @param {String|Function} [event]
	 * @param {String|Function} [method]
	 * @api public
	 */

	Events.prototype.unbind = function(event, method){
	  if (0 == arguments.length) return this.unbindAll();
	  if (1 == arguments.length) return this.unbindAllOf(event);

	  // no bindings for this event
	  var bindings = this._events[event];
	  if (!bindings) return;

	  // no bindings for this method
	  var cb = bindings[method];
	  if (!cb) return;

	  events.unbind(this.el, event, cb);
	};

	/**
	 * Unbind all events.
	 *
	 * @api private
	 */

	Events.prototype.unbindAll = function(){
	  for (var event in this._events) {
	    this.unbindAllOf(event);
	  }
	};

	/**
	 * Unbind all events for `event`.
	 *
	 * @param {String} event
	 * @api private
	 */

	Events.prototype.unbindAllOf = function(event){
	  var bindings = this._events[event];
	  if (!bindings) return;

	  for (var method in bindings) {
	    this.unbind(event, method);
	  }
	};

	/**
	 * Parse `event`.
	 *
	 * @param {String} event
	 * @return {Object}
	 * @api private
	 */

	function parse(event) {
	  var parts = event.split(/ +/);
	  return {
	    name: parts.shift(),
	    selector: parts.join(' ')
	  }
	}


/***/ },
/* 6 */
/***/ function(module, exports) {

	var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
	    unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
	    prefix = bind !== 'addEventListener' ? 'on' : '';

	/**
	 * Bind `el` event `type` to `fn`.
	 *
	 * @param {Element} el
	 * @param {String} type
	 * @param {Function} fn
	 * @param {Boolean} capture
	 * @return {Function}
	 * @api public
	 */

	exports.bind = function(el, type, fn, capture){
	  el[bind](prefix + type, fn, capture || false);
	  return fn;
	};

	/**
	 * Unbind `el` event `type`'s callback `fn`.
	 *
	 * @param {Element} el
	 * @param {String} type
	 * @param {Function} fn
	 * @param {Boolean} capture
	 * @return {Function}
	 * @api public
	 */

	exports.unbind = function(el, type, fn, capture){
	  el[unbind](prefix + type, fn, capture || false);
	  return fn;
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var closest = __webpack_require__(8)
	  , event = __webpack_require__(6);

	/**
	 * Delegate event `type` to `selector`
	 * and invoke `fn(e)`. A callback function
	 * is returned which may be passed to `.unbind()`.
	 *
	 * @param {Element} el
	 * @param {String} selector
	 * @param {String} type
	 * @param {Function} fn
	 * @param {Boolean} capture
	 * @return {Function}
	 * @api public
	 */

	exports.bind = function(el, selector, type, fn, capture){
	  return event.bind(el, type, function(e){
	    var target = e.target || e.srcElement;
	    e.delegateTarget = closest(target, selector, true, el);
	    if (e.delegateTarget) fn.call(el, e);
	  }, capture);
	};

	/**
	 * Unbind event `type`'s callback `fn`.
	 *
	 * @param {Element} el
	 * @param {String} type
	 * @param {Function} fn
	 * @param {Boolean} capture
	 * @api public
	 */

	exports.unbind = function(el, type, fn, capture){
	  event.unbind(el, type, fn, capture);
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module Dependencies
	 */

	var matches = __webpack_require__(9)

	/**
	 * Export `closest`
	 */

	module.exports = closest

	/**
	 * Closest
	 *
	 * @param {Element} el
	 * @param {String} selector
	 * @param {Element} scope (optional)
	 */

	function closest (el, selector, scope) {
	  scope = scope || document.documentElement;

	  // walk up the dom
	  while (el && el !== scope) {
	    if (matches(el, selector)) return el;
	    el = el.parentNode;
	  }

	  // check scope for match
	  return matches(el, selector) ? el : null;
	}


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var query = __webpack_require__(10);

	/**
	 * Element prototype.
	 */

	var proto = Element.prototype;

	/**
	 * Vendor function.
	 */

	var vendor = proto.matches
	  || proto.webkitMatchesSelector
	  || proto.mozMatchesSelector
	  || proto.msMatchesSelector
	  || proto.oMatchesSelector;

	/**
	 * Expose `match()`.
	 */

	module.exports = match;

	/**
	 * Match `el` to `selector`.
	 *
	 * @param {Element} el
	 * @param {String} selector
	 * @return {Boolean}
	 * @api public
	 */

	function match(el, selector) {
	  if (!el || el.nodeType !== 1) return false;
	  if (vendor) return vendor.call(el, selector);
	  var nodes = query.all(selector, el.parentNode);
	  for (var i = 0; i < nodes.length; ++i) {
	    if (nodes[i] == el) return true;
	  }
	  return false;
	}


/***/ },
/* 10 */
/***/ function(module, exports) {

	function one(selector, el) {
	  return el.querySelector(selector);
	}

	exports = module.exports = function(selector, el){
	  el = el || document;
	  return one(selector, el);
	};

	exports.all = function(selector, el){
	  el = el || document;
	  return el.querySelectorAll(selector);
	};

	exports.engine = function(obj){
	  if (!obj.one) throw new Error('.one callback required');
	  if (!obj.all) throw new Error('.all callback required');
	  one = obj.one;
	  exports.all = obj.all;
	  return exports;
	};


/***/ }
/******/ ]);