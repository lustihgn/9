// Lấy tất cả các trụ pháo
const launchers = document.querySelectorAll('.launcher');
let nextIndex = 3; // Trụ tiếp theo sẽ xuất hiện

// Gắn sự kiện click vào toàn bộ màn hình
document.body.addEventListener("click", function(event) {
  // Kiểm tra nếu còn trụ pháo nào chưa bắn thì bắn từ trụ đó
  if (nextIndex >= launchers.length) return;

  // Lấy trụ pháo đầu tiên còn lại
  const launcher = launchers[nextIndex];
  launchFirework(launcher);
  swapLauncher();
});

// Bắn pháo từ trụ
function launchFirework(launcher) {
  const firework = document.createElement("div");
  firework.className = "firework";

  // Lấy vị trí của trụ pháo trên màn hình
  const rect = launcher.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height; // Pháo hoa sẽ bắt đầu từ trụ

  firework.style.left = `${x - 4}px`;  // Căn chỉnh pháo hoa tại vị trí trụ
  firework.style.bottom = '80px'; // Pháo bắn lên từ dưới

  document.body.appendChild(firework);

  // Hiệu ứng pháo bay lên từ trụ
  firework.animate(
    [
      { transform: 'translateY(0)', opacity: 1 },
      { transform: 'translateY(-400px)', opacity: 1 }
    ],
    { duration: 800, easing: 'ease-out' }
  );

  // Hiển thị ảnh sau khi pháo nổ
  setTimeout(() => {
    firework.remove();
    explode(x, y);
    showImage(x, y, launcher.dataset.img);
  }, 800);
}

// Hiệu ứng nổ pháo
function explode(x, y) {
  const sky = document.createElement("div");
  sky.className = "sky-flash";
  document.body.appendChild(sky);
  setTimeout(() => sky.remove(), 600);

  const colors = ["#ff3c3c", "#ffd93c", "#4ef037", "#3cf0ff", "#ff3cf0"];

  // Tạo các hạt nổ
  for (let i = 0; i < 80; i++) {
    const particle = document.createElement("div");
    particle.className = "sparkle";
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.left = `${x + Math.random() * 20 - 10}px`; // tạo vị trí ngẫu nhiên x
    particle.style.top = `${y + Math.random() * 20 - 10}px`;  // tạo vị trí ngẫu nhiên y

    document.body.appendChild(particle);

    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 200;

    particle.animate(
      [
        { transform: "translate(0,0)", opacity: 1 },
        {
          transform: `translate(${Math.cos(angle) * distance}px,
                                 ${Math.sin(angle) * distance}px)`,
          opacity: 0
        }
      ],
      { duration: 1000, easing: "ease-out" }
    );

    setTimeout(() => particle.remove(), 1000);
  }
}

// Hiển thị ảnh sau khi pháo nổ
function showImage(x, y, src) {
  const img = document.createElement("img");
  img.src = src;
  img.className = "popup-image";

  img.style.left = x - 75 + "px";
  img.style.top = y + "px";

  document.body.appendChild(img);

  // Đảm bảo ảnh từ từ hiện lên và lan rộng từ trung tâm
  setTimeout(() => {
    img.style.opacity = 1;
    img.style.transform = "scale(1)";
  }, 800);

  // Biến mất ảnh sau vài giây
  setTimeout(() => {
    img.style.opacity = 0;
    setTimeout(() => img.remove(), 500);
  }, 5000);
}

// Đổi trụ pháo
function swapLauncher() {
  if (nextIndex >= launchers.length) return;

  launchers[nextIndex].classList.remove('active');
  nextIndex++;
  if (nextIndex < launchers.length) {
    launchers[nextIndex].classList.add('active');
  }
}
