const canvas = document.getElementById('canvasArea');
const ctx = canvas.getContext('2d');
let uploadedImage = null;
let textContent = '';
let currentShape = 'rectangle';
let flip = false;
let mirror = false;
let customFont = null;
let textSize = 20;

// Convert cm to pixels (approx 37.8 px per cm at 96 DPI)
function cmToPx(cm) {
  return cm * 37.8;
}

// Draw sketches under shape buttons
function drawSketches() {
  const rect = document.getElementById('rectSketch').getContext('2d');
  rect.strokeRect(5, 5, 50, 30);

  const square = document.getElementById('squareSketch').getContext('2d');
  square.strokeRect(5, 5, 40, 40);

  const circle = document.getElementById('circleSketch').getContext('2d');
  circle.beginPath();
  circle.arc(30, 30, 25, 0, Math.PI * 2);
  circle.stroke();
}
drawSketches();

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

// Confirm text
function confirmText() {
  textContent = document.getElementById('textInput').value;
  drawSegments();
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
  document.querySelectorAll('.shapes button').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
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
