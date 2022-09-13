function printText(text, fontSize, color, x, y, italic = true) {
  canvas_context.font = ((italic) ? 'italic ' : '') + fontSize + 'px sans-serif';
  canvas_context.fillStyle = color;
  canvas_context.fillText(text, x, y);
}

function printShadowedText(text, fontSize, x, y, italic = true) {
  printText(text, fontSize, '#000', x + 1, y + 1, italic);
  printText(text, fontSize, '#fff', x, y, italic);
}

function printBackgroundedText(text, fontSize, textColor, backgroundColor, x, y, w, h) {
  // canvas_context.font = 'small-caps bold italic ' + fontSize + 'px sans-serif';
  canvas_context.font = 'italic ' + fontSize + 'px sans-serif';
  canvas_context.fillStyle = backgroundColor;
  canvas_context.fillRect(x - fontSize / 4, y - fontSize + 2, text.length * fontSize / 2 + 2, fontSize);
  // canvas_context.fillRect(x, y, w, h);
  canvas_context.fillStyle = textColor;
  canvas_context.fillText(text, x, y);
}

function renderUI() {
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
}
