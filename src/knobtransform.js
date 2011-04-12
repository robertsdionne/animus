// Copyright 2011 Robert Scott Dionne. All Rights Reserved.

/**
 * @param {animus.DualQuaternion} opt_rotation
 * @param {animus.DualQuaternion} opt_translation
 * @constructor
 * @extends {animus.Composite}
 */
animus.KnobTransform = function(opt_rotation, opt_translation) {
  animus.KnobTransform.superClass_.constructor.call(this);
  this.rotation = opt_rotation || new animus.DualQuaternion();
  this.translation = opt_translation || new animus.DualQuaternion();
};
animus.inherits(animus.KnobTransform, animus.Composite);


/**
 * @inheritDoc
 */
animus.KnobTransform.prototype.accept = function(visitor) {
  visitor.visitKnobTransform(this);
};
