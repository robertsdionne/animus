// Copyright 2011 Robert Scott Dionne. All rights reserved.

/**
 * @param {animus.DualQuaternion} opt_transform
 * @constructor
 * @extends {animus.Composite}
 */
animus.Transform = function(opt_transform) {
  animus.Transform.superClass_.constructor.call(this);
  this.transform = opt_transform || new animus.DualQuaternion();
};
animus.inherits(animus.Transform, animus.Composite);


/**
 * @inheritDoc
 */
animus.Transform.prototype.accept = function(visitor) {
  visitor.visitTransform(this);
};
