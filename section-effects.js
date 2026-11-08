const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const returnsCard = document.querySelector('.returns-card');
const legacySection = document.querySelector('.legacy');
const pageHeadings = [...document.querySelectorAll('main h1, main h2, main h3')];
const visibleHeadings = new Set();
const headingStartScroll = window.scrollY;
let headingsStarted = false;

function revealHeading(heading) {
  heading.classList.add('heading-reveal', 'is-heading-visible');
  headingObserver.unobserve(heading);
  visibleHeadings.delete(heading);
}

const headingObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) {
      visibleHeadings.delete(entry.target);
      continue;
    }
    visibleHeadings.add(entry.target);
    if (headingsStarted) revealHeading(entry.target);
  }
}, { threshold: 0.35, rootMargin: '0px 0px -120px 0px' });

function startHeadingsOnScroll() {
  if (Math.abs(window.scrollY - headingStartScroll) < 2) return;
  headingsStarted = true;
  window.removeEventListener('scroll', startHeadingsOnScroll);
  for (const heading of visibleHeadings) revealHeading(heading);
}

if (!reducedMotion.matches) {
  for (const heading of pageHeadings) {
    if (heading.id === 'hero-title') {
      revealHeading(heading);
      continue;
    }
    const bounds = heading.getBoundingClientRect();
    if (bounds.top >= window.innerHeight * 0.65 || bounds.bottom <= 0) {
      heading.classList.add('heading-reveal');
    }
    headingObserver.observe(heading);
  }
  window.addEventListener('scroll', startHeadingsOnScroll, { passive: true });
}
const percentageFormat = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const returnRows = [...returnsCard.querySelectorAll('.return-row')].map((row) => {
  const number = row.querySelector('.return-value');
  return { element: row, number, value: Number(number.dataset.value), text: number.textContent };
});
let returnsFrame = 0;
let returnsStarted = false;

function finishReturns() {
  cancelAnimationFrame(returnsFrame);
  returnsFrame = 0;
  for (const row of returnRows) {
    row.element.style.setProperty('--return-progress', '1');
    row.number.textContent = row.text;
  }
  returnsCard.dataset.reveal = 'complete';
}

function animateReturns() {
  if (returnsStarted) return;
  returnsStarted = true;
  returnsCard.dataset.reveal = 'running';
  let start;
  function draw(now) {
    start ??= now;
    const progress = reducedMotion.matches ? 1 : Math.min(1, (now - start) / 1350);
    const eased = 1 - (1 - progress) ** 3;
    for (const row of returnRows) {
      row.element.style.setProperty('--return-progress', String(eased));
      row.number.textContent = `${percentageFormat.format(row.value * eased)}%`;
    }
    if (progress < 1) returnsFrame = requestAnimationFrame(draw);
    else finishReturns();
  }
  returnsFrame = requestAnimationFrame(draw);
}

const returnsObserver = new IntersectionObserver((entries) => {
  if (!entries.some((entry) => entry.isIntersecting)) return;
  returnsObserver.disconnect();
  animateReturns();
}, { threshold: 0.25 });

let legacyFrame = 0;
let lastLegacyState = '';
let legacyRevealed = false;

function updateLegacy() {
  legacyFrame = 0;
  const bounds = legacySection.getBoundingClientRect();
  const trigger = Math.min(80, window.innerHeight * 0.08);
  if (bounds.top <= trigger) legacyRevealed = true;
  else if (bounds.top > trigger + 24) legacyRevealed = false;
  const state = `${legacyRevealed}:${reducedMotion.matches}:${bounds.width}:${bounds.height}`;
  if (state === lastLegacyState) return;
  lastLegacyState = state;
  const radius = Math.hypot(bounds.width / 2, bounds.height) + 1;
  legacySection.style.setProperty('--legacy-radius', `${radius.toFixed(2)}px`);
  legacySection.classList.toggle('has-reveal', !reducedMotion.matches);
  legacySection.classList.toggle('is-revealed', legacyRevealed);
  legacySection.dataset.reveal = legacyRevealed || reducedMotion.matches ? 'revealed' : 'waiting';
}

function scheduleLegacyUpdate() {
  if (!legacyFrame) legacyFrame = requestAnimationFrame(updateLegacy);
}

window.addEventListener('scroll', scheduleLegacyUpdate, { passive: true });
window.addEventListener('resize', scheduleLegacyUpdate);
document.fonts.ready.then(scheduleLegacyUpdate);
updateLegacy();

if (!reducedMotion.matches) {
  for (const row of returnRows) {
    row.number.setAttribute('role', 'img');
    row.number.setAttribute('aria-label', row.text);
    row.number.textContent = '0,00%';
    row.element.style.setProperty('--return-progress', '0');
  }
  returnsCard.dataset.reveal = 'waiting';
  returnsObserver.observe(returnsCard);
}

reducedMotion.addEventListener('change', () => {
  scheduleLegacyUpdate();
  if (!reducedMotion.matches) return;
  headingObserver.disconnect();
  window.removeEventListener('scroll', startHeadingsOnScroll);
  visibleHeadings.clear();
  for (const heading of pageHeadings) heading.classList.add('is-heading-visible');
  returnsStarted = true;
  returnsObserver.disconnect();
  finishReturns();
});
