// A Sphere.
var Sphere = function(center, radius, color, specular, reflective) {
  this.center = center;
  this.radius = radius;
  this.color = color;
  this.specular = specular;
  this.reflective = reflective;
}

var Box = function(min, max, color, map, specular, reflective, onPickup) {
  this.min = min;
  this.max = max;

  this.bounds = [min, max];

  this.color = color; // ambient
  this.map = map;
  this.specular = specular;
  this.reflective = reflective;
  this.onPickup = onPickup;

  // если я соберусь обновлять bounds, min, max коробки, то надо обновить следующие свойства:
  // move() сделать надо тогда
  this.update();
}

Box.prototype.update = function() {
  this.bounds = [this.min, this.max];

  this.center = MultiplySV(0.5, Add(this.max, this.min));
  this.normalSize = MultiplySV(0.5, Subtract(this.max, this.min));
  this.mapSize = Subtract(this.max, this.min);
};

// только для игрока? запомниать первоначальные bounds коробки?
Box.prototype.movePlayer = function(pos) {
  this.min = Add(pos, [-0.4, 0, -0.4]); // clone
  this.min[1] = -0.9;
  this.max = Add(pos, [0.4, 1.1, 0.4]); 
  this.update();
};

// A Light.
var Light = function(ltype, intensity, position) {
  this.ltype = ltype;
  this.intensity = intensity;
  this.position = position;
}

Light.AMBIENT = 0;
Light.POINT = 1;
Light.DIRECTIONAL = 2;






function loadImage(url, callback) {
  let img = new Image();
  img.src = url;
  img.addEventListener('load', function() {
    callback(img);
  }, false);
}

function getRawTexture(texture) {
  let _canvas = document.createElement('canvas');

  // хром не грузит иначе в память всю текстуру
  _canvas.width = texture.width;
  _canvas.height = texture.height;

  let _context = _canvas.getContext('2d');
  let _buffer = _context.createImageData(texture.width, texture.height);

  _context.drawImage(texture, 0, 0);

  // document.body.appendChild(_canvas); // только для дебага

  return _context.getImageData(0, 0, texture.width, texture.height);
}

let textureBuffer;

loadImage('avatar.png',
// loadImage('uv-grid-opengl.jpg',
  (img) => {
    textureBuffer = getRawTexture(img);
    boxes[1].map = textureBuffer;
    playerBox.map = textureBuffer;

    console.log(textureBuffer);
  }
);





var spheres = [
  new Sphere([0, -1, 3], 1, [255, 255, 255], 500, 0.2),
  new Sphere([2, 0, 4], 1, [122, 122, 122], 500, 0.3),
  new Sphere([-2, 0, 4], 1, [64, 64, 64], 10, 0.4),
  // new Sphere([0, -5001, 0], 5000, [128, 128, 128], 1000, 0.5), // ground
  new Sphere([-1, 0, -10], 1, [255, 255, 0], 1000, 0.5),
];

let playerBox = new Box([0, -0.9, 0], [1, 1, 1], [0, 0, 0], textureBuffer, 500, 0);

var boxes = [
  new Box([-5000, -2, -5000], [5000, -1, 5000], [255, 255, 255], null, 1000, 0), // ground
  new Box([-2, -0.9, -2], [0, 1, 0], [255, 0, 0], textureBuffer, 500, 0.1),
  new Box([4, -0.9, 4], [6, 1, 6], [255, 255, 255], textureBuffer, 500, 1), // mirror
  playerBox,
  new Box([2, -0.5, 2], [2.25, -0.3, 2.25], [255, 0, 0], null, 500, 0, () => { console.log('on pickup action'); }), // item
];

var lights = [
  new Light(Light.AMBIENT, 0.2),
  new Light(Light.POINT, 0.6, [2, 1, 0]),
  new Light(Light.DIRECTIONAL, 0.2, [1, 4, 4])
];

// Scene setup.
var viewport_size = 1;
var projection_plane_z = 1;
var camera_position = [3, 0, 1];
var camera_rotation = [[0.7071, 0, -0.7071],
               [     0, 1,       0],
               [0.7071, 0,  0.7071]];

var recursion_depth = 3;