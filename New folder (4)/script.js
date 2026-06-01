// Custom cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; cursor.style.left=mx+'px'; cursor.style.top=my+'px'; });
(function animRing(){ rx+=(mx-rx)*0.12; ry+=(my-ry)*0.12; ring.style.left=rx+'px'; ring.style.top=ry+'px'; requestAnimationFrame(animRing); })();
document.querySelectorAll('button,a,.service-card,.portfolio-item,.why-feature,.process-step').forEach(el=>{
  el.addEventListener('mouseenter',()=>{ ring.style.width='60px'; ring.style.height='60px'; ring.style.borderColor='rgba(200,168,75,0.8)'; });
  el.addEventListener('mouseleave',()=>{ ring.style.width='36px'; ring.style.height='36px'; ring.style.borderColor='rgba(200,168,75,0.5)'; });
});

// Particles
const pContainer = document.getElementById('particles');
for(let i=0;i<25;i++){
  const p = document.createElement('div');
  p.className = 'particle';
  p.style.left = Math.random()*100+'%';
  p.style.animationDuration = (6+Math.random()*12)+'s';
  p.style.animationDelay = (-Math.random()*15)+'s';
  p.style.width = p.style.height = (1+Math.random()*2)+'px';
  pContainer.appendChild(p);
}

// Count up
function countUp(el, target, duration=1800){
  let start=0, step=target/60;
  const interval = setInterval(()=>{
    start = Math.min(start+step, target);
    el.textContent = Math.floor(start) + (el.dataset.count==98?'%':'');
    if(start>=target) clearInterval(interval);
  }, duration/60);
}
const statNums = document.querySelectorAll('.stat-num');
let counted = false;
const heroObs = new IntersectionObserver(entries=>{
  if(entries[0].isIntersecting && !counted){ counted=true; statNums.forEach(el=>countUp(el, parseInt(el.dataset.count))); }
},{threshold:0.5});
heroObs.observe(document.getElementById('hero'));

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); });
},{threshold:0.1,rootMargin:'0px 0px -50px 0px'});
revealEls.forEach(el=>obs.observe(el));

// Portfolio filter
document.querySelectorAll('.filter-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ===== FORM — Backend mail =====
document.getElementById('submitBtn').addEventListener('click', async () => {
  const name    = document.getElementById('fname').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const siteUrl = document.getElementById('fsiteurl').value.trim();
  const budget  = document.getElementById('fbudget').value;
  const ptype   = document.getElementById('ftype').value;
  const message = document.getElementById('fmessage').value.trim();

  if (!name || !email) {
    alert('يرجى تعبئة الاسم والبريد الإلكتروني على الأقل.');
    return;
  }

  const btn = document.getElementById('submitBtn');
  btn.textContent = 'جاري الإرسال...';
  btn.disabled = true;

  try {
    const res = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        companyUrl: siteUrl,
        budget,
        projectType: ptype,
        details: message
      })
    });

    const data = await res.json().catch(() => null);

    if (res.ok && data?.ok) {
      document.getElementById('formSuccess').style.display = 'block';
      btn.style.display = 'none';
    } else {
      throw new Error(data?.message || 'Failed to send');
    }
  } catch (e) {
    console.error(e);
    btn.textContent = 'حدث خطأ، حاول مرة أخرى';
    btn.disabled = false;
  }
});


// Stagger
document.querySelectorAll('.service-card').forEach((el,i)=>{ el.style.transitionDelay=i*0.1+'s'; });
document.querySelectorAll('.process-step').forEach((el,i)=>{ el.style.transitionDelay=i*0.12+'s'; });