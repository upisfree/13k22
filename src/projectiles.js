let projectiles = [];
let projSpeed = 0.5;

function newProjectile(pos, dir, author) {
  let p = {
    pos: Add(pos, [0,0,0]), // clone camera pos
    dir: dir,
    box: new Box([0, 0, 0], [0.1, 0.1, 0.1], [255, 0, 0], 500, 0),
    author
  };

  projectiles.push(p);
  boxes.push(p.box);
}

function updateProjectiles() {
  // player
  // if (isMousePressed) {
  //   newProjectile();
  // }

  projectiles.forEach(updateProj);
}

function updateProj(p) {
  let movement =
    MultiplySV(
      projSpeed,
      p.dir
    );

  p.pos = Add(p.pos, movement);
  p.pos[1] = -0.1;
  p.box.moveProj(p.pos);

  let targets = [playerBox, ...npcs, ...walls];

  targets.some((target, index) => {
    if (index === 0) {
      // player
      if (isCollision(target, p.box) && p.author !== 'player') { // нет самострелу
//////////////////////////////////show red screen something/////////
        playerHealth -= npcProjDamage;

        console.log('player health', playerHealth);

        removeProj(p, true);

        if (playerHealth <= 0) {
          death();
        }
      }
    } else {
      // wall
      if (!target.box && isCollision(target, p.box) && target.isWall) {
        removeProj(p, true);

        return;
      }

      // npc
      if (target.box && isCollision(target.box, p.box) && p.author !== target) { // нет самострелу
        target.health -= playerDamage;

        console.log('npc health', target.health);

        if (target.health <= 0) {
          removeNPC(target, true);

          if (p.author === 'player') {
            playerHealth += playerHeal;
            score++;
          }
        }

        removeProj(p, true);
      }
    }
  });

  removeProj(p);
}

function removeProj(p, force = false) {
  if (force || p.pos[0] > 30 || p.pos[0] < -30 || p.pos[2] > 30 || p.pos[2] < -30) {
    projectiles = projectiles.filter(pr => pr !== p);
    boxes = boxes.filter(pr => pr !== p.box);
  }
}
