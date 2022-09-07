//
// Main loop.
//
function render() {
  for (var x = -canvas.width/2; x < canvas.width/2; x++) {
    for (var y = -canvas.height/2; y < canvas.height/2; y++) {
      if (Math.random() > 0.5) {
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

  // а зачем много
  if (Date.now() % 2 === 0) {
    render();
  }
}

// если луч занимает слишком много, то просто отбрасывать его — это и будут артифакты и ускорение  вычислений

// назад ходить нельзя, там зеркало («время идёт только вперёд»)
// когда ходишь, у тебя прибавляются года
// в начале говорить про среднюю продолжительность жизни
// твоя жизнь с вероятностью будет где-то около 75 лет, потом смерть
// перед смертью говорить о какой-то твоей болезни (или что-то типа «ой, болит то-то...»)
//
// ты подбираешь события из жизни, они добавляют или отнимают от твоего отмеренного времени
// (свадьба дочери, поход в бар, поездка на море, смерть матери, что-то простое)
// 
// яркость постепенно гаснет (с почти белого начинается)
// ты сначала низкий, в 18 высокий, потом постепенно уменьшаешься
// ты несёшь перед собой свет, который тоже гаснет??
// ты видишь себя в зеркало, текстура меняется
// генерируется коридор

let playerBox = new Box([0, -0.9, 0], [1, 1, 1], [0, 0, 0], textureBuffer, 500, 0, false);
let playerLight = new Light(Light.POINT, 0.6, [0, 0, 1.2]);

var boxes = [
  new Box([-5000, -2, -5000], [5000, -1, 5000], [255, 255, 255], null, 1000, 0.1, false), // ground
  // new Box([-2, -0.9, -2], [0, 1, 0], [255, 0, 0], textureBuffer, 500, 0.1),
  // new Box([4, -0.9, 4], [6, 1, 6], [255, 255, 255], textureBuffer, 500, 1), // mirror
  playerBox,
  new Box([0, -0.5, 2], [0.25, -0.3, 2.25], [255, 0, 0], null, 500, 0, false, () => { console.log('on pickup action'); }), // item
];

var lights = [
  new Light(Light.AMBIENT, 0.2),
  playerLight,
  // new Light(Light.DIRECTIONAL, 0.2, [1, 4, 4])
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

loop();


function generateMap() {
  let depth = 100; 

  проверка, чтобы без теней стены?

  // левая стена
  for (var i = 0; i < depth / 2; i++) {
    boxes.push(
      new Box(
        [-4, -1, i * 2],
        [-2, 1, i * 2 + 2],
        [255 * Math.random(), 255 * Math.random(), 255 * Math.random()],
        null,
        2000 * Math.random(),
        Math.random()
      )
    );
  }

  // правая стена
  for (var i = 0; i < depth / 2; i++) {
    boxes.push(
      new Box(
        [2, -1, i * 2],
        [4, 1, i * 2 + 2],
        [255 * Math.random(), 255 * Math.random(), 255 * Math.random()],
        null,
        2000 * Math.random(),
        Math.random()
      )
    );
  }
}


generateMap();















