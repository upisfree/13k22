// keyboard
let keys = {};

window.onkeydown = (e) => {
  keys[e.code] = true;
};

window.onkeyup = (e) => {
  delete keys[e.code];
};

function updateKeyboard() {
  for (const c in keys) {
    if (c) {
      if (c == 'KeyW') {
        camPos.z += playerSpeed;

        add(
          camPos,
          scale(
            crossProduct(camRot, UP),
            playerSpeed
          )
        );
      }

      // if (c == 'KeyS') {
      //   camPos.z -= playerSpeed;
      // }

      // if (c == 'KeyA') {
      //   camPos.x -= playerSpeed;
      // }

      // if (c == 'KeyD') {
      //   camPos.x += playerSpeed;
      // }
    }
  }
}

// mouse
canvas.onclick = () => {
  canvas.requestPointerLock();
};

document.addEventListener('mousemove', updateMouse);

function updateMouse(e) {
  if (document.pointerLockElement === canvas) {
    camRot.x += e.movementX * mouseSpeed;
    camRot.y += e.movementY * mouseSpeed;

    camTarget = scale(unitVector(camRot), 1);

    // camTarget.x += e.movementX * mouseSpeed;
    // camTarget.y += e.movementY * mouseSpeed;

    console.log(e.movementX, e.movementY);
  }
}