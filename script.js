const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const credentials = document.querySelector('.credentials');
const track = document.querySelector('.credentials-track');
const originalGroup = track.querySelector('.credentials-list');
const originalItems = [...originalGroup.children].map((item) => item.cloneNode(true));
let measuredWidth = 0;

function updateMarquee() {
  originalGroup.replaceChildren(...originalItems.map((item) => item.cloneNode(true)));
  const groupWidth = originalGroup.getBoundingClientRect().width;
  if (!groupWidth) return;

  while (!motionPreference.matches && originalGroup.getBoundingClientRect().width < credentials.clientWidth) {
    for (const item of originalItems) {
      const copy = item.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      originalGroup.append(copy);
    }
  }

  const repeatedGroup = originalGroup.cloneNode(true);
  repeatedGroup.classList.add('credentials-repeat');
  repeatedGroup.setAttribute('aria-hidden', 'true');
  track.querySelector('.credentials-repeat').replaceWith(repeatedGroup);
  track.style.setProperty('--marquee-duration', `${originalGroup.getBoundingClientRect().width / 42}s`);
  credentials.classList.add('is-ready');
}

motionPreference.addEventListener('change', updateMarquee);

document.fonts.ready.then(() => {
  updateMarquee();
  new ResizeObserver(() => {
    if (credentials.clientWidth !== measuredWidth) {
      measuredWidth = credentials.clientWidth;
      updateMarquee();
    }
  }).observe(credentials);
});

for (const card of document.querySelectorAll('.floating-card')) {
  const surface = card.querySelector('.card-surface');
  let frame = 0;
  let pointerX = 0;
  let pointerY = 0;

  function resetCard() {
    cancelAnimationFrame(frame);
    frame = 0;
    surface.style.removeProperty('--pointer-x');
    surface.style.removeProperty('--pointer-y');
    surface.style.removeProperty('--pointer-rotation');
  }

  card.addEventListener('pointermove', (event) => {
    if (motionPreference.matches || event.pointerType !== 'mouse') return;
    const bounds = card.getBoundingClientRect();
    pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
    pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      surface.style.setProperty('--pointer-x', `${pointerX * 14}px`);
      surface.style.setProperty('--pointer-y', `${pointerY * 12}px`);
      surface.style.setProperty('--pointer-rotation', `${pointerX * 4}deg`);
      frame = 0;
    });
  });
  card.addEventListener('pointerleave', resetCard);
  card.addEventListener('pointercancel', resetCard);
  motionPreference.addEventListener('change', resetCard);
}
