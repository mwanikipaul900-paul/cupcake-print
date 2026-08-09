const canvas = document.getElementById('canvasArea');
const ctx = canvas.getContext('2d');
let uploadedImage = null;
let textContent = '';
let currentShape = 'square';
let flip = false;
let mirror = false;
let customFont = null;
let textSize = 20;

// Convert cm to pixels (approx 37.8 px per cm at 96 DPI)
function cmToPx(cm) {
  return cm * 37.8;
}

// Preview uploaded image
function previewImage(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    uploadedImage = new Image();
    uploadedImage.onload = drawSegments;
    uploadedImage.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Upload custom font
function uploadFont(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const font = new FontFace("CustomFont", e.target.result);
      font.load().then(function(loadedFont) {
        document.fonts.add(loadedFont);
        customFont = "CustomFont";
        drawSegments();
      });
    };
    reader.readAsArrayBuffer(file);
  }
}

// Update text size from slider
function updateTextSize() {
  textSize = document.getElementById('textSizeSlider').value;
  document.getElementById('textSizeValue').innerText = textSize;
  drawSegments();
}

// Toggle shape
function toggleShape(shape) {
  currentShape = shape;
  drawSegments();
}

// Toggle effects
function toggleEffect(effect) {
  if (effect === 'flip') flip = !flip;
  if (effect === 'mirror') mirror = !mirror;
  drawSegments();
}

// Reset canvas
function resetCanvas() {
  uploadedImage = null;
  textContent = '';
  flip = false;
  mirror = false;
  customFont = null;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Print canvas
function printCanvas() {
  const dataUrl = canvas.toDataURL();
  const windowPrint = window.open('', '_blank');
  windowPrint.document.write(`<img src="${dataUrl}" onload="window.print();window.close()">`);
}

// Draw 35 segments (5x7 grid)
function drawSegments() {
  const length = cmToPx(parseFloat(document.getElementById('lengthInput').value));
  const width = cmToPx(parseFloat(document.getElementById('widthInput').value));
  const distance = cmToPx(parseFloat(document.getElementById('distanceInput').value));
  textContent = document.getElementById('textInput').value;
  const fontSelect = document.getElementById('fontSelect').value;

  canvas.width = length * 5 + distance * 4;
  canvas.height = width * 7 + distance * 6;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 5
