import { historicalSeries, historicalValues } from './historical-series.js';

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const clampUnit = value => Math.max(0, Math.min(1, value));

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const digits = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });
// Fatores derivados dos valores da tabela da copy, mantendo precisão antes de arredondar.
const investment = document.querySelector('#investment');
const presets = [...document.querySelectorAll('.preset')];
let currentAmount = 50000;
let journeyAnimationFrame = 0;

const svgNamespace = 'http://www.w3.org/2000/svg';
function chartElement(tag, attributes, text) {
  const element = document.createElementNS(svgNamespace, tag);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
  if (text !== undefined) element.textContent = text;
  return element;
}
function drawJourneyLines(group) {
  const lines = [...group.querySelectorAll('polyline')].map(line => ({ line, length:line.getTotalLength() }));
  const dots = [...group.querySelectorAll('circle')];
  const labels = [...group.querySelectorAll('.journey-end-label')];
  for (const { line, length } of lines) {
    line.style.strokeDasharray = `${length} ${length}`;
    line.style.strokeDashoffset = String(length);
  }
  [...dots, ...labels].forEach(element => { element.style.opacity = '0'; });
  let start;
  function draw(now) {
    start ??= now;
    const progress = motionPreference.matches ? 1 : Math.min(1, (now - start) / 750);
    const eased = progress * progress * (3 - 2 * progress);
    for (const { line, length } of lines) line.style.strokeDashoffset = String(length * (1 - eased));
    dots.forEach((dot, index) => {
      const checkpoint = index % 4;
      dot.style.opacity = String(clampUnit((eased - checkpoint / 3 + .06) / .06));
    });
    labels.forEach(label => { label.style.opacity = String(clampUnit((progress - .8) / .2)); });
    journeyAnimationFrame = progress < 1 ? requestAnimationFrame(draw) : 0;
  }
  journeyAnimationFrame = requestAnimationFrame(draw);
}

function updateJourneyChart(amount, values, { animate = false } = {}) {
  cancelAnimationFrame(journeyAnimationFrame);
  journeyAnimationFrame = 0;
  const chart = document.querySelector('#journey-chart');
  const width = Math.max(240, chart.parentElement.clientWidth);
  const compact = width < 600;
  const height = compact ? 175 : 180;
  const left = compact ? 56 : 68;
  const right = width - (compact ? 12 : 188);
  const bottom = height - 32;
  const x = index => left + index * (right - left) / 3;
  chart.setAttribute('viewBox', `0 0 ${width} ${height}`);
  chart.classList.toggle('is-compact', compact);
  const grid = document.querySelector('#journey-grid');
  const seriesGroup = document.querySelector('#journey-series');
  const compactMoney = new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL', notation:'compact', maximumFractionDigits:1 });
  const minimum = amount * .8;
  const maximum = amount * 1.75;
  const y = value => bottom - (value - minimum) / (maximum - minimum) * (bottom - 14);
  grid.replaceChildren(...[.8, 1, 1.2, 1.4, 1.6].flatMap(factor => [
    chartElement('line', { x1:left, x2:right, y1:y(amount * factor), y2:y(amount * factor), stroke:'rgba(255,255,255,.1)' }),
    chartElement('text', { x:left - 9, y:y(amount * factor) + 4, 'text-anchor':'end' }, compactMoney.format(amount * factor)),
  ]));
  seriesGroup.replaceChildren(...Object.entries(historicalSeries).flatMap(([key, series]) => [
    chartElement('polyline', { points:values[key].map((value, i) => `${x(i)},${y(value)}`).join(' '), stroke:series.color, class:'journey-series-line' }),
    ...values[key].map((value, i) => chartElement('circle', { cx:x(i), cy:y(value), r:3, fill:series.color })),
    ...compact ? [] : [chartElement('text', { x:right + 12, y:y(values[key][3]) + 4, class:'journey-end-label', style:`fill:${series.color}` }, `${series.label} ${money.format(values[key][3])}`)],
  ]));
  chart.querySelectorAll('.journey-dates text').forEach((date, index) => {
    date.setAttribute('x', x(index));
    date.setAttribute('y', height - 7);
    date.style.textAnchor = index === 0 ? 'start' : index === 3 ? 'end' : 'middle';
  });
  document.querySelector('#journey-chart-title').textContent = `Caminho de ${money.format(amount)}, de janeiro de 2024 a setembro de 2026. `
    + Object.entries(historicalSeries).map(([key, series]) => `${series.label}: ${values[key].map(value => money.format(value)).join(', ')}.`).join(' ');
  if (animate && !motionPreference.matches) drawJourneyLines(seriesGroup);
}

function updateSimulation(value) {
  if (!Number.isFinite(value) || value < 25000 || value > 100000000) {
    document.querySelector('#investment-error').textContent = 'Informe um valor entre R$ 25 mil e R$ 100 milhões.';
    investment.setAttribute('aria-invalid', 'true');
    return;
  }
  document.querySelector('#investment-error').textContent = '';
  investment.removeAttribute('aria-invalid');
  const amountChanged = value !== currentAmount;
  currentAmount = value;
  document.querySelector('.sim-results').classList.toggle('has-large-values', value > 500000);
  const values = historicalValues(value);
  for (const [asset, checkpoints] of Object.entries(values)) {
    document.querySelector(`[data-result="${asset}"]`).textContent = money.format(checkpoints[3]);
  }
  updateJourneyChart(value, values, { animate:amountChanged });
  presets.forEach(button => {
    const active = Number(button.dataset.amount) === value;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}
presets.forEach(button => button.addEventListener('click', () => {
  investment.value = digits.format(Number(button.dataset.amount));
  updateSimulation(Number(button.dataset.amount));
}));
investment.addEventListener('input', () => {
  const clean = investment.value.replace(/\D/g, '');
  investment.value = clean ? digits.format(Number(clean)) : '';
  updateSimulation(clean ? Number(clean) : NaN);
});
investment.addEventListener('blur', () => {
  if (investment.getAttribute('aria-invalid')) {
    investment.value = digits.format(currentAmount);
    updateSimulation(currentAmount);
  }
});

updateSimulation(currentAmount);
let journeyWidth = 0;
new ResizeObserver(([entry]) => {
  if (entry.contentRect.width === journeyWidth) return;
  journeyWidth = entry.contentRect.width;
  updateJourneyChart(currentAmount, historicalValues(currentAmount));
}).observe(document.querySelector('.journey-chart-wrap'));
