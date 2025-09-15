document.addEventListener('DOMContentLoaded', () => {
  const bar = document.getElementById('progressBar');

  // 背景改为<img>承载后，这段不再需要
  document.querySelectorAll('.media').forEach(el => {
    el.style.backgroundImage = '';
  });

  // 进度条
  const onScroll = () => {
    const doc = document.documentElement;
    const total = doc.scrollHeight - doc.clientHeight;
    const progress = total > 0 ? (doc.scrollTop / total) : 0;
    if (bar) bar.style.width = `${progress * 100}%`;
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // 移动端汉堡菜单
  const toggle = document.getElementById('navToggle');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const setDrawer = (open) => {
    if (!drawer || !toggle || !overlay) return;
    drawer.classList.toggle('open', open);
    overlay.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    drawer.setAttribute('aria-hidden', String(!open));
  };
  toggle?.addEventListener('click', () => setDrawer(!drawer.classList.contains('open')));
  overlay?.addEventListener('click', () => setDrawer(false));
  drawer?.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', () => setDrawer(false));
  });

  // 顶部导航平滑滚动
  document.querySelectorAll('.topnav a[href^="#"], .dots a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const id = a.getAttribute('href');
      const el = document.querySelector(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // 同步圆点激活状态
  const dots = Array.from(document.querySelectorAll('.dots a'));
  const shots = Array.from(document.querySelectorAll('.shot'));
  const setDotActive = (key) => {
    dots.forEach(d => d.classList.toggle('active', d.dataset.dot === key));
  };
  const io = new IntersectionObserver((entries) => {
    const vis = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio);
    if (vis.length) {
      const section = vis[0].target;
      const key = section.getAttribute('data-dot') || section.id?.replace('s-','');
      if (key) setDotActive(key);
    }
  }, { threshold: [0, .25, .5, .75, 1] });
  shots.forEach(s => io.observe(s));
  setDotActive('life');
});
