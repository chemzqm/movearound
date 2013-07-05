/**
 * dependencies
 */

var emitter = require('emitter')
  , classes = require('classes')
  , events = require('events')
  , indexof = require('indexof');

/**
 * export `Movearound`
 */

module.exports = Movearound;

/**
 * Initialize `Movearound` with `el`.
 *
 * @param {Element} el
 * @param {String} class name used for finding sortable elements
 */

function Movearound(el, className){
  if (!(this instanceof Movearound)) return new Movearound(el, className);
  if (!el) throw new TypeError('connector(): expects an element');
  this.className = className;
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

Movearound.prototype.bind = function(e){
  this.events.unbind();
  this.events.bind('dragstart');
  this.events.bind('dragover');
  this.events.bind('dragenter');
  this.events.bind('dragend');
  this.events.bind('drop');
  this.parents = this.el.querySelectorAll('.' + this.className);
  this.els = [];
  for (var i = 0; i < this.parents.length; i++) {
    var children = this.parents[i].children;
    for (var j = 0; j < children.length; j++) {
      this.els.push(children[j]);
    }
  }
  if (this.els.length === 0) return;
  prop(this.els, 'draggable', true);
  this.clone = this.els[0].cloneNode(true);
  this.clone.innerHTML = '';
  classes(this.clone).add('sortable-placeholder');
  return this;
};

/**
 * unbind internal events.
 *
 * @return {Movearound}
 */

Movearound.prototype.unbind = function(e){
  prop(this.els, 'draggable', false);
  this.events.unbind();
  return this;
};

/**
 * on-dragstart
 */

Movearound.prototype.ondragstart = function(e){
  this.draggable = e.target;
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
  if (!this.draggable) return;
  if (e.target === this.el) return;
  var el = e.target;
  var parent;
  if (contains(this.parents, el)) {
    parent = el;
    el = null;
  } else {
    while (el && el !== this.el) {
      parent = el.parentNode;
      if ( parent && contains(this.parents, parent))  break;
      el = parent;
    }
  }
  if (!parent) return;
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
  if (!this.draggable) return;
  if (this.clone) remove(this.clone);
  this.draggable.style.display = this.display;
  classes(this.draggable).remove('dragging');
  this.emit('update');
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

function prop(els, prop, val){
  if(!els) return;
  for (var i = 0, len = els.length; i < len; ++i) {
    els[i][prop] = val
  }
}

function contains (list, element) {
  for (var i = 0; i < list.length; i++) {
    if (list[i] === element) {
      return true;
    }
  }
  return false;
}
