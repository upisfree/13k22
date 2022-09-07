function printText(text, fontSize, color, x, y) {
  // canvas_context.font = 'small-caps bold italic ' + fontSize + 'px sans-serif';
  canvas_context.font = 'italic ' + fontSize + 'px sans-serif';
  canvas_context.fillStyle = color;
  canvas_context.fillText(text, x, y);
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

// сделать тупо стрелялку? с пулями? и пусть нпс перестреливаются друг с другомсде

function renderUI() {
  printText('привет hello 123', 10, '#000', 13 + 1, 15 + 1);
  printText('привет hello 123', 10, '#fff', 13, 15);

  // printBackgroundedText('привет hello 123', 10, '#fff', 'rgba(0, 0, 0, 0.9)', 13, 15, 50, 50)
}