(() => {
  const root = document.documentElement;
  const storageKey = 'iox-theme';
  let initialTheme = 'dark';
  try {
    if (localStorage.getItem(storageKey) === 'light') initialTheme = 'light';
  } catch {}
  root.dataset.theme = initialTheme;

  document.addEventListener('DOMContentLoaded', () => {
    const toggles = [...document.querySelectorAll('.theme-toggle')];
    const themeColor = document.querySelector('meta[name="theme-color"]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let switching = false;

    function applyTheme(theme) {
      root.dataset.theme = theme;
      const label = theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro';
      for (const toggle of toggles) {
        toggle.setAttribute('aria-label', label);
        toggle.title = label;
      }
      themeColor.content = theme === 'light' ? '#faf9f6' : '#0d0d0d';
      try {
        localStorage.setItem(storageKey, theme);
      } catch {}
    }

    applyTheme(initialTheme);
    async function toggleTheme(event) {
      if (switching) return;
      const toggle = event.currentTarget;
      const nextTheme = root.dataset.theme === 'light' ? 'dark' : 'light';
      if (reducedMotion.matches || !document.startViewTransition) {
        applyTheme(nextTheme);
        return;
      }

      switching = true;
      const bounds = toggle.getBoundingClientRect();
      const x = bounds.left + bounds.width / 2;
      const y = bounds.top + bounds.height / 2;
      const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      root.classList.add('theme-transitioning');
      const transition = document.startViewTransition(() => applyTheme(nextTheme));
      try {
        await transition.ready;
        await root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 750, easing: 'cubic-bezier(.4, 0, .2, 1)', pseudoElement: '::view-transition-new(root)' },
        ).finished;
        await transition.finished;
      } catch {
        transition.skipTransition();
        applyTheme(nextTheme);
      } finally {
        root.classList.remove('theme-transitioning');
        switching = false;
      }
    }

    for (const toggle of toggles) {
      toggle.hidden = false;
      toggle.addEventListener('click', toggleTheme);
    }
  });
})();
