// Copyright 2011 Robert Scott Dionne. All rights reserved.

var QuaternionTest = TestCase('QuaternionTest');


QuaternionTest.prototype.testRotateVector = function() {
  var v = animus.Vector.I;
  var q = animus.Quaternion.fromAxisAngle(animus.Vector.J, Math.PI / 2);
  var result = q.transform(v);
  assertRoughlyEquals(0, result.x, 0.01);
  assertRoughlyEquals(0, result.y, 0.01);
  assertRoughlyEquals(-1, result.z, 0.01);
};


QuaternionTest.prototype.testRotateVectorTwice = function() {
  var v = animus.Vector.I;
  var q0 = animus.Quaternion.fromAxisAngle(animus.Vector.J, Math.PI / 2);
  var q1 = animus.Quaternion.fromAxisAngle(animus.Vector.I, Math.PI / 2);
  var result = q1.times(q0).transform(v);
  var expected = q1.transform(q0.transform(v));
  assertRoughlyEquals(expected.x, result.x, 0.01);
  assertRoughlyEquals(expected.y, result.y, 0.01);
  assertRoughlyEquals(expected.z, result.z, 0.01);
  assertRoughlyEquals(0, result.x, 0.01);
  assertRoughlyEquals(1, result.y, 0.01);
  assertRoughlyEquals(0, result.z, 0.01);
};
