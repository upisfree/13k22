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
        let up = { x: 1, y: 1, z: 0 };
        let r = { x: camRotation.x, y: camRotation.y % PI / 4, z: camRotation.z };

        camPosition = add(
          camPosition,
          scale(
            crossProduct(r, up),
            playerSpeed
          )
        );
      }

      if (c == 'KeyS') {
        camPosition.z -= playerSpeed;
      }

      if (c == 'KeyA') {
        camPosition.x -= playerSpeed;
      }

      if (c == 'KeyD') {
        camPosition.x += playerSpeed;
      }
    }
  }
}

// mouse
canvas.onclick = () => {
  canvas.requestPointerLock();
};

document.addEventListener('mousemove', updateMouse);

function normalize(a) {
  return a - (PI * 2) * Math.floor(a / (PI * 2));
}

function updateMouse(e) {
  if (document.pointerLockElement === canvas) {
    let newX = -e.movementY * mouseSpeed;
    let newY = -e.movementX * mouseSpeed;
    
    let xCut = PI2 - .0001; // engines may not like xRot == pi/2

    let oldX = camRotation.x;
    let oldY = camRotation.y;

    camRotation.x = clamp(oldX + newX, xCut);
    camRotation.y = (oldY + newY) % (PI * 2);

    updateCameraRotation();
  }
}

function updateCameraRotation() {
  let { x, y } = camRotation;

  let target = {
    x: sin(y),
    y: sin(x) * cos(y),
    z: cos(x) * cos(y)
  };

  camTarget = add(camPosition, target);
}