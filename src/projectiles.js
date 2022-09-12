let projectiles = [];
let projSpeed = 0.5;

function newProjectile() {
  let p = {
    pos: Add(camera_position, [0,0,0]), // clone camera pos
    dir: [
      sin(mouseRot.x),
      0,
      cos(mouseRot.x)
    ],
    box: new Box([0, 0, 0], [0.1, 0.1, 0.1], [255, 0, 0], null, 500, 0)
  };

  projectiles.push(p);
  boxes.push(p.box);
}

function updateProjectiles() {
  // player
  // if (isMousePressed) {
  //   newProjectile();
  // }

  projectiles.forEach(p => {
    updateProj(p);
  });
}

function updateProj(p) {
  let movement =
    MultiplySV(
      projSpeed,
      p.dir
    );

  p.pos = Add(p.pos, movement);
  p.pos[1] = -0.1;
  p.box.moveProj(p.pos);

  removeProj(p);
}

// мб сделать полноценные коллизии? или слишком медленно будет? проверим с игроками?
function removeProj(p) {
  // check bounds
  // много символов?
  if (p.pos[0] > 30 || p.pos[0] < -30 || p.pos[2] > 30 || p.pos[2] < -30) {
    projectiles = projectiles.filter(pr => pr !== p);
    boxes = boxes.filter(pr => pr !== p.box);
  }
}
