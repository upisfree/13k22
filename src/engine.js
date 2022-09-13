// REFACTOR THIS AND REMOVE UNNECCEARY

// ======================================================================
//  Low-level canvas access.
// ======================================================================

function getBackgroundColor() {
  // star
  if (random() > (isGameEnded ? 0.99 : 0.99998)) {
    return [0, 0, 0];
  }

  return fogColor;
}

let canvas = document.getElementById('canvas');
let gl = canvas.getContext('2d');
let canvasUI = document.getElementById('ui');
let glUI = canvasUI.getContext('2d');
let canvas_buffer = gl.getImageData(0, 0, canvas.width, canvas.height);
let canvas_pitch = canvas_buffer.width * 4;

function PutPixel(x, y, color) {
  x = canvas.width/2 + x;
  y = canvas.height/2 - y - 1;

  if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) {
    return;
  }

  let offset = 4 * x + canvas_pitch * y;
  canvas_buffer.data[offset++] = color[0];
  canvas_buffer.data[offset++] = color[1];
  canvas_buffer.data[offset++] = color[2];
  canvas_buffer.data[offset++] = 255; // Alpha = 255 (full opacity)
}

function UpdateCanvas() {
  gl.putImageData(canvas_buffer, 0, 0);
}

// ======================================================================
//  A raytracer with diffuse and specular illumination, shadows and reflections,
// arbitrary camera position and orientation.
// ======================================================================

// Converts 2D canvas coordinates to 3D viewport coordinates.
function CanvasToViewport(p2d) {
  return [p2d[0] * viewport_size / canvas.width,
      p2d[1] * viewport_size / canvas.height,
      projection_plane_z];
}

function IntersectRayBox(origin, direction, box) {
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

function ComputeLighting(point, normal, view, specular, isWall) {
  let intensity = 0;
  let length_n = Length(normal);  // Should be 1.0, but just in case...
  let length_v = Length(view);

  for (let i = 0; i < lights.length; i++) {
    let light = lights[i];

    if (light.ltype == Light.AMBIENT) {
      intensity += light.intensity;
    } else {
      let vec_l, t_max;

      if (light.ltype == Light.POINT) {
        vec_l = Subtract(light.position, point);
        t_max = 1.0;
      } else {  // Light.DIRECTIONAL
        vec_l = light.position;
        t_max = Infinity;
      }

      // Shadow check.
      if (!isWall) {
        let blocker = ClosestIntersection(point, vec_l, EPSILON, t_max);
        if (blocker) {
          continue;
        }
      }

      // Diffuse reflection.
      let n_dot_l = DotProduct(normal, vec_l);
      if (n_dot_l > 0) {
        intensity += light.intensity * n_dot_l / (length_n * Length(vec_l));
      }

      // Specular reflection.
      if (specular != -1) {
        let vec_r = ReflectRay(vec_l, normal);
        let r_dot_v = DotProduct(vec_r, view);
        if (r_dot_v > 0) {
          intensity += light.intensity * pow(r_dot_v / (Length(vec_r) * length_v), specular);
        }
      }
    }
  }

  return intensity;
}


// Find the closest intersection between a ray and the spheres in the scene.
function ClosestIntersection(origin, direction, min_t, max_t) {
  let closest_t = Infinity;
  let closest_object = null;

  for (let i = 0; i < boxes.length; i++) {
    let ts = IntersectRayBox(origin, direction, boxes[i]);

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

function NormalBox(point, box) {
  let pc = Subtract(point, box.center);

  let normal = [
    sign(pc[0]) * step(abs(abs(pc[0]) - box.normalSize[0]), EPS),
    sign(pc[1]) * step(abs(abs(pc[1]) - box.normalSize[1]), EPS),
    sign(pc[2]) * step(abs(abs(pc[2]) - box.normalSize[2]), EPS)
  ];

  return MultiplySV(1.0 / Length(normal), normal);
}

function GetColorFromMap(box, point, normal) {
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
function TraceRay(origin, direction, min_t, max_t, depth) {
  let intersection = ClosestIntersection(origin, direction, min_t, max_t);

  if (!intersection) {
    return getBackgroundColor();
  }

  let closest_object = intersection[0];
  let closest_t = intersection[1];

  let point = Add(origin, MultiplySV(closest_t, direction));

  let normal = NormalBox(point, closest_object);
  let isWall = walls.includes(closest_object);

  let view = MultiplySV(-1, direction);
  let lighting = ComputeLighting(point, normal, view, closest_object.specular, isWall);
  let local_color;

  if (closest_object.map) {
    let color = GetColorFromMap(closest_object, point, normal);
    color = Add(color, closest_object.color);
    local_color = MultiplySV(lighting, color);
  } else {
    local_color = MultiplySV(lighting, closest_object.color);
  }

  if (closest_object.reflective <= 0 || depth <= 0) {
    return local_color;
  }

  let reflected_ray = ReflectRay(view, normal);
  // EPS = 0.01
  // EPSILON? 0.001
  let reflected_color = TraceRay(point, reflected_ray, EPS, maxRenderDistance, depth - 1);

  let outColor = Add(
    MultiplySV(
      1 - closest_object.reflective,
      local_color
    ),
    MultiplySV(
      closest_object.reflective,
      reflected_color
    )
  );

  let fogCoef = closest_t / max_t;

  let fog = [
    fogColor[0] * fogCoef,
    fogColor[1] * fogCoef,
    fogColor[2] * fogCoef
  ];

  return Add(fog, outColor);
}
