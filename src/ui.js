function printText(text, fontSize, color, x, y, italic = true) {
  gl.font = ((italic) ? 'italic ' : '') + fontSize + 'px sans-serif';
  gl.fillStyle = color;
  gl.fillText(text, x, y);
}

function printShadowedText(text, fontSize, x, y, italic = true) {
  printText(text, fontSize, '#000', x + 1, y + 1, italic);
  printText(text, fontSize, '#fff', x, y, italic);
}

function printBackgroundedText(text, fontSize, textColor, backgroundColor, x, y, w, h) {
  // gl.font = 'small-caps bold italic ' + fontSize + 'px sans-serif';
  gl.font = 'italic ' + fontSize + 'px sans-serif';
  gl.fillStyle = backgroundColor;
  gl.fillRect(x - fontSize / 4, y - fontSize + 2, text.length * fontSize / 2 + 2, fontSize);
  // gl.fillRect(x, y, w, h);
  gl.fillStyle = textColor;
  gl.fillText(text, x, y);
}

function renderUI() {
  // health
  printShadowedText('❤️', 7, 4, 11, false);
  printShadowedText(
    `${round(playerHealth * 100)}` // .toString()
      .split('')
      .join((playerHealth !== 1) ? ' ' : ''),
    10,
    16,
    12,
    true
  );

  // kills
  printShadowedText('💀', 7, 4, 23, false);
  printShadowedText(score,10,16,24,true);
}
