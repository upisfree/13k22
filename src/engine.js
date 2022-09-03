// REFACTOR THIS AND REMOVE UNNECCEARY

// ======================================================================
//  Low-level canvas access.
// ======================================================================

function getBackgroundColor() {
  let c = Math.random() * 1; // set opacity?

  // star
  if (Math.random() > .99998) {
    c = 150;
  }

  return [c, c, c];
}




var canvas = document.getElementById("canvas");
var canvas_context = canvas.getContext("2d");
var canvas_buffer = canvas_context.getImageData(0, 0, canvas.width, canvas.height);
var canvas_pitch = canvas_buffer.width * 4;


// The PutPixel() function.
var PutPixel = function(x, y, color) {
  x = canvas.width/2 + x;
  y = canvas.height/2 - y - 1;

  if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) {
    return;
  }

  var offset = 4*x + canvas_pitch*y;
  canvas_buffer.data[offset++] = color[0];
  canvas_buffer.data[offset++] = color[1];
  canvas_buffer.data[offset++] = color[2];
  canvas_buffer.data[offset++] = 255; // Alpha = 255 (full opacity)
}


// Displays the contents of the offscreen buffer into the canvas.
var UpdateCanvas = function() {
  canvas_context.putImageData(canvas_buffer, 0, 0);
}




// ======================================================================
//  A raytracer with diffuse and specular illumination, shadows and reflections,
// arbitrary camera position and orientation.
// ======================================================================

// Converts 2D canvas coordinates to 3D viewport coordinates.
var CanvasToViewport = function(p2d) {
  return [p2d[0] * viewport_size / canvas.width,
      p2d[1] * viewport_size / canvas.height,
      projection_plane_z];
}

var IntersectRayBox = function(origin, direction, box) {
  let tmin, tmax, tymin, tymax, tzmin, tzmax;
  let bounds = box.bounds;

  let rayInvDir = InvertDirection(direction);
  let sign = [
    +(rayInvDir[0] < 0),
    +(rayInvDir[1] < 0),
    +(rayInvDir[2] < 0)
  ];

  tmin = (bounds[sign[0]][0] - origin[0]) * rayInvDir[0];
  tmax = (bounds[1 - sign[0]][0] - origin[0]) * rayInvDir[0];
  tymin = (bounds[sign[1]][1] - origin[1]) * rayInvDir[1];
  tymax = (bounds[1 - sign[1]][1] - origin[1]) * rayInvDir[1];

  if ((tmin > tymax) || (tymin > tmax)) {
    return;
  }

  if (tymin > tmin) {
    tmin = tymin;
  }

  if (tymax < tmax) {
    tmax = tymax;
  }

  tzmin = (bounds[sign[2]][2] - origin[2]) * rayInvDir[2];
  tzmax = (bounds[1 - sign[2]][2] - origin[2]) * rayInvDir[2];

  if ((tmin > tzmax) || (tzmin > tmax)) {
    return;
  }

  if (tzmin > tmin) {
    tmin = tzmin;
  }

  if (tzmax < tmax) {
    tmax = tzmax;
  }

  if (tmin > tmax) {
    return Infinity;
  }

  if (tmin < 0) {
    return tmax;
  }

  return tmin;
}

var ComputeLighting = function(point, normal, view, specular) {
  var intensity = 0;
  var length_n = Length(normal);  // Should be 1.0, but just in case...
  var length_v = Length(view);

  for (var i = 0; i < lights.length; i++) {
    var light = lights[i];
    if (light.ltype == Light.AMBIENT) {
      intensity += light.intensity;
    } else {
      var vec_l, t_max;
      if (light.ltype == Light.POINT) {
    vec_l = Subtract(light.position, point);
    t_max = 1.0;
      } else {  // Light.DIRECTIONAL
    vec_l = light.position;
    t_max = Infinity;
      }

      // Shadow check.
      var blocker = ClosestIntersection(point, vec_l, EPSILON, t_max);
      if (blocker) {
    continue;
      }

      // Diffuse reflection.
      var n_dot_l = DotProduct(normal, vec_l);
      if (n_dot_l > 0) {
    intensity += light.intensity * n_dot_l / (length_n * Length(vec_l));
      }

      // Specular reflection.
      if (specular != -1) {
    var vec_r = ReflectRay(vec_l, normal);
    var r_dot_v = DotProduct(vec_r, view);
    if (r_dot_v > 0) {
      intensity += light.intensity * Math.pow(r_dot_v / (Length(vec_r) * length_v), specular);
    }
      }
    }
  }

  return intensity;
}


// Find the closest intersection between a ray and the spheres in the scene.
var ClosestIntersection = function(origin, direction, min_t, max_t) {
  var closest_t = Infinity;
  var closest_object = null;

  for (var i = 0; i < boxes.length; i++) {
    var ts = IntersectRayBox(origin, direction, boxes[i]);
    
    if (ts < closest_t && min_t < ts && ts < max_t) {
      closest_t = ts;
      closest_object = boxes[i];
    }
  }


  if (closest_object) {
    return [closest_object, closest_t];
  }

  return null;
}

var NormalBox = function(point, box) {
  let pc = Subtract(point, box.center);

  let normal = [
    sign(pc[0]) * step(abs(abs(pc[0]) - box.normalSize[0]), EPS),
    sign(pc[1]) * step(abs(abs(pc[1]) - box.normalSize[1]), EPS),
    sign(pc[2]) * step(abs(abs(pc[2]) - box.normalSize[2]), EPS)
  ];

  return MultiplySV(1.0 / Length(normal), normal);
}

// box version
var GetColorFromMap = function(box, point, normal) {
  let { data, width, height } = box.map; // ImageData

  let size = box.mapSize;

  // uv
  let u = (box.max[0] - point[0]) / size[0];

  // другая сторона куба
  if (normal[0] !== 0) {
    u = (box.max[2] - point[2]) / size[2];
  }

  let v = (box.max[1] - point[1]) / size[1];

  // низ куба
  if (normal[1] !== 0) {
    v = (box.max[2] - point[2]) / size[2];
  }

  // xy in texture space
  let x = round((u) * width);
  let y = round((v) * height);

  let i = (y * (width * 4)) + (x * 4);

  let color = [
    data[i],
    data[i + 1],
    data[i + 2]
  ];

  return color;
}

// Traces a ray against the set of spheres in the scene.
var TraceRay = function(origin, direction, min_t, max_t, depth) {
  var intersection = ClosestIntersection(origin, direction, min_t, max_t);
  
  if (!intersection) {
    return getBackgroundColor();
  }

  var closest_object = intersection[0];
  var closest_t = intersection[1];

  var point = Add(origin, MultiplySV(closest_t, direction));

  var normal;
  if (closest_object instanceof Box) {
    normal = NormalBox(point, closest_object);
  }

  var view = MultiplySV(-1, direction);
  var lighting = ComputeLighting(point, normal, view, closest_object.specular);
  var local_color;
  
  if (closest_object instanceof Box && closest_object.map) {
    let color = GetColorFromMap(closest_object, point, normal);
    color = Add(color, closest_object.color);
    local_color = MultiplySV(lighting, color);
  } else {
    local_color = MultiplySV(lighting, closest_object.color);
  }

  if (closest_object.reflective <= 0 || depth <= 0) {
    return local_color;
  }

  var reflected_ray = ReflectRay(view, normal);
  var reflected_color = TraceRay(point, reflected_ray, EPSILON, Infinity, depth - 1);

  return Add(MultiplySV(1 - closest_object.reflective, local_color),
         MultiplySV(closest_object.reflective, reflected_color));
}