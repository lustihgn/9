const launchers = document.querySelectorAll('.launcher');
let nextIndex = 3; // trụ tiếp theo sẽ xuất hiện

// Gắn sự kiện click
launchers.forEach((launcher, index) => {
  launcher.addEventListener('click', () => {
    if (!launcher.classList.contains('active')) return;

    launchFirework(launcher);
    swapLauncher(index);
  });
});

// Bắn pháo
function launchFirework(launcher) {
  const firework = document.createElement('div');
  firework.className = 'firework';

  const rect = launcher.getBoundingClientRect();
  firework.style.left = rect.left + rect.width / 2 + 'px';
  firework.style.bottom = '80px';

  document.body.appendChild(firework);

  firework.animate(
    [
      { transform: 'translateY(0)', opacity: 1 },
      { transform: 'translateY(-400px)', opacity: 1 }
    ],
    {
      duration: 800,
      easing: 'ease-out'
    }
  );

  setTimeout(() => {
    firework.remove();
    showImage(rect.left + rect.width / 2, 200, launcher.dataset.img);
  }, 800);
}

// Hiện ảnh sau khi nổ
function showImage(x, y, src) {
  const img = document.createElement('img');
  img.src = src;
  img.className = 'popup-image';

  img.style.left = x - 60 + 'px';
  img.style.top = y + 'px';

  document.body.appendChild(img);

  setTimeout(() => img.remove(), 3000);
}

// Đổi trụ pháo
function swapLauncher(oldIndex) {
  if (nextIndex >= launchers.length) return;

  launchers[oldIndex].classList.remove('active');
  launchers[nextIndex].classList.add('active');
  nextIndex++;
}
