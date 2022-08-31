//
// Main loop.
//
function render() {
  for (var x = -canvas.width/2; x < canvas.width/2; x++) {
    for (var y = -canvas.height/2; y < canvas.height/2; y++) {
      var direction = CanvasToViewport([x, y])
      direction = MultiplyMV(camera_rotation, direction);
      var color = TraceRay(camera_position, direction, 1, Infinity, recursion_depth);
      PutPixel(x, y, Clamp(color));
    }
  }

  UpdateCanvas();
}

function loop() {
  requestAnimationFrame(loop);

  updateKeyboard();

  render();
}

loop();
