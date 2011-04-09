
var DualQuaternionTest = TestCase('DualQuaternionTest');


DualQuaternionTest.prototype.testRotateVector = function() {
  var v = animus.Vector.I;
  var q = animus.DualQuaternion.fromAxisAngle(animus.Vector.J, Math.PI / 2);
  var result = q.transform(v);
  assertRoughlyEquals(0, result.x, 0.01);
  assertRoughlyEquals(0, result.y, 0.01);
  assertRoughlyEquals(-1, result.z, 0.01);
};


DualQuaternionTest.prototype.testRotateVectorTwice = function() {
  var v = animus.Vector.I;
  var q0 = animus.DualQuaternion.fromAxisAngle(animus.Vector.J, Math.PI / 2);
  var q1 = animus.DualQuaternion.fromAxisAngle(animus.Vector.I, Math.PI / 2);
  var result = q1.times(q0).transform(v);
  var expected = q1.transform(q0.transform(v));
  assertRoughlyEquals(expected.x, result.x, 0.01);
  assertRoughlyEquals(expected.y, result.y, 0.01);
  assertRoughlyEquals(expected.z, result.z, 0.01);
  assertRoughlyEquals(0, result.x, 0.01);
  assertRoughlyEquals(1, result.y, 0.01);
  assertRoughlyEquals(0, result.z, 0.01);
};


DualQuaternionTest.prototype.testDoUndoRotate = function() {
  var v = animus.Vector.I;
  var q = animus.DualQuaternion.fromAxisAngle(animus.Vector.J, Math.PI / 2);
  var result = q.reciprocal().transform(q.transform(v));
  assertRoughlyEquals(1, result.x, 0.01);
  assertRoughlyEquals(0, result.y, 0.01);
  assertRoughlyEquals(0, result.z, 0.01);
  result = q.reciprocal().times(q).transform(v);
  assertRoughlyEquals(1, result.x, 0.01);
  assertRoughlyEquals(0, result.y, 0.01);
  assertRoughlyEquals(0, result.z, 0.01);
};


DualQuaternionTest.prototype.testTranslate = function() {
  var v = animus.Vector.I;
  var q = animus.DualQuaternion.fromTranslation(animus.Vector.J);
  var result = q.transform(v);
  assertRoughlyEquals(1, result.x, 0.01);
  assertRoughlyEquals(1, result.y, 0.01);
  assertRoughlyEquals(0, result.z, 0.01);
};


DualQuaternionTest.prototype.testTranslateTwice = function() {
  var v = animus.Vector.I;
  var q0 = animus.DualQuaternion.fromTranslation(animus.Vector.J);
  var q1 = animus.DualQuaternion.fromTranslation(animus.Vector.I);
  var result = q1.times(q0).transform(v);
  var expected = q1.transform(q0.transform(v));
  assertRoughlyEquals(expected.x, result.x, 0.01);
  assertRoughlyEquals(expected.y, result.y, 0.01);
  assertRoughlyEquals(expected.z, result.z, 0.01);
  assertRoughlyEquals(2, result.x, 0.01);
  assertRoughlyEquals(1, result.y, 0.01);
  assertRoughlyEquals(0, result.z, 0.01);
};


DualQuaternionTest.prototype.testDoUndoTranslate = function() {
  var v = animus.Vector.I;
  var q = animus.DualQuaternion.fromTranslation(new animus.Vector(1, 2, 3));
  var result = q.reciprocal().transform(q.transform(v));
  assertRoughlyEquals(1, result.x, 0.01);
  assertRoughlyEquals(0, result.y, 0.01);
  assertRoughlyEquals(0, result.z, 0.01);
  result = q.reciprocal().times(q).transform(v);
  assertRoughlyEquals(1, result.x, 0.01);
  assertRoughlyEquals(0, result.y, 0.01);
  assertRoughlyEquals(0, result.z, 0.01);
};


DualQuaternionTest.prototype.testTranslateRotate = function() {
  var v = animus.Vector.I;
  var q = animus.DualQuaternion.fromAxisAngle(animus.Vector.J, Math.PI / 2);
  q = q.times(animus.DualQuaternion.fromTranslation(animus.Vector.J));
  var result = q.transform(v);
  assertRoughlyEquals(0, result.x, 0.01);
  assertRoughlyEquals(1, result.y, 0.01);
  assertRoughlyEquals(-1, result.z, 0.01);
};


DualQuaternionTest.prototype.testTranslateRotateTwice = function() {
  var v = animus.Vector.I;
  var q0 = animus.DualQuaternion.fromAxisAngle(animus.Vector.J, Math.PI / 2);
  q0 = q0.times(animus.DualQuaternion.fromTranslation(animus.Vector.J));
  var q1 = animus.DualQuaternion.fromAxisAngle(animus.Vector.K, Math.PI / 2);
  q1 = q1.times(animus.DualQuaternion.fromTranslation(animus.Vector.I));
  var result = q1.times(q0).transform(v);
  var expected = q1.transform(q0.transform(v));
  assertRoughlyEquals(expected.x, result.x, 0.01);
  assertRoughlyEquals(expected.y, result.y, 0.01);
  assertRoughlyEquals(expected.z, result.z, 0.01);
  assertRoughlyEquals(-1, result.x, 0.01);
  assertRoughlyEquals(1, result.y, 0.01);
  assertRoughlyEquals(-1, result.z, 0.01);
};


DualQuaternionTest.prototype.testDoUndoTranslateRotate = function() {
  var v = animus.Vector.I;
  var q = animus.DualQuaternion.fromAxisAngle(animus.Vector.J, Math.PI / 2);
  q = q.times(animus.DualQuaternion.fromTranslation(animus.Vector.J));
  var result = q.reciprocal().transform(q.transform(v));
  assertRoughlyEquals(1, result.x, 0.01);
  assertRoughlyEquals(0, result.y, 0.01);
  assertRoughlyEquals(0, result.z, 0.01);
  result = q.reciprocal().times(q).transform(v);
  assertRoughlyEquals(1, result.x, 0.01);
  assertRoughlyEquals(0, result.y, 0.01);
  assertRoughlyEquals(0, result.z, 0.01);
};


DualQuaternionTest.prototype.testLerp = function() {
  var v = animus.Vector.I;
  var q = new animus.DualQuaternion();
  var r = animus.DualQuaternion.fromAxisAngle(animus.Vector.J, Math.PI / 2);
  var s = q.lerp(r, 0.5);
  var result = s.transform(v);
  assertRoughlyEquals(0.707, result.x, 0.01);
  assertRoughlyEquals(0, result.y, 0.01);
  assertRoughlyEquals(-0.707, result.z, 0.01);
  s = q.lerp(r, 0.0);
  result = s.transform(v);
  assertRoughlyEquals(1, result.x, 0.01);
  assertRoughlyEquals(0, result.y, 0.01);
  assertRoughlyEquals(0, result.z, 0.01);
  s = q.lerp(r, 1.0);
  result = s.transform(v);
  assertRoughlyEquals(0, result.x, 0.01);
  assertRoughlyEquals(0, result.y, 0.01);
  assertRoughlyEquals(-1, result.z, 0.01);
};
