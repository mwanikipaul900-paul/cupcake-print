const canvas = document.getElementById('canvasArea');
const ctx = canvas.getContext('2d');
let uploadedImage = null;
let textContent = '';
let currentShape = 'square';
let flip = false;
let mirror = false;

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
  const dataUrl = canvas.toDataURL();
  const windowPrint = window.open('', '_blank');
  windowPrint.document.write(`<img src="${dataUrl}" onload="window.print();window.close()">`);
}

// Draw 36 segments (6x6 grid)
function drawSegments() {
  const length = parseFloat(document.getElementById('lengthInput').value);
  const width = parseFloat(document.getElementById('widthInput').value);
  const distance = parseFloat(document.getElementById('distanceInput').value);
  textContent = document.getElementById('textInput').value;

  canvas.width = length * 6 + distance * 5;
  canvas.height = width * 6 + distance * 5;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      const x = col * (length + distance);
      const y = row * (width + distance);

      ctx.save();
      ctx.translate(x + length / 2, y + width / 2);
      if (flip) ctx.scale(1, -1);
      if (mirror) ctx.scale(-1, 1);

      if (uploadedImage) {
        if (currentShape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, Math.min(length, width) / 2, 0, Math.PI * 2);
          ctx.clip();
        }
        ctx.drawImage(uploadedImage, -length / 2, -width / 2, length, width);
      } else if (textContent) {
        ctx.font = `${Math.min(length, width) / 4}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        if (currentShape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, Math.min(length, width) / 2, 0, Math.PI * 2);
          ctx.clip();
        }
        ctx.fillText(textContent, 0, 0, length);
      }

      ctx.restore();
    }
  }
}
