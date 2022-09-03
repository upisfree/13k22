// check for collision between two boxes
function isCollision(a, b) {
  // using 6 splitting planes to rule out intersections.
  return b.max[0] < a.min[0] || b.min[0] > a.max[0] ||
         b.max[1] < a.min[1] || b.min[1] > a.max[1] ||
         b.max[2] < a.min[2] || b.min[2] > a.max[2] ? false : true;
}