// Smooth Cursor Trail Effect
const trailCanvas = document.createElement('canvas');
trailCanvas.id = 'cursor-trail';
trailCanvas.style.position = 'fixed';
trailCanvas.style.top = '0';
trailCanvas.style.left = '0';
trailCanvas.style.pointerEvents = 'none';
trailCanvas.style.zIndex = '9999';
document.body.appendChild(trailCanvas);

const ctx = trailCanvas.getContext('2d');
trailCanvas.width = window.innerWidth;
trailCanvas.height = window.innerHeight;

let mouseX = 0;
let mouseY = 0;
const particles = [];

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 4 + 2;
    this.speedX = (Math.random() - 0.5) * 2;
    this.speedY = (Math.random() - 0.5) * 2;
    this.opacity = 1;
    this.life = 1;
    this.decay = Math.random() * 0.015 + 0.01;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= this.decay;
    this.opacity = this.life;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity * 0.8;
    ctx.fillStyle = `hsl(45, 100%, 50%)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // Create particles on mouse move
  if (Math.random() > 0.7) {
    particles.push(new Particle(mouseX, mouseY));
  }
});

function animate() {
  ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();

    if (particles[i].life <= 0) {
      particles.splice(i, 1);
    }
  }

  requestAnimationFrame(animate);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
  trailCanvas.width = window.innerWidth;
  trailCanvas.height = window.innerHeight;
});

// Custom Cursor
document.documentElement.style.cursor = 'none';

const customCursor = document.createElement('div');
customCursor.id = 'custom-cursor';
customCursor.style.position = 'fixed';
customCursor.style.width = '20px';
customCursor.style.height = '20px';
customCursor.style.border = '2px solid #ffcc00';
customCursor.style.borderRadius = '50%';
customCursor.style.pointerEvents = 'none';
customCursor.style.zIndex = '10000';
customCursor.style.transition = 'all 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
customCursor.style.boxShadow = '0 0 10px rgba(255, 204, 0, 0.6)';
customCursor.style.display = 'none';
document.body.appendChild(customCursor);

let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
  cursorX = e.clientX;
  cursorY = e.clientY;
  
  customCursor.style.left = (cursorX - 10) + 'px';
  customCursor.style.top = (cursorY - 10) + 'px';
  customCursor.style.display = 'block';
});

document.addEventListener('mouseleave', () => {
  customCursor.style.display = 'none';
});

document.addEventListener('mouseenter', () => {
  customCursor.style.display = 'block';
});

// Cursor interaction effects
const hoverElements = document.querySelectorAll('button, a, input, select, textarea, .feature-card, .stat-card, .highlight-item');

hoverElements.forEach(element => {
  element.addEventListener('mouseenter', () => {
    customCursor.style.width = '30px';
    customCursor.style.height = '30px';
    customCursor.style.borderWidth = '3px';
    customCursor.style.left = (cursorX - 15) + 'px';
    customCursor.style.top = (cursorY - 15) + 'px';
    customCursor.style.boxShadow = '0 0 20px rgba(255, 204, 0, 0.9), inset 0 0 10px rgba(255, 204, 0, 0.5)';
    customCursor.style.background = 'rgba(255, 204, 0, 0.1)';
  });

  element.addEventListener('mouseleave', () => {
    customCursor.style.width = '20px';
    customCursor.style.height = '20px';
    customCursor.style.borderWidth = '2px';
    customCursor.style.left = (cursorX - 10) + 'px';
    customCursor.style.top = (cursorY - 10) + 'px';
    customCursor.style.boxShadow = '0 0 10px rgba(255, 204, 0, 0.6)';
    customCursor.style.background = 'transparent';
  });
});
