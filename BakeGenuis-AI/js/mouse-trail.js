/*console.log("Mouse trail script loaded ✅");

const canvas = document.createElement("canvas");
canvas.id = "trailCanvas";
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");
let points = [];

// Config
const color = "rgba(0, 150, 255, 0.6)";
const trailLength = 15;
const maxRadius = 12;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

document.addEventListener("mousemove", (e) => {
  points.push({ x: e.clientX, y: e.clientY });
  if (points.length > trailLength) {
    points.shift();
  }
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    ctx.beginPath();
    ctx.arc(p.x, p.y, (i / trailLength) * maxRadius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }
  requestAnimationFrame(animate);
}
animate();

// Style
canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.pointerEvents = "none";
canvas.style.zIndex = "9999";*/
