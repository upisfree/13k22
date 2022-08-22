let PI = Math.PI;
let UP = { x: 0, y: -1, z: 0 }; // У МЕНЯ ПОЧЕМУ-ТО ПЕРЕВЁРНУТЫЙ ВВЕРХ
let ZERO = { x: 0, y: 0, z: 0 };
let BACKGROUND = { x: 255, y: 255, z: 255 };

// автоматически это циклом сделать
let sin = Math.sin;
let cos = Math.cos;
let tan = Math.tan;
let sqrt = Math.sqrt;
let min = Math.min;
let max = Math.max;

// screen bounds
let w = 200;
let h = 200;

let canvas = document.querySelector('#canvas');
let gl = canvas.getContext('2d');
let buffer = gl.createImageData(w, h);

// camera
let camPos = {
  x: 0,
  y: 5,
  z: -13
};

let camPoint = {
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
      y: 3.5,
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
      y: 2,
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
      y: 3,
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
];












resize(w, h);
// render();
loop();





var planet1 = 0,
  planet2 = 0;




function loop() {
  requestAnimationFrame(loop);

  planet1 += 0.1 / 5;
  planet2 += 0.2 / 5;

  objects[1].point.x = Math.sin(planet1) * 3.5;
  objects[1].point.z = -3 + Math.cos(planet1) * 3.5;

  objects[2].point.x = Math.sin(planet2) * 4;
  objects[2].point.z = -3 + Math.cos(planet2) * 4;

  render();
}



// rendering
function pixel(x, y, r, g, b) {
  let i = (y * w + x) * 4;

  buffer.data[i] = r;
  buffer.data[i + 1] = g;
  buffer.data[i + 2] = b;
  buffer.data[i + 3] = 255;
}

function render() {
  let eyeVector = unitVector(
    subtract(camPos, camPoint)
  );
  let vpRight = unitVector(crossProduct(eyeVector, UP));
  let vpUp = unitVector(crossProduct(vpRight, eyeVector));

  let fovRadians = (PI * (fov / 2)) / 180;
  let heightWidthRatio = h / w;
  let halfWidth = tan(fovRadians);
  let halfHeight = heightWidthRatio * halfWidth;
  let cameraWidth = halfWidth * 2;
  let cameraHeight = halfHeight * 2;
  let pixelWidth = cameraWidth / (w - 1);
  let pixelHeight = cameraHeight / (h - 1);

  let color;
  let ray = {
    point: camPos
  };

  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      let xcomp = scale(vpRight, x * pixelWidth - halfWidth);
      let ycomp = scale(vpUp, y * pixelHeight - halfHeight);

      ray.vector = unitVector(add3(eyeVector, xcomp, ycomp));

      color = trace(ray, 0);

      pixel(
        x,
        y,
        color.x,
        color.y,
        color.z
      );
    }
  }

  gl.putImageData(buffer, 0, 0);
}



function trace(ray, depth) {
  if (depth > 3) {
    return;
  }

  let distObject = intersectScene(ray);

  if (distObject[0] === Infinity) {
    return BACKGROUND;
  }

  var dist = distObject[0],
    object = distObject[1];
  
  var pointAtTime = add(ray.point, scale(ray.vector, dist));

  return surface(
    ray,
    object,
    pointAtTime,
    sphereNormal(object, pointAtTime),
    depth
  );
}

function intersectScene(ray) {
  let closest = [Infinity, null];

  for (let i = 0; i < objects.length; i++) {
    let object = objects[i];
    let dist = sphereIntersection(object, ray);
    
    if (dist !== undefined && dist < closest[0]) {
      closest = [dist, object];
    }
  }

  return closest;
}

function sphereIntersection(sphere, ray) {
  let eye_to_center = subtract(sphere.point, ray.point);
  let v = dotProduct(eye_to_center, ray.vector);
  let eoDot = dotProduct(eye_to_center, eye_to_center);
  let discriminant = sphere.radius * sphere.radius - eoDot + v * v;

  if (discriminant < 0) {
    return;
  } else {
    return v - sqrt(discriminant);
  }
}

function sphereNormal(sphere, pos) {
  return unitVector(subtract(pos, sphere.point));
}

function surface(ray, object, pointAtTime, normal, depth) {
  let b = object.color;
  let c = ZERO;
  let lambertAmount = 0;

  if (object.lambert) {
    for (let i = 0; i < lights.length; i++) {
      let lightPoint = lights[i];

      if (!isLightVisible(pointAtTime, lightPoint)) {
        continue;
      }

      let contribution = dotProduct(
        unitVector(subtract(lightPoint, pointAtTime)),
        normal
      );

      if (contribution > 0) {
        lambertAmount += contribution;
      }
    }
  }

  if (object.specular) {
    let reflectedRay = {
      point: pointAtTime,
      vector: reflectThrough(ray.vector, normal),
    };
    
    let reflectedColor = trace(reflectedRay, ++depth);
    
    if (reflectedColor) {
      c = add(c, scale(reflectedColor, object.specular));
    }
  }

  lambertAmount = Math.min(1, lambertAmount);

  return add3(
    c,
    scale(b, lambertAmount * object.lambert),
    scale(b, object.ambient)
  );
}

function isLightVisible(pt, light) {
  let distObject = intersectScene(
    {
      point: pt,
      vector: unitVector(subtract(pt, light)),
    },
  );

  return distObject[0] > -0.005;
}

// это вообще нужно?
function clear() {
  gl.clearRect(0, 0, w, h);
}










// platform
function resize(width, height) {
  canvas.width = width;
  canvas.height = height;

  // считать тут aspect ratio
  // camera resize here?
}















// math
function dotProduct(a, b) {
  return (a.x * b.x) + (a.y * b.y) + (a.z * b.z);
}

function crossProduct(a, b) {
  return {
    x: (a.y * b.z) - (a.z * b.y),
    y: (a.z * b.x) - (a.x * b.z),
    z: (a.x * b.y) - (a.y * b.x)
  };
}

function length(a) {
  return Math.sqrt(dotProduct(a, a));
}

function scale(a, t) {
  return {
    x: a.x * t,
    y: a.y * t,
    z: a.z * t
  };
}

function unitVector(a) {
  return scale(a, 1 / length(a));
}

function add(a, b) {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
    z: a.z + b.z
  };
}

function subtract(a, b) {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
    z: a.z - b.z
  };
}

function add3(a, b, c) {
  return {
    x: a.x + b.x + c.x,
    y: a.y + b.y + c.y,
    z: a.z + b.z + c.z
  };
}

function reflectThrough(a, normal) {
  var d = scale(normal, dotProduct(a, normal));
  return subtract(scale(d, 2), a);
}