const canvas = document.getElementById('canvasArea');
const ctx = canvas.getContext('2d');
let uploadedImage = null;
let textContent = '';
let currentShape = 'rectangle';
let flip = false;
let mirror = false;
let customFont = null;
let textSize = 20;

// A4 dimensions in pixels (21 cm × 29.7 cm at 96 DPI ≈ 793 × 1122 px)
const A4_WIDTH = 793;
const A4_HEIGHT = 1122;

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
function toggleShape(ev, shape) {
  currentShape = shape;
  document.querySelectorAll('.shapes button').forEach(btn => btn.classList.remove('active'));
  ev.target.classList.add('active');
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
  const dataUrl = canvas.toDataURL("image/png");
  const win = window.open('', '_blank');
  win.document.write(`
    <html>
      <head><title>Print Chocolate Layout</title></head>
      <body style="margin:0">
        <img src="${dataUrl}" style="width:21cm;height:29.7cm;" />
      </body>
    </html>
  `);
  win.document.close();
  win.focus();
  win.print();
}

// Draw 35 segments (5x7 grid) on A4
function drawSegments() {
  const length = cmToPx(parseFloat(document.getElementById('lengthInput').value));
  const width = cmToPx(parseFloat(document.getElementById('widthInput').value));
  const distance = cmToPx(parseFloat(document.getElementById('distanceInput').value));
  const fontSelect = document.getElementById('fontSelect').value;

  // Fix canvas to A4 size
  canvas.width = A4_WIDTH;
  canvas.height = A4_HEIGHT;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 5; col++) {
      const x = col * (length + distance);
      const y = row * (width + distance);

      ctx.save();
      ctx.translate(x + length / 2, y + width / 2);
      if (flip) ctx.scale(1, -1);
      if (mirror) ctx.scale(-1, 1);

      // Red outline
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

      // Fill with photo or text
      if (uploadedImage) {
        ctx.drawImage(uploadedImage, -length / 2, -width / 2, length, width);
      } else if (textContent) {
        const fontFamily = customFont ? customFont : fontSelect;
        ctx.font = `${textSize}px ${fontFamily}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(textContent, 0, 0, length);
      }

      ctx.restore();
    }
  }
}
