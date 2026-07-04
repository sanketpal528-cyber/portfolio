// ── Smooth scroll ─────────────────────────────────────────────────
function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

// ── Navbar scroll effect ───────────────────────────────────────────
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 60) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

// ── Typing roles ──────────────────────────────────────────────────
const roles = ['Python Developer 🐍','Cloud Engineer ☁️','Web Developer 💻','AWS Enthusiast 🚀','Problem Solver 🎯'];
let ri=0, ci=0, del=false;
const rt = document.getElementById('roleText');
function typeRole() {
  const r = roles[ri];
  if (!del) { rt.textContent = r.slice(0,++ci); if(ci===r.length){del=true;setTimeout(typeRole,2000);return;} }
  else { rt.textContent = r.slice(0,--ci); if(ci===0){del=false;ri=(ri+1)%roles.length;} }
  setTimeout(typeRole, del?40:80);
}
typeRole();

// ── Reveal on scroll ──────────────────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) { e.target.classList.add('revealed'); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── Skill bars animate on view ────────────────────────────────────
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.sb-fill').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
      });
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-bars').forEach(el => barObs.observe(el));

// ── Loading screen ────────────────────────────────────────────────
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  const fill   = document.querySelector('.loader-fill');
  let p = 0;
  const iv = setInterval(() => {
    p += Math.random() * 30;
    fill.style.width = Math.min(p, 95) + '%';
    if (p >= 95) {
      clearInterval(iv);
      fill.style.width = '100%';
      setTimeout(() => {
        loader.classList.add('hide');
        setTimeout(() => loader.remove(), 600);
      }, 300);
    }
  }, 200);
});

// ── Contact form ──────────────────────────────────────────────────
function sendMessage(e) {
  e.preventDefault();
  const name  = document.getElementById('cName').value.trim();
  const email = document.getElementById('cEmail').value.trim();
  const msg   = document.getElementById('cMsg').value.trim();
  // Open mailto
  const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
  const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}`);
  window.open(`mailto:sanketpal528@gmail.com?subject=${subject}&body=${body}`);
  toast(`✔ Opening email client for ${name}...`);
  e.target.reset();
}

// ── Toast ─────────────────────────────────────────────────────────
let toastTimer;
function toast(msg, type='success') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = `toast ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), 3500);
}
