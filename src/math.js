// math
function dotProduct(a, b) {
  return (a.x * b.x) + (a.y * b.y) + (a.z * b.z);
}

function crossProduct(a, b) {
  return {
    x: (a.y * b.z) - (a.z * b.y),
    y: (a.z * b.x) - (a.x * b.z),
    z: (a.x * b.y) - (a.y * b.x)
  };
}

function length(a) {
  return Math.sqrt(dotProduct(a, a));
}

function scale(a, t) {
  return {
    x: a.x * t,
    y: a.y * t,
    z: a.z * t
  };
}

function unitVector(a) {
  return scale(a, 1 / length(a));
}

function add(a, b) {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
    z: a.z + b.z
  };
}

function subtract(a, b) {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
    z: a.z - b.z
  };
}

function add3(a, b, c) {
  return {
    x: a.x + b.x + c.x,
    y: a.y + b.y + c.y,
    z: a.z + b.z + c.z
  };
}

function reflectThrough(a, normal) {
  var d = scale(normal, dotProduct(a, normal));

  return subtract(scale(d, 2), a);
}

function invDir(a) {
  return {
    x: 1 / a.x,
    y: 1 / a.y,
    z: 1 / a.z
  };
}

function step(edge, x) {
  if (x < edge) {
    return 0;
  } else {
    return 1;
  }
}

function absVec(a) {
  return {
    x: abs(a.x),
    y: abs(a.y),
    z: abs(a.z)
  };
}

// const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function clamp(value, to) {
  return isFinite(to) ? Math.max(Math.min(value, to), -to) : value
}
