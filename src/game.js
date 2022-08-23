let PI = Math.PI;
let EPS = 0.01;
let UP = { x: 0, y: 1, z: 0 };
let ZERO = { x: 0, y: 0, z: 0 };
let BACKGROUND = { x: 255, y: 255, z: 255 };

// bloom?
// global illumination?
// https://github.com/bwiklund/js1k-love-raytracer

// автоматически это циклом сделать
let sin = Math.sin;
let cos = Math.cos;
let tan = Math.tan;
let sqrt = Math.sqrt;
let min = Math.min;
let max = Math.max;
let abs = Math.abs;
let sign = Math.sign;

// screen bounds
let sw = 200;
let sh = 200;

let canvas = document.querySelector('#canvas');
let gl = canvas.getContext('2d');
let buffer = gl.createImageData(sw, sh);

// controls
let playerSpeed = 0.1;
let mouseSpeed = 0.1;

// camera
let camPosition = {
  x: 0,
  y: 0,
  z: 0
};

let camRotation = {
  x: 0,
  y: 0,
  z: 0
};

let camTarget = {
  x: 0,
  y: 1.8,
  z: 10
};

let fov = 45;

// lights
let lights = [
  {
    x: -30,
    y: -10,
    z: 20
  },
];

// objects
let objects = [
  {
    type: "sphere",
    point: {
      x: 0,
      y: 0,
      z: -3,
    },
    color: {
      x: 155,
      y: 200,
      z: 155,
    },
    specular: 0.2,
    lambert: 0.7,
    ambient: 0.1,
    radius: 3,
  },
  {
    type: "sphere",
    point: {
      x: -4,
      y: -1,
      z: -1,
    },
    color: {
      x: 155,
      y: 155,
      z: 155,
    },
    specular: 0.1,
    lambert: 0.9,
    ambient: 0.0,
    radius: 0.2,
  },
  {
    type: "sphere",
    point: {
      x: -4,
      y: 0,
      z: -1,
    },
    color: {
      x: 255,
      y: 255,
      z: 255,
    },
    specular: 0.2,
    lambert: 0.7,
    ambient: 0.1,
    radius: 0.1,
  },
  {
    type: "box",
    bounds: [
      {
        x: -2.75 + 5,
        y: -1.75 - 2,
        z: -2,
      },
      {
        x: -1 + 5,
        y: 0 - 2,
        z: 1,
      }
    ],
    // min: {
    //   x: 0,
    //   y: 0,
    //   z: 0,
    // },
    // max: {
    //   x: 2,
    //   y: 4,
    //   z: 3,
    // },
    color: {
      x: 255,
      y: 0,
      z: 255,
    },
    specular: 1,
    lambert: 0.5,
    ambient: 0.2
  },
];

resize(sw, sh);
// render();
loop();


var planet1 = 0,
  planet2 = 0;

function loop() {
  requestAnimationFrame(loop);

  updateKeyboard();

  planet1 += 0.1 / 10;
  planet2 += 0.2 / 10;

  objects[1].point.x = Math.sin(planet1) * 3.5;
  objects[1].point.z = -3 + Math.cos(planet1) * 3.5;

  objects[2].point.x = Math.sin(planet2) * 4;
  objects[2].point.z = -3 + Math.cos(planet2) * 4;

  render();
}

// platform
function resize(width, height) {
  canvas.width = width;
  canvas.height = height;

  // считать тут aspect ratio
  // camera resize here?
}
