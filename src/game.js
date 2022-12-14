function render() {
  for (let x = -canvas.width/2; x < canvas.width/2; x++) {
    for (let y = -canvas.height/2; y < canvas.height/2; y++) {
      if (random() < 0.5) {
        continue;
      }

      let direction = CanvasToViewport([x, y])
      direction = MultiplyMV(camera_rotation, direction);
      let color = TraceRay(camera_position, direction, minRenderDistance, maxRenderDistance, recursion_depth);
      PutPixel(x, y, Clamp(color));
    }
  }

  UpdateCanvas();

  renderUI();
}

function loop() {
  requestAnimationFrame(loop);

  if (!isGameEnded) {
    updateKeyboard();
  }

  updateProjectiles();
  updateNPCs();

  // а зачем много
  if (Date.now() % 2 === 0) {
    render();
  }
}

function death() {
  isGameEnded = true;

  document.body.classList.add('ended');
}

function start() {
  isGameStarted = true;

  generateMap();

  newNPC();
  newNPC();

  startAudio();

  loop();

  setTimeout(() => {
    npcSpawnChance = 0.008;
  }, 60000);
}

let playerBox = new Box([0, -0.9, 0], [1, 1, 1], [0, 0, 0], 500, 0, false);
let playerLight1 = new Light(Light.POINT, 0.7, [0, 0, 1.2]);
let playerHealth = 1;
let playerHeal = 0.05; // gives you after kill
let playerDamage = 0.25;
let score = 0;
let isGameStarted = false;
let isGameEnded = false;

playerBox.map = getNPCTexture('👺');

let boxes = [
  new Box([-5000, -2, -5000], [5000, -1, 5000], wallColor, wallSpec, wallRefl, false), // ground
  playerBox
];

let walls = [];
let wallSize = 2;

let lights = [
  new Light(Light.AMBIENT, 0.2),
  playerLight1,
  new Light(Light.DIRECTIONAL, 0.5, [-5, 10, -5])
];

// Scene setup.
let viewport_size = 1;
let projection_plane_z = 1;
let camera_position = [0, 0, 0];
let camera_rotation = [[1, 0, 0],
                       [0, 1, 0],
                       [0, 0, 1]];

let recursion_depth = 2;
let minRenderDistance = 1;
let maxRenderDistance = 50;

let fogColor = [220, 220, 220];

renderStartUI();
