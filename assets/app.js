// --- Tabbed pseudo-pages with quick overlay
(function(){
  const $ = (s,p=document)=>p.querySelector(s);
  const $$ = (s,p=document)=>Array.from(p.querySelectorAll(s));
  const overlay = $('#overlay');
  const pages = $$('.page');
  const tabs  = $$('.tab');

  function applySEO(sec){
    const title = sec.dataset.title || 'NY Clean Movers — Licensed NYC Moving Company';
    const desc  = sec.dataset.desc  || 'Fast, friendly, and clean movers in NYC. COI available. 24/7.';
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    if(meta) meta.setAttribute('content', desc);
  }

  function activate(id, push){
    const next = document.getElementById(id) || document.getElementById('home');
    if(next.classList.contains('active')) return;
    overlay.classList.add('show'); // fade in
    setTimeout(()=>{
      pages.forEach(p=>p.classList.remove('active'));
      next.classList.add('active');
      tabs.forEach(t=> t.classList.toggle('active', t.dataset.tab===id));
      window.scrollTo({top:0, behavior:'auto'});
      applySEO(next);
      if(push){ history.pushState({page:id}, '', '#'+id); }
      setTimeout(()=> overlay.classList.remove('show'), 150); // fade out
    }, 80);
  }

  tabs.forEach(t=> t.addEventListener('click', e=>{
    e.preventDefault();
    activate(t.dataset.tab, true);
  }));

  window.addEventListener('popstate', ()=> activate((location.hash||'#home').slice(1), false));
  activate((location.hash||'#home').slice(1), false);
})();

// --- Address switching (NYC cities -> Brooklyn; else Syracuse)
(function(){
  const addrEls = document.querySelectorAll('.nycm-address-slot');
  const nycCities = ['New York','Brooklyn','Queens','Bronx','Staten Island'];
  const nyAddress = '202 Sheffield Avenue Brooklyn NY, 11207';
  const syAddress = '127 Cumberland Avenue Syracuse New York 13210';

  function setAddr(v){ addrEls.forEach(el=> el.textContent = v); }

  // simple fallback first
  setAddr(syAddress);

  // use ipapi (client) – OK for now; we can move to Edge later
  fetch('https://ipapi.co/json')
    .then(r=>r.ok?r.json():null)
    .then(d=>{
      if(!d) return;
      const city = (d.city||'').trim();
      setAddr(nycCities.includes(city) ? nyAddress : syAddress);
    })
    .catch(()=>{ /* keep fallback */ });
})();

// --- DOT numbers (always render)
document.querySelectorAll('.nycm-dot').forEach(el=>{
  el.textContent = 'US DOT #3474045 • NYS DOT #41918';
});
// --- Hide sticky banner when bottom tabs are in view
(function(){
  const banner = document.getElementById('banner');
  const tabsEl = document.getElementById('bottomTabs');
  if(!banner || !tabsEl) return;
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver(entries=>{
      entries.forEach(ent=>{
        banner.classList.toggle('hidden', ent.isIntersecting);
      });
    }, {threshold: .3});
    io.observe(tabsEl);
  }
})();


