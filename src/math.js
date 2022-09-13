// to the top, to constants
let EPS = 0.01;
let PI2 = Math.PI / 2;
let PI = Math.PI;
let {
  sin, cos, tan, sqrt, min, max, abs, sign, random, pow, round
} = Math;

function step(edge, x) {
  if (x < edge) {
    return 0;
  } else {
    return 1;
  }
}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

// Conceptually, an "infinitesimaly small" real number.
var EPSILON = 0.001;

// Dot product of two 3D vectors.
function DotProduct(v1, v2) {
  return v1[0]*v2[0] + v1[1]*v2[1] + v1[2]*v2[2];
}

// Length of a 3D vector.
function Length(vec) {
  return sqrt(DotProduct(vec, vec));
}

// Multiplies a scalar and a vector.
function MultiplySV(k, vec) {
  return [k*vec[0], k*vec[1], k*vec[2]];
}

// Multiplies a matrix and a vector.
function MultiplyMV(mat, vec) {
  var result = [0, 0, 0];

  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      result[i] += vec[j]*mat[i][j];
    }
  }

  return result;
}

// Computes v1 + v2.
function Add(v1, v2) {
  return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
}

// Computes v1 - v2.
function Subtract(v1, v2) {
  return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
}

// Clamps a color to the canonical color range.
function Clamp(vec) {
  return [min(255, max(0, vec[0])),
      min(255, max(0, vec[1])),
      min(255, max(0, vec[2]))];
}

// Computes the reflection of v1 respect to v2.
function ReflectRay(v1, v2) {
  return Subtract(MultiplySV(2*DotProduct(v1, v2), v2), v1);
}

function InvertDirection(dir) {
  return [
    1 / dir[0],
    1 / dir[1],
    1 / dir[2]
  ];
}

function ContainsPoint(point, box) {
  return point[0] < box.min[0] || point[0] > box.max[0] ||
         point[1] < box.min[1] || point[1] > box.max[1] ||
         point[2] < box.min[2] || point[2] > box.max[2] ? false : true;
}
