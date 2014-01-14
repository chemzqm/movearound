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
