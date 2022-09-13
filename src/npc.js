let npcs = [];
let npcSpeed = 0.11;
let npcProjSpeed = 0.1;
let npcProjDamage = 0.05;
let npcFireRate = 0.0035;
let npcSpawnChance = 0.006;
let npcDespawnTime = 60000;

// texture generation
let _npcCanvas = document.createElement('canvas');
// хром не грузит иначе в память всю текстуру
_npcCanvas.width = 35;
_npcCanvas.height = 100;
let _npcContext = _npcCanvas.getContext('2d');
let _npcTextureBuffer = _npcContext.createImageData(_npcCanvas.width, _npcCanvas.height);



function getPos() {
  let side = 10;
  let x = side * random();
  let z = side * random();
  x *= random() > 0.5 ? 1 : -1;
  z *= random() > 0.5 ? 1 : -1;

  return [x, 0, z];
}

const emojies = [
  '🧍🏻',
  '🧍🏼',
  '🧍🏽',
  '🕴🏻',
  '🕺🏻'
];

function getNPCTexture(text) {
  _npcContext.clearRect(0, 0, _npcCanvas.width, _npcCanvas.height);

  _npcContext.font = '120px sans-serif';
  _npcContext.fillStyle = '#ff0000';
  _npcContext.fillText(text, -42, 102);

  return _npcContext.getImageData(0, 0, _npcCanvas.width, _npcCanvas.height);
}

function newNPC() {
  let color = [0, 0, 0];

  let n = {
    pos: getPos(),
    dir: 0,
    box: new Box([0, -0.9, 0], [1, 1, 1], color, 500, 0, true, onNPCAndPlayerCollide),
    start: Date.now(),
    health: 1
  };

  n.box.map = getNPCTexture(emojies[Math.floor(random() * emojies.length)]);

  npcs.push(n);
  boxes.push(n.box);
}

// не нужно?
function onNPCAndPlayerCollide() {
}

function updateNPCs() {
  if (random() < npcSpawnChance) {
    newNPC();
  }

  npcs.forEach(updateNPC);
}

function updateNPC(npc) {
  // collision check
  walls.forEach(wall => {
    if (isCollision(wall, npc.box)) {
      npc.dir += PI / 4 * random();
    }
  });

  let movement = [
    cos(npc.dir) * npcSpeed,
    0,
    sin(npc.dir) * npcSpeed
  ];

  npc.pos = Add(npc.pos, movement);
  npc.box.movePlayer(npc.pos);

  if (random() < npcFireRate) {
    fireNPC(npc);
  }

  removeNPC(npc);
}

function removeNPC(n, force = false) {
  if (Date.now() - n.start > npcDespawnTime || force) {
    npcs = npcs.filter(npc => npc !== n);
    boxes = boxes.filter(npc => npc !== n.box);

    return;
  }
}

function fireNPC(npc) {
  let diff = MultiplySV(
    npcProjSpeed,
    Subtract(
      camera_position,
      npc.pos
    )
  );

  newProjectile(npc.pos, diff, npc);
}
