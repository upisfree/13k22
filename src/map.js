function generateMap() {
  let side = 10;

  for (let y = -side; y < side; y++) {
    for (let x = -side; x < side; x++) {
      if (
        (x > 1 || x < -1) && // safe
        (y > 1 || y < -1) && // space
        Math.random() < 0.25
      ) {
        addWall(x, y);
      }
    }
  }

  let leftWall = new Box(
    [-12 * wallSize, -1, -12 * wallSize],
    [-12 * wallSize + wallSize, 1, 12 * wallSize + wallSize],
    [255 * Math.random(), 255 * Math.random(), 255 * Math.random()],
    null,
    2000 * Math.random(),
    0
  );

  let rightWall = new Box(
    [12 * wallSize, -1, -12 * wallSize],
    [12 * wallSize + wallSize, 1, 12 * wallSize + wallSize],
    [255 * Math.random(), 255 * Math.random(), 255 * Math.random()],
    null,
    2000 * Math.random(),
    0
  );

  let topWall = new Box(
    [-12 * wallSize, -1, 12 * wallSize],
    [12 * wallSize + wallSize, 1, 12 * wallSize + wallSize],
    [255 * Math.random(), 255 * Math.random(), 255 * Math.random()],
    null,
    2000 * Math.random(),
    0
  );

  let bottomWall = new Box(
    [-12 * wallSize, -1, -12 * wallSize],
    [12 * wallSize + wallSize, 1, -12 * wallSize + wallSize],
    [255 * Math.random(), 255 * Math.random(), 255 * Math.random()],
    null,
    2000 * Math.random(),
    0
  );

  boxes.push(leftWall, rightWall, topWall, bottomWall);
  walls.push(leftWall, rightWall, topWall, bottomWall);
}

function addWall(x, y) {
  let box = new Box(
    [x * wallSize, -1, y * wallSize],
    [x * wallSize + wallSize, 1, y * wallSize + wallSize],
    [255 * Math.random(), 255 * Math.random(), 255 * Math.random()],
    null,
    2000 * Math.random(),
    0
  );

  boxes.push(box);
  walls.push(box);

  return box;
}
