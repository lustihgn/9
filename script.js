const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// ⭐ Sao nền
const stars = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2
}));

// 🚀 Pháo bay
class Firework {
    constructor(x) {
        this.x = x;
        this.y = canvas.height;
        this.vy = 9;
        this.targetY = Math.random() * canvas.height * 0.4 + 100;
        this.trail = [];
        this.exploded = false;
    }

    update() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 12) this.trail.shift();

        this.y -= this.vy;

        if (this.y <= this.targetY) {
            this.exploded = true;
            explode(this.x, this.y);
            reveals.push(new PixelReveal(this.x, this.y));
        }
    }

    draw() {
        ctx.strokeStyle = "rgba(255,255,255,0.6)";
        ctx.beginPath();
        this.trail.forEach((p, i) => {
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();

        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

// 💥 Hạt pháo
class Particle {
    constructor(x, y) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.life = 60;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.05;
        this.life--;
    }

    draw() {
        ctx.fillStyle = `rgba(255,${Math.random()*200},0,${this.life/60})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

function explode(x, y) {
    for (let i = 0; i < 80; i++) {
        particles.push(new Particle(x, y));
    }
}

// 🖼️ Hiện ảnh từ tâm (pixel)
class PixelReveal {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.scale = 0;
        this.img = new Image();
        this.img.src = "happy.png";
    }

    update() {
        if (this.scale < 1) this.scale += 0.02;
    }

    draw() {
        const size = 220 * this.scale;
        const pixel = 8;

        ctx.save();
        ctx.translate(this.x - size / 2, this.y - size / 2);

        for (let i = 0; i < size; i += pixel) {
            for (let j = 0; j < size; j += pixel) {
                const dx = i - size / 2;
                const dy = j - size / 2;
                if (Math.sqrt(dx * dx + dy * dy) < size / 2) {
                    ctx.drawImage(
                        this.img,
                        (i / size) * this.img.width,
                        (j / size) * this.img.height,
                        pixel,
                        pixel,
                        i,
                        j,
                        pixel,
                        pixel
                    );
                }
            }
        }
        ctx.restore();
    }
}

// 🔁 Quản lý
const fireworks = [];
const particles = [];
const reveals = [];

function animate() {
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Vẽ sao
    ctx.fillStyle = "#fff";
    stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
    });

    fireworks.forEach((f, i) => {
        f.update();
        f.draw();
        if (f.exploded) fireworks.splice(i, 1);
    });

    particles.forEach((p, i) => {
        p.update();
        p.draw();
        if (p.life <= 0) particles.splice(i, 1);
    });

    reveals.forEach(r => {
        r.update();
        r.draw();
    });

    requestAnimationFrame(animate);
}
animate();

// 🖱️ Click bắn pháo
window.addEventListener("click", () => {
    const xs = [
        canvas.width * 0.2,
        canvas.width * 0.5,
        canvas.width * 0.8
    ];
    fireworks.push(new Firework(xs[Math.floor(Math.random() * xs.length)]));
});
