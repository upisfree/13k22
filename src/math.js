// to the top, to constants
let EPS = 0.01;
let PI2 = Math.PI / 2;
let sin = Math.sin;
let cos = Math.cos;
let tan = Math.tan;
let sqrt = Math.sqrt;
let min = Math.min;
let max = Math.max;
let abs = Math.abs;
let sign = Math.sign;
let round = Math.round;

function step(edge, x) {
  if (x < edge) {
    return 0;
  } else {
    return 1;
  }
}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

// ======================================================================
//  Linear algebra and helpers.
// ======================================================================

// Conceptually, an "infinitesimaly small" real number.
var EPSILON = 0.001;


// Dot product of two 3D vectors.
var DotProduct = function(v1, v2) {
  return v1[0]*v2[0] + v1[1]*v2[1] + v1[2]*v2[2];
}


// Length of a 3D vector.
var Length = function(vec) {
  return Math.sqrt(DotProduct(vec, vec));
}


// Multiplies a scalar and a vector.
var MultiplySV = function(k, vec) {
  return [k*vec[0], k*vec[1], k*vec[2]];
}


// Multiplies a matrix and a vector.
var MultiplyMV = function(mat, vec) {
  var result = [0, 0, 0];

  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      result[i] += vec[j]*mat[i][j];
    }
  }

  return result;
}


// Computes v1 + v2.
var Add = function(v1, v2) {
  return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
}


// Computes v1 - v2.
var Subtract = function(v1, v2) {
  return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
}


// Clamps a color to the canonical color range.
var Clamp = function(vec) {
  return [Math.min(255, Math.max(0, vec[0])),
      Math.min(255, Math.max(0, vec[1])),
      Math.min(255, Math.max(0, vec[2]))];
}


// Computes the reflection of v1 respect to v2.
var ReflectRay = function(v1, v2) {
  return Subtract(MultiplySV(2*DotProduct(v1, v2), v2), v1);
}

var InvertDirection = function(dir) {
  return [
    1 / dir[0],
    1 / dir[1],
    1 / dir[2]
  ];
}
