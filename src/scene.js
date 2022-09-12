var Box = function(min, max, color, specular, reflective, collider = true, onPickup = null) {
  this.min = min;
  this.max = max;

  this.bounds = [min, max];

  this.color = color; // ambient
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
};

// только для игрока? запомниать первоначальные bounds коробки?
Box.prototype.movePlayer = function(pos) {
  this.min = Add(pos, [-0.4, 0, -0.4]); // clone
  this.min[1] = -0.9;
  this.max = Add(pos, [0.4, 1.1, 0.4]);
  this.update();
};

Box.prototype.moveProj = function(pos) {
  this.min = Add(pos, [0, 0, 0]);
  this.max = Add(pos, [0.1, 0.1, 0.3]);
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
