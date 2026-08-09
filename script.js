// Show custom message
function printMessage() {
  const msg = document.getElementById("userMessage").value;
  const element = document.getElementById("message");
  element.textContent = msg ? msg : "Please type a message!";
}

// Preview uploaded photo
function previewPhoto() {
  const fileInput = document.getElementById("photoUpload");
  const photoContainer = document.getElementById("photoContainer");
  photoContainer.innerHTML = ""; // clear previous
  if (fileInput.files && fileInput.files[0]) {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(fileInput.files[0]);
    photoContainer.appendChild(img);
  }
}

// Draw rectangle shape
function drawShape() {
  const width = document.getElementById("shapeWidth").value;
  const height = document.getElementById("shapeHeight").value;
  const shapeContainer = document.getElementById("shapeContainer");
  shapeContainer.innerHTML = ""; // clear previous
  const rect = document.createElement("div");
  rect.style.width = width + "px";
  rect.style.height = height + "px";
  shapeContainer.appendChild(rect);
}

// Flip/Mirror content
function flipContent() {
  document.body.style.transform =
    document.body.style.transform === "scaleX(-1)" ? "scaleX(1)" : "scaleX(-1)";
}
