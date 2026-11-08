const root = document.documentElement;
root.dataset.inputModality = 'pointer';
document.addEventListener('pointerdown', () => { root.dataset.inputModality = 'pointer'; }, true);
document.addEventListener('keydown', (event) => {
  if (['Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Enter', ' '].includes(event.key)) {
    root.dataset.inputModality = 'keyboard';
  }
}, true);

for (const select of document.querySelectorAll('select')) {
  const label = document.querySelector(`label[for="${select.id}"]`);
  const wrapper = document.createElement('div');
  wrapper.className = 'select-control';
  select.before(wrapper);
  wrapper.append(select);
  label.id ||= `${select.id}-label`;

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'select-trigger';
  trigger.id = `${select.id}-trigger`;
  trigger.setAttribute('role', 'combobox');
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-required', String(select.required));
  trigger.setAttribute('aria-controls', `${select.id}-options`);
  trigger.setAttribute('aria-labelledby', `${label.id} ${select.id}-value`);

  const valueLabel = document.createElement('span');
  valueLabel.id = `${select.id}-value`;
  const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  arrow.setAttribute('viewBox', '0 0 20 20');
  arrow.setAttribute('aria-hidden', 'true');
  const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  arrowPath.setAttribute('d', 'm5 7.5 5 5 5-5');
  arrow.append(arrowPath);
  trigger.append(valueLabel, arrow);

  const list = document.createElement('ul');
  list.id = `${select.id}-options`;
  list.className = 'select-options';
  list.setAttribute('role', 'listbox');
  list.setAttribute('aria-labelledby', label.id);
  list.hidden = true;
  const options = [...select.options].filter((option) => option.value && !option.disabled);
  const items = options.map((option, index) => {
    const item = document.createElement('li');
    item.id = `${select.id}-option-${index}`;
    item.className = 'select-option';
    item.setAttribute('role', 'option');
    item.textContent = option.textContent;
    item.addEventListener('pointerdown', (event) => event.preventDefault());
    item.addEventListener('pointermove', () => setActive(index));
    item.addEventListener('click', () => choose(index));
    list.append(item);
    return item;
  });

  const error = document.createElement('p');
  error.id = `${select.id}-error`;
  error.className = 'field-error';
  error.textContent = 'Selecione uma faixa de investimento.';
  error.hidden = true;
  error.setAttribute('role', 'alert');
  trigger.setAttribute('aria-describedby', error.id);
  wrapper.append(trigger, list, error);
  let activeIndex = 0;
  let typed = '';
  let lastTyped = 0;

  function sync() {
    valueLabel.textContent = select.selectedOptions[0].textContent;
    trigger.classList.toggle('is-placeholder', !select.value);
    items.forEach((item, index) => item.setAttribute('aria-selected', String(options[index].value === select.value)));
    trigger.removeAttribute('aria-invalid');
    error.hidden = true;
  }

  function setActive(index) {
    activeIndex = (index + items.length) % items.length;
    items.forEach((item, itemIndex) => item.classList.toggle('is-active', itemIndex === activeIndex));
    trigger.setAttribute('aria-activedescendant', items[activeIndex].id);
  }

  function open(index = Math.max(0, options.findIndex((option) => option.value === select.value))) {
    list.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    setActive(index);
    list.scrollIntoView({ block: 'nearest' });
  }

  function close() {
    list.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    trigger.removeAttribute('aria-activedescendant');
  }

  function choose(index) {
    select.value = options[index].value;
    select.dispatchEvent(new Event('input', { bubbles: true }));
    select.dispatchEvent(new Event('change', { bubbles: true }));
    close();
    trigger.focus({ preventScroll: true });
  }

  trigger.addEventListener('click', () => { if (list.hidden) open(); else close(); });
  trigger.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (list.hidden) open();
      else setActive(activeIndex + (event.key === 'ArrowDown' ? 1 : -1));
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      open(event.key === 'Home' ? 0 : items.length - 1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (list.hidden) open(); else choose(activeIndex);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      close();
    } else if (event.key === 'Tab') {
      close();
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const now = performance.now();
      typed = now - lastTyped < 600 ? typed + event.key : event.key;
      lastTyped = now;
      const index = options.findIndex((option) => option.textContent.toLocaleLowerCase('pt-BR').startsWith(typed.toLocaleLowerCase('pt-BR')));
      if (index >= 0) open(index);
    }
  });
  document.addEventListener('pointerdown', (event) => { if (!wrapper.contains(event.target)) close(); });
  wrapper.addEventListener('focusout', (event) => { if (!wrapper.contains(event.relatedTarget)) close(); });
  label.addEventListener('click', (event) => { event.preventDefault(); trigger.focus(); });
  select.addEventListener('change', sync);
  select.addEventListener('invalid', (event) => {
    event.preventDefault();
    trigger.setAttribute('aria-invalid', 'true');
    error.hidden = false;
    if (select.form.querySelector(':invalid') === select) trigger.focus();
  });
  select.form.addEventListener('reset', () => requestAnimationFrame(() => { close(); sync(); }));
  sync();
  select.hidden = true;
}
