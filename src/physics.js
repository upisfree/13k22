// check for collision between two boxes
function isCollision(a, b) {
  // using 6 splitting planes to rule out intersections.
  return b.cmax[0] < a.cmin[0] || b.cmin[0] > a.cmax[0] ||
         b.cmax[1] < a.cmin[1] || b.cmin[1] > a.cmax[1] ||
         b.cmax[2] < a.cmin[2] || b.cmin[2] > a.cmax[2] ? false : true;
}