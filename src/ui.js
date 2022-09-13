function printText(text, fontSize, color, x, y, italic = true) {
  glUI.font = ((italic) ? 'italic ' : '') + fontSize + 'px sans-serif';
  glUI.fillStyle = color;
  glUI.fillText(text, x, y);
}

function printShadowedText(text, fontSize, x, y, italic = true) {
  printText(text, fontSize, '#000', x + 1, y + 1, italic);
  printText(text, fontSize, '#fff', x, y, italic);
}

function renderUI() {
  glUI.clearRect(0, 0, canvasUI.width, canvasUI.height);

  if (!isGameStarted && !isGameEnded) {
    renderStartUI();
  } else if (isGameStarted && !isGameEnded) {
    renderInGameUI();
  } else if (isGameStarted && isGameEnded) {
    renderEndUI();
  }
}

function renderStartUI() {
  printShadowedText('➰➰➰➰➰', 11, 15, 20, false);
  printShadowedText('☠️️', 16, 40, 20, false);

  printShadowedText('DEATH  DEATH  DEATH', 8, 5, 36);

  printText('KILL  EVERYBODY', 9, '#000', 10, 48, true);
  printText('YOU  LOVE', 9, '#000', 24, 56, true);

  printText('WASD & MOUSE', 9, '#000', 13, 67, true);
  printText('CLICK  TO  START', 9, '#000', 10, 75, true);

  printText('A GAME BY SENYA PUGACH', 7, '#000', 2, 96, true);
}

function renderInGameUI() {
  // health
  printShadowedText('❤️', 7, 4, 11, false);
  printShadowedText(
    `${round(playerHealth * 100)}` // .toString()
      .split('')
      .join((playerHealth !== 1) ? ' ' : ''), // custom for 100
    10,
    16,
    12,
    true
  );

  // kills
  printShadowedText('💀', 7, 4, 23, false);
  printShadowedText(
    getNumberWithSpaces(score),
    10,
    16,
    24,
    true
  );
}

function renderEndUI() {
  glUI.fillStyle = 'rgba(0, 0, 0, 0.5)';
  glUI.fillRect(0, 0, canvas.width, canvas.height);

  printShadowedText('➰➰➰➰➰', 11, 15, 20, false);
  printShadowedText('☠️️', 16, 40, 20, false);

  printShadowedText(getNumberWithSpaces(score) + ' DEATHS', 9, 5, 40);
  printShadowedText('ON YOUR HANDS', 9, 5, 50);
  printShadowedText('ARE YOU HAPPY?', 9, 5, 60);

  printShadowedText('REFRESH TO RESTART', 8, 4, 78, true);

  printText('A GAME BY SENYA PUGACH', 7, '#000', 2, 96, true);
}

function getNumberWithSpaces(num) {
  return `${num}` // .toString()
    .split('')
    .join(' ');
}
