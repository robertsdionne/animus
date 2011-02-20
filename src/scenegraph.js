// Copyright 2011 Robert Scott Dionne. All Rights Reserved.

/**
 *
 */
animus.Node = function() {};


/**
 * @param {animus.Visitor} visitor
 */
animus.Node.prototype.visit = function(visitor) {
  visitor.visitNode(this);
};


animus.Composite = function() {
  this.children = [];
};
animus.inherits(animus.Composite, animus.Node);


animus.Composite.prototype.visit = function(visitor) {
  visitor.visitComposite(this);
};


animus.Leaf = function() {};
animus.inherits(animus.Leaf, animus.Node);


animus.Leaf.prototype.visit = function(visitor) {
  visitor.visitLeaf(this);
};


animus.Transform = function() {};
animus.inherits(animus.Transform, animus.Composite);


animus.Transform.prototype.visit = function(visitor) {
  visitor.visitTransform(this);
};


animus.Geometry = function() {};
animus.inherits(animus.Geometry, animus.Leaf);


animus.Geometry.prototype.visit = function(visitor) {
  visitor.visitGeometry(this);
};


animus.Visitor = function() {};


animus.Visitor.prototype.visitNode = animus.nullFunction;


animus.Visitor.prototype.visitComposite = animus.nullFunction;


animus.Visitor.prototype.visitLeaf = animus.nullFunction;


animus.Visitor.prototype.visitTransform = animus.nullFunction;


animus.Visitor.prototype.visitGeometry = animus.nullFunction;


animus.WebGlVisitor = function(gl) {
  this.gl_ = gl;
};
animus.inherits(animus.WebGlVisitor, animus.Visitor);


animus.WebGlVisitor.prototype.visitTransform = function(transform) {
  var visitor = this;
  transform.children.forEach(function(child) {
    visitor.visit(child);
  });
};


animus.WebGlVisitor.prototype.visitGeometry = function(geometry) {

};
