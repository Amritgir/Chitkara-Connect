document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();
  setActiveNavLink();
  renderAuthArea();
  initHoverLoops();
  setupThemeToggle();
  initScrollAnimations();
  // hero effects removed
});

/* custom cursor logic */
// custom cursor removed - using native cursor

/* top loader control: keep running but pause briefly when page is hidden */
(function(){
  const bar = document.querySelector('.top-loader .bar');
  if (!bar) return;
  let running = true;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      bar.style.animationPlayState = 'paused';
    } else {
      bar.style.animationPlayState = 'running';
    }
  });
})();

// show top loader only once per site open (localStorage flag)
(function(){
  const loader = document.getElementById('top-loader');
  if (!loader) return;
  const shown = sessionStorage.getItem('cc_top_loader_shown');
  if (shown) {
    // hide immediately
    loader.style.display = 'none';
    return;
  }
  // show briefly then hide and mark shown
  setTimeout(()=>{
    loader.classList.add('visible');
    setTimeout(()=>{
      loader.style.opacity = '0';
      setTimeout(()=> loader.remove(), 420);
    }, 1400);
    sessionStorage.setItem('cc_top_loader_shown', '1');
  }, 140);
})();

function setupMobileMenu() {
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("nav-menu");

  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    menu.classList.toggle("open");
    const icon = toggle.querySelector("i");
    icon.classList.toggle("fa-bars");
    icon.classList.toggle("fa-xmark");
  });
}

function setActiveNavLink() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach(link => {
    if (link.getAttribute("href") === current) {
      link.classList.add("active");
    }
  });
}

function renderAuthArea() {
  const authArea = document.getElementById("auth-area");
  if (!authArea) return;

  const user = getCurrentUser();

  if (user) {
    authArea.innerHTML = `
      <span class="nav-link" style="color:#0f172a;">
        <i class="fa-solid fa-user-check"></i> ${user.name}
      </span>
      <button class="nav-btn" onclick="logoutUser()">
        <i class="fa-solid fa-right-from-bracket"></i> Logout
      </button>
    `;
  } else {
    authArea.innerHTML = `
      <a href="login.html" class="nav-link">
        <i class="fa-solid fa-right-to-bracket"></i> Login
      </a>
      <a href="signup.html" class="nav-btn">
        <i class="fa-solid fa-user-plus"></i> Sign Up
      </a>
    `;
  }
}

function initHoverLoops() {
  const loops = document.querySelectorAll('.preview-media, .hover-loop');
  if (!loops.length) return;

  // For touch devices, toggle 'active' on tap
  loops.forEach(el => {
    el.addEventListener('click', (e) => {
      // If user clicked a link inside, ignore
      if (e.target && (e.target.tagName === 'A' || e.target.closest('a'))) return;
      el.classList.toggle('active');
    });

    // Also add keyboard accessibility (Enter toggles)
    el.tabIndex = el.tabIndex || 0;
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.classList.toggle('active');
      }
    });
  });
}

/* Theme toggle: toggles data-theme on <html> and persists choice */
function setupThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  const root = document.documentElement;
  const saved = localStorage.getItem('site-theme');
  if (saved) root.setAttribute('data-theme', saved);
  updateThemeIcon(btn, root.getAttribute('data-theme'));

  btn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'attractive' : (current === 'attractive' ? null : 'dark');
    if (next) {
      root.setAttribute('data-theme', next);
      localStorage.setItem('site-theme', next);
    } else {
      root.removeAttribute('data-theme');
      localStorage.removeItem('site-theme');
    }
    updateThemeIcon(btn, root.getAttribute('data-theme'));
  });
}

function updateThemeIcon(btn, theme) {
  const i = btn.querySelector('i');
  if (!i) return;
  i.className = 'fa-solid ' + (theme === 'dark' ? 'fa-moon' : theme === 'attractive' ? 'fa-sun' : 'fa-circle-half-stroke');
}

// Simple intersection observer to add 'in-view' to elements with data-animate
function initScrollAnimations() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // if you want one-time animations, unobserve after in-view
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(i => io.observe(i));
}

/* Hero effects removed: particle canvas and glitch disabled */