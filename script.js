// ── LANG TOGGLE ──
let currentLang = 'ar';
const html = document.getElementById('htmlRoot');
const langLabel = document.getElementById('langLabel');
 
function applyLang(lang) {
  currentLang = lang;
  const isAr = lang === 'ar';
  html.setAttribute('lang', lang);
  html.setAttribute('dir', isAr ? 'rtl' : 'ltr');
  langLabel.textContent = isAr ? 'EN' : 'عر';
  document.querySelectorAll('.t').forEach(el => {
    const val = el.getAttribute('data-' + lang);
    if (val !== null) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = val;
      else if (el.tagName === 'OPTION') el.textContent = val;
      else el.textContent = val;
    }
  });
  // update textarea placeholder manually
  const ta = document.getElementById('fmessage');
  if(ta) ta.placeholder = isAr ? 'أخبرنا عن فكرتك، جمهورك المستهدف، وأي مرجع تصميمي تحبه...' : 'Tell us about your idea, target audience, and any design references you like...';
  // fname placeholder
  const fn = document.getElementById('fname');
  if(fn) fn.placeholder = isAr ? 'محمد أحمد' : 'John Smith';
  localStorage.setItem('vc_lang', lang);
}
 
document.getElementById('langToggle').addEventListener('click', () => {
  applyLang(currentLang === 'ar' ? 'en' : 'ar');
});
 
// restore saved lang
const saved = localStorage.getItem('vc_lang');
if (saved && saved !== 'ar') applyLang(saved);
 
// ── HAMBURGER ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');
hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));
 
// ── CUSTOM CURSOR (desktop only) ──
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
if (window.matchMedia('(hover:hover)').matches) {
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; cursor.style.left=mx+'px'; cursor.style.top=my+'px'; });
  (function animRing(){ rx+=(mx-rx)*.12; ry+=(my-ry)*.12; ring.style.left=rx+'px'; ring.style.top=ry+'px'; requestAnimationFrame(animRing); })();
  document.querySelectorAll('button,a,.service-card,.portfolio-item,.why-feature,.process-step').forEach(el=>{
    el.addEventListener('mouseenter',()=>{ ring.style.width='60px'; ring.style.height='60px'; ring.style.borderColor='rgba(200,168,75,.8)'; });
    el.addEventListener('mouseleave',()=>{ ring.style.width='36px'; ring.style.height='36px'; ring.style.borderColor='rgba(200,168,75,.5)'; });
  });
}
 
// ── PARTICLES ──
const pContainer = document.getElementById('particles');
for(let i=0;i<25;i++){
  const p=document.createElement('div'); p.className='particle';
  p.style.left=Math.random()*100+'%';
  p.style.animationDuration=(6+Math.random()*12)+'s';
  p.style.animationDelay=(-Math.random()*15)+'s';
  p.style.width=p.style.height=(1+Math.random()*2)+'px';
  pContainer.appendChild(p);
}
 
// ── COUNT UP ──
function countUp(el,target,duration=1800){
  let start=0,step=target/60;
  const iv=setInterval(()=>{
    start=Math.min(start+step,target);
    el.textContent=Math.floor(start)+(el.dataset.count==98?'%':'');
    if(start>=target) clearInterval(iv);
  },duration/60);
}
const statNums=document.querySelectorAll('.stat-num');
let counted=false;
new IntersectionObserver(entries=>{
  if(entries[0].isIntersecting&&!counted){ counted=true; statNums.forEach(el=>countUp(el,parseInt(el.dataset.count))); }
},{threshold:.5}).observe(document.getElementById('hero'));
 
// ── SCROLL REVEAL ──
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); });
},{threshold:.1,rootMargin:'0px 0px -50px 0px'});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
 
// ── FILTER ──
document.querySelectorAll('.filter-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
  });
});
 
// ── FORM — Formspree ──
document.getElementById('submitBtn').addEventListener('click', async () => {
  const name    = document.getElementById('fname').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const siteUrl = document.getElementById('fsiteurl').value.trim();
  const budget  = document.getElementById('fbudget').value;
  const ptype   = document.getElementById('ftype').value;
  const message = document.getElementById('fmessage').value.trim();
  const isAr    = currentLang === 'ar';
 
  if(!name||!email){ alert(isAr?'يرجى تعبئة الاسم والبريد الإلكتروني على الأقل.':'Please fill in your name and email at minimum.'); return; }
 
  const btn=document.getElementById('submitBtn');
  btn.textContent=isAr?'جاري الإرسال...':'Sending...';
  btn.disabled=true;
 
  try {
    const res=await fetch('https://formspree.io/f/mqejoyev',{
      method:'POST',
      headers:{'Accept':'application/json','Content-Type':'application/json'},
      body:JSON.stringify({ name, email, site_url:siteUrl||'N/A', budget:budget||'N/A', project_type:ptype||'N/A', message:message||'N/A' })
    });
    if(res.ok){
      document.getElementById('formSuccess').style.display='block';
      btn.style.display='none';
    } else { throw new Error(); }
  } catch {
    btn.textContent=isAr?'حدث خطأ، حاول مرة أخرى':'Error, please try again';
    btn.disabled=false;
  }
});
 
// ── STAGGER ──
document.querySelectorAll('.service-card').forEach((el,i)=>el.style.transitionDelay=i*.1+'s');
document.querySelectorAll('.process-step').forEach((el,i)=>el.style.transitionDelay=i*.12+'s');