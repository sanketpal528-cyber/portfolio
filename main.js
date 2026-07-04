// ── Navbar ──────────────────────────────────────────────────────
window.addEventListener('scroll',()=>{
  document.getElementById('navbar').classList.toggle('scrolled',window.scrollY>50);
});

// ── Mobile menu ─────────────────────────────────────────────────
function toggleMenu(){
  const m=document.getElementById('navMenu');
  const h=document.getElementById('hamburger');
  m.classList.toggle('open');
  h.classList.toggle('open');
}
function closeMenu(){
  document.getElementById('navMenu').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}

// ── Typewriter ─────────────────────────────────────────────────
const roles=['Full Stack Developer','Python Engineer','JavaScript Dev','Cloud & AWS','Problem Solver'];
let ri=0,ci=0,del=false;
const tw=document.getElementById('typewriter');
function typeIt(){
  const r=roles[ri];
  if(!del){tw.textContent=r.slice(0,++ci);if(ci===r.length){del=true;setTimeout(typeIt,2000);return;}}
  else{tw.textContent=r.slice(0,--ci);if(ci===0){del=false;ri=(ri+1)%roles.length;}}
  setTimeout(typeIt,del?40:80);
}
typeIt();

// ── Smooth scroll for nav ───────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const t=document.querySelector(a.getAttribute('href'));
    if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'});}
  });
});

// ── Reveal on scroll ────────────────────────────────────────────
const ro=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('revealed');});
},{threshold:0.1});
document.querySelectorAll('.reveal').forEach(el=>ro.observe(el));

// ── Skill bars ─────────────────────────────────────────────────
const bo=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.querySelectorAll('.sb-fill').forEach(b=>{b.style.width=b.closest('.sb').dataset.w+'%';});
    }
  });
},{threshold:0.3});
document.querySelectorAll('.skill-bars').forEach(el=>bo.observe(el));

// ── Tabs ───────────────────────────────────────────────────────
function switchTab(id){
  document.querySelectorAll('.tab-pane').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('tab-'+id).classList.add('active');
  event.currentTarget.classList.add('active');
  // Animate skill bars in the new tab
  const bars=document.getElementById('tab-'+id).querySelectorAll('.sb-fill');
  bars.forEach(b=>{b.style.width='0%';setTimeout(()=>{b.style.width=b.closest('.sb').dataset.w+'%';},50);});
}

// ── Project filter ─────────────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const f=btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card=>{
      const cats=card.dataset.cat||'';
      card.classList.toggle('hidden',f!=='all'&&!cats.includes(f));
    });
  });
});

// ── Contact form ───────────────────────────────────────────────
function sendMsg(e){
  e.preventDefault();
  const n=document.getElementById('cN').value.trim();
  const em=document.getElementById('cE').value.trim();
  const m=document.getElementById('cM').value.trim();
  const sub=encodeURIComponent('Portfolio Contact from '+n);
  const body=encodeURIComponent('Name: '+n+'\nEmail: '+em+'\n\nMessage:\n'+m);
  window.open('mailto:sanketpal528@gmail.com?subject='+sub+'&body='+body);
  toast('Opening email client...');
  e.target.reset();
}

// ── Toast ──────────────────────────────────────────────────────
let tt;
function toast(msg){
  const el=document.getElementById('toast');
  el.textContent=msg;el.classList.remove('hidden');
  clearTimeout(tt);tt=setTimeout(()=>el.classList.add('hidden'),3500);
}
