let npcs = [];
let npcSpeed = 0.1;
let npcProjSpeed = 0.1;
let npcProjDamage = 0.05;
let npcFireRate = 0.003;
let npcSpawnChance = 0.005;
let npcDespawnTime = 60000;

function getPos() {
  let side = 10;
  let x = side * random();
  let z = side * random();
  x *= random() > 0.5 ? 1 : -1;
  z *= random() > 0.5 ? 1 : -1;

  return [x, 0, z];
}

function newNPC() {
  let n = {
    pos: getPos(),
    dir: 0,
    box: new Box([0, -0.9, 0], [1, 1, 1], [0, 255 * random(), 255 * random()], 500, 0, true, onNPCAndPlayerCollide),
    start: Date.now(),
    health: 1
  };

  npcs.push(n);
  boxes.push(n.box);
}

// не нужно?
function onNPCAndPlayerCollide() {
  console.log(this, arguments);
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
