// rendering
function pixel(x, y, r, g, b) {
  let i = (y * sw + x) * 4;

  buffer.data[i] = r;
  buffer.data[i + 1] = g;
  buffer.data[i + 2] = b;
  buffer.data[i + 3] = 255;
}

function render() {
  let eyeVector = unitVector(
    subtract(camPosition, camTarget)
  );

  // eyeVector.z = -1;

  // let eyeVector = unitVector(
  //   -sin(camRotation.x) * cos (camRotation.y),
  //   -sin(camRotation.x) * sin (camRotation.y),
  //   cos(camRotation.x)
  // );

  let vpRight = unitVector(crossProduct(eyeVector, UP));
  let vpUp = unitVector(crossProduct(vpRight, eyeVector));

  let fovRadians = (PI * (fov / 2)) / 180;
  let heightWidthRatio = sh / sw;
  let halfWidth = tan(fovRadians);
  let halfHeight = heightWidthRatio * halfWidth;
  let cameraWidth = halfWidth * 2;
  let cameraHeight = halfHeight * 2;
  let pixelWidth = cameraWidth / (sw - 1);
  let pixelHeight = cameraHeight / (sh - 1);

  let color;
  let ray = {
    point: camTarget
  };

  for (let x = 0; x < sw; x++) {
    for (let y = 0; y < sh; y++) {
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

  let dist = distObject[0];
  let object = distObject[1];

  let pointAtTime = add(ray.point, scale(ray.vector, dist));
  let normal;

  if (object.type === 'sphere') {
    normal = sphereNormal(object, pointAtTime);
  } else if (object.type === 'box') {
    normal = boxNormal(object, pointAtTime);
  }

  return surface(
    ray,
    object,
    pointAtTime,
    normal,
    depth
  );
}

function intersectScene(ray) {
  let closest = [Infinity, null];

  for (let i = 0; i < objects.length; i++) {
    let object = objects[i];
    let dist;

    if (object.type === 'sphere') {
      dist = sphereIntersection(object, ray);
      // console.log('sphere', dist);
    } else if (object.type === 'box') {
      dist = boxIntersection(object, ray);
      // console.log('box', dist);
    }

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

// ray.point — position
// ray.vector — direction
function boxIntersection(box, ray) {
  let tmin, tmax, tymin, tymax, tzmin, tzmax;
  let bounds = box.bounds;

  let rayInvDir = invDir(ray.vector);
  let sign = {
    x: +(rayInvDir.x < 0),
    y: +(rayInvDir.y < 0),
    z: +(rayInvDir.z < 0)
  };

  tmin = (bounds[sign.x].x - ray.point.x) * rayInvDir.x;
  tmax = (bounds[1 - sign.x].x - ray.point.x) * rayInvDir.x;
  tymin = (bounds[sign.y].y - ray.point.y) * rayInvDir.y;
  tymax = (bounds[1 - sign.y].y - ray.point.y) * rayInvDir.y;

  if ((tmin > tymax) || (tymin > tmax)) {
    return;
  }

  if (tymin > tmin) {
    tmin = tymin;
  }

  if (tymax < tmax) {
    tmax = tymax;
  }

  tzmin = (bounds[sign.z].z - ray.point.z) * rayInvDir.z;
  tzmax = (bounds[1 - sign.z].z - ray.point.z) * rayInvDir.z;

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

function sphereNormal(sphere, pos) {
  return unitVector(subtract(pos, sphere.point));
}

function boxNormal(box, pos) {
  let center = scale(add(box.bounds[1], box.bounds[0]), 0.5);
  let size = scale(subtract(box.bounds[1], box.bounds[0]), 0.5);
  let pc = subtract(pos, center);

  let normal = {
    x: sign(pc.x) * step(abs(abs(pc.x) - size.x), EPS),
    y: sign(pc.y) * step(abs(abs(pc.y) - size.y), EPS),
    z: sign(pc.z) * step(abs(abs(pc.z) - size.z), EPS)
  };

  return unitVector(normal);
}

// тоже самое делает, просто понятнее
// function boxNormal(box, pos) {
//   let bounds = box.bounds;
//
//   if(abs(pos.x - bounds[0].x) < EPS)
//     return { x: -1, y: 0, z: 0 }
//   else if(abs(pos.x - bounds[1].x) < EPS)
//     return { x: 1, y: 0, z: 0 };
//   else if(abs(pos.y - bounds[0].y) < EPS)
//     return { x: 0, y: -1, z: 0 };
//   else if(abs(pos.y - bounds[1].y) < EPS)
//     return { x: 0, y: 1, z: 0 };
//   else if(abs(pos.z - bounds[0].z) < EPS)
//     return { x: 0, y: 0, z: -1 };
//   else if(abs(pos.z - bounds[1].z) < EPS)
//     return { x: 0, y: 0, z: 1 };
// }

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
  gl.clearRect(0, 0, sw, sh);
}
