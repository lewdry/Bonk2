const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 20;

class Circle {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = (Math.random() - 0.5) * 4;
        this.dy = (Math.random() - 0.5) * 4;
        this.mass = this.radius;
        this.isBeingDragged = false;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update(circles) {
        if (!this.isBeingDragged) {
            this.x += this.dx;
            this.y += this.dy;

            // Wall collision
            if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
                this.dx = -this.dx;
            }
            if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
                this.dy = -this.dy;
            }

            // Circle collision
            for (let other of circles) {
                if (this === other) continue;
                const dx = this.x - other.x;
                const dy = this.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < this.radius + other.radius) {
                    // Simple collision response
                    this.dx = -this.dx;
                    this.dy = -this.dy;
                    other.dx = -other.dx;
                    other.dy = -other.dy;
                }
            }
        }
        this.draw();
    }
}

const circles = [];

for (let i = 0; i < 10; i++) {
    const radius = Math.random() * 20 + 10;
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const y = Math.random() * (canvas.height - radius * 2) + radius;
    const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    circles.push(new Circle(x, y, radius, color));
}

let draggedCircle = null;

canvas.addEventListener('mousedown', (e) => {
    const mouseX = e.clientX - canvas.offsetLeft;
    const mouseY = e.clientY - canvas.offsetTop;
    circles.forEach(circle => {
        const dx = mouseX - circle.x;
        const dy = mouseY - circle.y;
        if (Math.sqrt(dx * dx + dy * dy) < circle.radius) {
            draggedCircle = circle;
            circle.isBeingDragged = true;
        }
    });
});

canvas.addEventListener('mousemove', (e) => {
    if (draggedCircle) {
        draggedCircle.x = e.clientX - canvas.offsetLeft;
        draggedCircle.y = e.clientY - canvas.offsetTop;
    }
});

canvas.addEventListener('mouseup', () => {
    if (draggedCircle) {
        draggedCircle.isBeingDragged = false;
        draggedCircle = null;
    }
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circles.forEach(circle => circle.update(circles));
    requestAnimationFrame(animate);
}

animate();