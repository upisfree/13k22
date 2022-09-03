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
        movePlayer([0, 0, 1]);
      }

      if (c == 'KeyS') {
        movePlayer([0, 0, -1]);
      }

      if (c == 'KeyA') {
        movePlayer([-1, 0, 0]);
      }

      if (c == 'KeyD') {
        movePlayer([1, 0, 0]);
      }
    }
  }
}

function movePlayer(direction) {
  let movement = 
    MultiplySV(
      moveSpeed,
      MultiplyMV(
        camera_rotation,
        direction
      )
    );

  // no flying
  movement[1] = 0;

  // collision check
  boxes.forEach(box => {
    if (!box.collider) {
      return;
    }

    let a = playerBox;
    let b = box;

    // x collision
    if (isCollision(a, b)) {
      if (box.onPickup) {
        box.onPickup();

        if (!box.collider) {
          return;          
        }
      }

      if (b.cmax[0] > a.cmin[0] + movement[0] && b.cmin[0] < a.cmax[0] + movement[0]) {
        movement[0] = 0;
      }

      // z collision
      if (b.cmax[2] > a.cmin[2] + movement[2] && b.cmin[2] < a.cmax[2] + movement[2]) {
        movement[2] = 0;
      }
    }
  });

  camera_position = Add(camera_position, movement);
  
  // покачивание камеры при хотьбе
  camera_position[1] += cos(Date.now() / 100) / 100;
  
  // возвращаем в ноль постепенно, если зашли слишком далеко
  if (abs(camera_position[1]) > 0.1) {
    camera_position[1] *= 0.0001;
  }
  
  playerBox.movePlayer(camera_position);
}

// mouse
// mouse
canvas.onclick = () => {
  canvas.requestPointerLock();
};

document.addEventListener('mousemove', updateMouse);

// to the top, to constants
let mouseSpeed = 0.002;
let moveSpeed = 0.1;

let mouseRot = {
  x: 0,
  y: 0
};

function updateMouse(e) {
  if (document.pointerLockElement === canvas) {
    let newX = e.movementX * mouseSpeed;
    let newY = e.movementY * mouseSpeed;
    
    let yCut = PI2 - .01; // engines may not like yRot == pi/2

    let oldX = mouseRot.x;
    let oldY = mouseRot.y;

    mouseRot.x = oldX + newX;
    mouseRot.y = clamp(oldY + newY, -yCut, yCut);

    let x = mouseRot.x;
    let y = mouseRot.y;

    // // Вращение по оси X — ок отдельноо
    // camera_rotation = [
    //     [cos(x), 0, sin(x)],
    //     [0, 1, 0],
    //     [-sin(x), 0, cos(x)]
    // ];
    // Вращение по оси Y — ок отедльно
    // camera_rotation = [
    //   [1, 0, 0],
    //   [0, cos(y), -sin(y)],
    //   [0, sin(y), cos(y)]
    // ];

    // x y — искажения вверх вниз, но термимо
    camera_rotation = [
      [cos(x), 0, sin(x)],
      [0, cos(y), -sin(y)],
      [-sin(x), sin(y), cos(x) * cos(y)]
    ];
  }
}