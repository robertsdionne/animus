// Copyright 2011 Robert Scott Dionne. All Rights Reserved.

/**
 * @param {animus.Quaternion} opt_rotation
 * @param {animus.Vector} opt_translation
 * @constructor
 * @extends {animus.Composite}
 */
animus.Transform = function(opt_rotation, opt_translation) {
  animus.Transform.superClass_.constructor.call(this);
  this.rotation = opt_rotation || new animus.Quaternion();
  this.translation = opt_translation || new animus.Vector();
  this.transform = animus.DualQuaternion.fromTranslation(this.translation).
      times(animus.DualQuaternion.fromRotation(this.rotation));
};
animus.inherits(animus.Transform, animus.Composite);


/**
 * @inheritDoc
 */
animus.Transform.prototype.accept = function(visitor) {
  this.transform = animus.DualQuaternion.fromTranslation(this.translation).
      times(animus.DualQuaternion.fromRotation(this.rotation));
  visitor.visitTransform(this);
};
