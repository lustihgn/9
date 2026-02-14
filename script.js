const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Cập nhật kích thước canvas khi thay đổi kích thước cửa sổ
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

// 🚀 Pháo hoa
class Firework {
    constructor(x) {
        this.x = x;
        this.y = canvas.height;
        this.vx = Math.random() * 4 - 2; // Tạo sự lan tỏa (di chuyển ngang)
        this.vy = Math.random() * -6 - 4; // Tạo sự di chuyển lên trên với vận tốc ngẫu nhiên
        this.exploded = false;
        this.life = 100; // Độ sống của pháo hoa
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1; // Thêm trọng lực

        this.life--; // Giảm dần đời sống pháo hoa

        if (this.life <= 0) {
            this.exploded = true;
            explode(this.x, this.y);
        }
    }

    draw() {
        if (this.exploded) return; // Không vẽ nếu đã nổ
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.fill();
    }
}

function explode(x, y) {
    // Hiển thị ảnh khi pháo hoa nổ
    reveals.push(new PixelReveal(x, y));
}

// 🖼️ Hiển thị ảnh khi pháo hoa nổ
class PixelReveal {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.scale = 0;

        this.images = []; // Mảng chứa hình ảnh
        for (let i = 1; i <= 5; i++) { // Giảm số lượng hình ảnh xuống
            let img = new Image();
            img.src = `images/anh${i}.jpg`;  // Đường dẫn đến các hình ảnh
            this.images.push(img);
        }

        this.img = this.images[Math.floor(Math.random() * this.images.length)]; // Chọn một ảnh ngẫu nhiên
    }

    update() {
        if (this.scale < 1) this.scale += 0.02;
    }

    draw() {
        if (!this.img) return; // Nếu ảnh chưa tải xong thì không vẽ

        const size = 220 * this.scale;

        ctx.save();
        ctx.translate(this.x - size / 2, this.y - size / 2);

        ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, size, size);
        ctx.restore();
    }
}

// 🔁 Quản lý
const fireworks = [];
const reveals = [];

// Vẽ các hiệu ứng lên canvas
function animate() {
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Vẽ sao nền
    ctx.fillStyle = "#fff";
    stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
    });

    fireworks.forEach((f, i) => {
        f.update();
        f.draw();
        if (f.exploded) {
            fireworks.splice(i, 1); // Xóa pháo hoa khi đã nổ xong
        }
    });

    reveals.forEach(r => {
        r.update();
        r.draw();
    });

    requestAnimationFrame(animate);
}
animate();

// 🖱️ Click để bắn pháo
window.addEventListener("click", () => {
    const xs = [
        canvas.width * 0.2,
        canvas.width * 0.5,
        canvas.width * 0.8
    ];
    fireworks.push(new Firework(xs[Math.floor(Math.random() * xs.length)]));
});
