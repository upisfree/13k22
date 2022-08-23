
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
  gl.clearRect(0, 0, sw, sh);
}
