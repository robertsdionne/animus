
animus.NodeIterator = function(transform) {  
  this.transform = transform;
  this.currentChild = null;
  this.children = transform.children.slice();
};
animus.inherits(animus.NodeIterator, animus.Iterator);



animus.NodeIterator.prototype.hasNext = function() {
  if (this.transform) {
    return true;
  }

  if (this.currentChild && this.currentChild.hasNext()) {
    return this.currentChild.hasNext();
  }

  if (this.children && this.children.length) {
    this.currentChild = this.nextChild();
    return this.hasNext();
  }
};


animus.NodeIterator.prototype.next = function() {
  if (this.transform) {
    var next = this.transform;
    this.transform = null;
    return next;
  }

  if (this.currentChild && this.currentChild.hasNext()) {
    return this.currentChild.next();
  }

  if (this.children && this.children.length) {
    this.currentChild = this.nextChild();
    return this.next();
  }
};


animus.NodeIterator.prototype.nextChild = function() {
  var child = this.children.shift();
  return child ? new animus.NodeIterator(child) : null;
};
