const canvas = document.getElementById('canvasArea');
const ctx = canvas.getContext('2d');
let uploadedImage = null;
let textContent = '';
let currentShape = 'square';
let flip = false;
let mirror = false;
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Print canvas
function printCanvas() {
  window.print();
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
    for (let col = 0; col < 5; col++) {
      const x = col * (length + distance);
      const y = row * (width + distance);

      ctx.save();
      ctx.translate(x + length / 2, y + width / 2);
      if (flip) ctx.scale(1, -1);
      if (mirror) ctx.scale(-1, 1);

      // Draw red outline for shape
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;

      if (currentShape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, Math.min(length, width) / 2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.clip();
      } else {
        ctx.beginPath();
        ctx.rect(-length / 2, -width / 2, length, width);
        ctx.stroke();
        ctx.clip();
      }

      // Draw image or text
      if (uploadedImage) {
        ctx.drawImage(uploadedImage, -length / 2, -width / 2, length, width);
      } else if (textContent) {
        ctx.font = `${textSize}px ${fontSelect}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "
