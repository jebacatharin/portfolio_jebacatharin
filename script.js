const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const frameCount = 240;

// Your image naming pattern: ezgif-frame-001.jpg ... ezgif-frame-240.jpg
function currentFrame(index) {
  const frameNumber = String(index).padStart(3, "0");
  return `frames/ezgif-frame-${frameNumber}.jpg`;
}

const images = [];
const imageSeq = { frame: 1 };

// Set Canvas Size
function setCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
setCanvasSize();

// Preload images
let loadedImages = 0;
for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);

  img.onload = () => {
    loadedImages++;

    // When all frames loaded -> hide loader + start
    if (loadedImages === frameCount) {
      document.getElementById("loader").style.display = "none";
      render();
    }
  };

  images.push(img);
}

// Draw Image Properly (cover full screen)
function drawImageCover(img) {
  const canvasRatio = canvas.width / canvas.height;
  const imgRatio = img.width / img.height;

  let drawWidth, drawHeight, x, y;

  if (imgRatio > canvasRatio) {
    drawHeight = canvas.height;
    drawWidth = img.width * (canvas.height / img.height);
    x = (canvas.width - drawWidth) / 2;
    y = 0;
  } else {
    drawWidth = canvas.width;
    drawHeight = img.height * (canvas.width / img.width);
    x = 0;
    y = (canvas.height - drawHeight) / 2;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(img, x, y, drawWidth, drawHeight);
}

// Render current frame
function render() {
  const img = images[imageSeq.frame - 1];
  if (img) drawImageCover(img);
}

// Scroll animation
window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop;
  const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;

  const scrollFraction = scrollTop / maxScrollTop;

  const frameIndex = Math.min(
    frameCount,
    Math.ceil(scrollFraction * frameCount)
  );

  imageSeq.frame = frameIndex;
  requestAnimationFrame(render);
});

// Resize support
window.addEventListener("resize", () => {
  setCanvasSize();
  render();
});
