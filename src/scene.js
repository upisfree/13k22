var Box = function(min, max, color, map, specular, reflective, collider = true, onPickup = null) {
  this.min = min;
  this.max = max;

  this.bounds = [min, max];

  this.color = color; // ambient
  this.map = map;
  this.specular = specular;
  this.reflective = reflective;
  this.collider = collider;
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

  let col = [0.35, 0.35, 0.35];

  // collisionMin, collisionMax
  this.cmin = Subtract(this.min, col);
  this.cmax = Add(this.max, col);
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





/** @deprecated */
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
    // boxes[1].map = textureBuffer;
    playerBox.map = textureBuffer;

    console.log(textureBuffer);
  }
);