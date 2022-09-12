//
// Main loop.
//
function render() {
  for (var x = -canvas.width/2; x < canvas.width/2; x++) {
    for (var y = -canvas.height/2; y < canvas.height/2; y++) {
      if (random() < 0.5) {
        continue;
      }

      var direction = CanvasToViewport([x, y])
      direction = MultiplyMV(camera_rotation, direction);
      var color = TraceRay(camera_position, direction, minRenderDistance, maxRenderDistance, recursion_depth);
      PutPixel(x, y, Clamp(color));
    }
  }

  UpdateCanvas();

  renderUI();
}

function loop() {
  requestAnimationFrame(loop);

  updateKeyboard();

  updateProjectiles();
  updateNPCs();

  // а зачем много
  if (Date.now() % 2 === 0) {
    render();
  }
}

// если луч занимает слишком много, то просто отбрасывать его — это и будут артeфакты и ускорение вычислений

let playerBox = new Box([0, -0.9, 0], [1, 1, 1], [0, 0, 255], 500, 0, false);
let playerLight1 = new Light(Light.POINT, 0.6, [0, 0, 1.2]);
let playerLight2 = new Light(Light.POINT, 0.6, [0, 0, -1.2]);
let playerHealth = 1;
let playerDamage = 0.25;

var boxes = [
  new Box([-5000, -2, -5000], [5000, -1, 5000], [255, 255, 255], 1000, 0.1, false), // ground
  playerBox
  // new Box([0 + 1, -0.5, 2], [0.25 + 1, -0.3, 2.25], [255, 0, 0], 500, 0, false, () => { console.log('on pickup action'); }), // item
];

var walls = [];
let wallSize = 2;

var lights = [
  new Light(Light.AMBIENT, 0.2),
  playerLight1,
  // playerLight2,
  new Light(Light.DIRECTIONAL, 0.5, [-5, 10, -5])
];

// Scene setup.
var viewport_size = 1;
var projection_plane_z = 1;
var camera_position = [0, 0, 0];
var camera_rotation = [[1, 0, 0],
                       [0, 1, 0],
                       [0, 0, 1]];

var recursion_depth = 2;
var minRenderDistance = 1;
var maxRenderDistance = 50;

var fogColor = [220, 220, 220];

generateMap();

newNPC();
newNPC();

loop();

















