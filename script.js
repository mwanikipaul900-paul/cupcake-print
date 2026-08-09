// Show uploaded image
function previewImage(event) {
  const img = document.getElementById('uploadedImage');
  img.src = URL.createObjectURL(event.target.files[0]);
}

// Shape toggle
function toggleShape(shape) {
  const img = document.getElementById('uploadedImage');
  img.classList.remove('square','rectangle','circle');
  img.classList.add(shape);
}

// Effect toggle (independent)
function toggleEffect(effect) {
  const img = document.getElementById('uploadedImage');
  img.classList.toggle(effect);
}

// Reset image to normal
function resetImage() {
  const img = document.getElementById('uploadedImage');
  img.classList.remove('square','rectangle','circle','flip','mirror');
  img.style.transform = 'none';
}
