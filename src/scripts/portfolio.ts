/* Client runtime: theme switching, scroll-spy, header-flip, reveal, smooth scroll, email obfuscation. */

type ThemeMode = 'system' | 'light' | 'dark';
type Resolved = 'paper' | 'graphite';

const root = document.documentElement;
const mq = window.matchMedia('(prefers-color-scheme: dark)');

// `?theme=light|dark` query overrides stored/system preference. Used by Lighthouse
// to audit each theme deterministically (Chrome's --force-prefers-color-scheme flag
// is overridden by Lighthouse's CDP emulation, so the URL param is the reliable lever).
const readOverride = (): ThemeMode | null => {
  const qs = new URLSearchParams(window.location.search).get('theme');
  return qs === 'light' || qs === 'dark' ? qs : null;
};

const readMode = (): ThemeMode => {
  const override = readOverride();
  if (override) return override;
  const stored = localStorage.getItem('theme');
  return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
};

const resolve = (mode: ThemeMode): Resolved =>
  mode === 'dark' || (mode === 'system' && mq.matches) ? 'graphite' : 'paper';

const applyTheme = (mode: ThemeMode) => {
  const resolved = resolve(mode);
  root.setAttribute('data-theme', resolved);
  root.setAttribute('data-theme-mode', mode);
  syncThemeUI(mode, resolved);
};

const syncThemeUI = (mode: ThemeMode, resolved: Resolved) => {
  document.querySelectorAll<HTMLButtonElement>('[data-pf-theme-switch] button').forEach((btn) => {
    const value = btn.getAttribute('data-theme-mode');
    btn.setAttribute('aria-checked', value === mode ? 'true' : 'false');
  });
  document.querySelectorAll<HTMLElement>('[data-pf-theme-indicator]').forEach((el) => {
    el.textContent = `● ${resolved}`;
  });
};

const initThemeSwitcher = () => {
  let mode = readMode();
  applyTheme(mode);

  document.querySelectorAll<HTMLButtonElement>('[data-pf-theme-switch] button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const value = btn.getAttribute('data-theme-mode') as ThemeMode | null;
      if (!value) return;
      mode = value;
      localStorage.setItem('theme', value);
      applyTheme(value);
    });
  });

  const onChange = () => {
    if (readMode() === 'system') applyTheme('system');
  };
  if ('addEventListener' in mq) mq.addEventListener('change', onChange);
};

const initScrollSpy = () => {
  const sections = document.querySelectorAll<HTMLElement>('[data-nav]');
  const links = document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]');
  if (!sections.length) return;

  const setActive = (id: string) => {
    links.forEach((l) => {
      l.setAttribute('aria-current', l.getAttribute('data-nav-link') === id ? 'true' : 'false');
    });
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const id = e.target.getAttribute('data-nav');
          if (id) setActive(id);
        }
      });
    },
    { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
  );
  sections.forEach((s) => io.observe(s));
};

const initHeaderFlip = () => {
  const sections = document.querySelectorAll<HTMLElement>('[data-nav]');
  const header = document.querySelector<HTMLElement>('[data-pf-header]');
  if (!sections.length || !header) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const target = e.target as HTMLElement;
        const overDark = target.hasAttribute('data-spotlight');
        if (overDark) header.setAttribute('data-over-dark', '');
        else header.removeAttribute('data-over-dark');
      });
    },
    { rootMargin: '-72px 0px -99% 0px', threshold: 0 },
  );
  sections.forEach((s) => io.observe(s));
};

const initReveal = () => {
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!targets.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).setAttribute('data-revealed', '');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  targets.forEach((t) => io.observe(t));
};

const initSmoothScroll = () => {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (ev) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      ev.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 24;
      window.scrollTo({ top, behavior: 'smooth' });
      history.replaceState(null, '', href);
    });
  });
};

const initEmail = () => {
  document.querySelectorAll<HTMLAnchorElement>('a[data-email]').forEach((a) => {
    a.addEventListener('click', (ev) => {
      ev.preventDefault();
      const u = a.getAttribute('data-email-user');
      const d = a.getAttribute('data-email-domain');
      if (!u || !d) return;
      window.location.href = `mailto:${u}@${d}`;
    });
  });
};

const start = () => {
  initThemeSwitcher();
  initScrollSpy();
  initHeaderFlip();
  initReveal();
  initSmoothScroll();
  initEmail();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
