/* ================= NY CLEAN MOVERS – APP.JS (consolidated, no duplicates) ================= */

/* 1) Sticky banner show/hide only when bottom tabs are fully in view (desktop only) */
(function(){
  const banner = document.getElementById('banner');
  const tabsEl = document.getElementById('bottomTabs');
  if(!banner || !tabsEl) return;

  const isModalOpen = () => document.getElementById('leadModal')?.classList.contains('open');
  const allowHide = () => window.matchMedia('(min-width: 901px)').matches; // keep always visible on mobile

  if('IntersectionObserver' in window){
    const io = new IntersectionObserver(entries=>{
      entries.forEach(ent=>{
        const hide = ent.isIntersecting && allowHide() && !isModalOpen();
        banner.classList.toggle('hidden', hide);
      });
    }, { threshold: 1.0 }); // hide only when tabs are 100% visible
    io.observe(tabsEl);

    // Keep visible on load & when modal opens/closes
    banner.classList.remove('hidden');
    const modal = document.getElementById('leadModal');
    if(modal){
      const mo = new MutationObserver(()=>{ if(isModalOpen()) banner.classList.remove('hidden'); });
      mo.observe(modal, { attributes:true, attributeFilter:['class'] });
    }

    // On resize, reset and let IO decide again
    window.addEventListener('resize', ()=> banner.classList.remove('hidden'));
  }
})();

/* 2) Tabbed pseudo-pages with quick overlay + SEO updates */
(function(){
  const $ = (s,p=document)=>p.querySelector(s);
  const $$ = (s,p=document)=>Array.from(p.querySelectorAll(s));
  const overlay = $('#overlay');
  const pages   = $$('.page');
  const tabs    = $$('.tab');

  function applySEO(sec){
    const title = sec?.dataset?.title || 'NY Clean Movers — Licensed NYC Moving Company';
    const desc  = sec?.dataset?.desc  || 'Fast, friendly, and clean movers in NYC. COI available. 24/7.';
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    if(meta) meta.setAttribute('content', desc);
  }

  function activate(id, push){
    const next = document.getElementById(id) || document.getElementById('home');
    if(!next || next.classList.contains('active')) return;
    overlay?.classList.add('show');
    setTimeout(()=>{
      pages.forEach(p=>p.classList.remove('active'));
      next.classList.add('active');
      tabs.forEach(t=> t.classList.toggle('active', t.dataset.tab===id));
      window.scrollTo({ top: 0, behavior: 'auto' });
      applySEO(next);
      if(push){ history.pushState({page:id}, '', '#'+id); }
      setTimeout(()=> overlay?.classList.remove('show'), 150);
    }, 80);
  }

  tabs.forEach(t=> t.addEventListener('click', e=>{
    e.preventDefault();
    activate(t.dataset.tab, true);
  }));

  window.addEventListener('popstate', ()=> activate((location.hash||'#home').slice(1), false));
  activate((location.hash||'#home').slice(1), false);
})();

/* 3) Modal: open/close + Netlify Forms AJAX submit with 20s countdown */
(function(){
  const modal    = document.getElementById('leadModal');
  const openers  = [document.getElementById('openLead'), document.getElementById('openLead2')].filter(Boolean);
  const close1   = document.getElementById('closeLead');
  const close2   = document.getElementById('closeLead2');
  const form     = document.getElementById('leadForm');
  const result   = document.getElementById('leadResult');

  if(!modal) return;

  const open  = ()=>{ modal.classList.add('open');  modal.setAttribute('aria-hidden','false'); };
  const close = ()=>{ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); };

  openers.forEach(btn=> btn.addEventListener('click', e=>{ e.preventDefault(); open(); }));
  close1?.addEventListener('click', close);
  close2?.addEventListener('click', close);
  modal.addEventListener('click', (e)=>{ if(e.target===modal) close(); });

  if(form && result){
    const encode = (data) => new URLSearchParams(data).toString();
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      data['form-name'] = form.getAttribute('name') || 'lead';

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode(data)
      }).then(()=>{
        let s = 20;
        result.textContent = "✅ Thanks! Your request was received.\nWant a callback or to book a time?\n\nRefreshing in 20 seconds…";
        const timer = setInterval(()=>{
          s -= 1;
          if(s<=0){
            clearInterval(timer);
            close();
            result.textContent = '';
            form.reset();
          }else{
            result.textContent = "✅ Thanks! Your request was received.\nWant a callback or to book a time?\n\nRefreshing in " + s + " seconds…";
          }
        }, 1000);
      }).catch(()=>{
        result.textContent = "⚠️ We couldn't send that right now. Please call 929-610-2406 or try again.";
      });
    });
  }
})();

/* 4) Address switching (NYC boroughs => Brooklyn address; otherwise Syracuse) + DOT badge */
(function(){
  const addrEls   = document.querySelectorAll('.nycm-address-slot');
  const setAddr   = (v)=> addrEls.forEach(el=> el.textContent = v);
  const nycCities = ['New York','Brooklyn','Queens','Bronx','Staten Island'];
  const nyAddr    = '202 Sheffield Avenue Brooklyn NY, 11207';
  const syAddr    = '127 Cumberland Avenue Syracuse New York 13210';

  // fallback immediately
  setAddr(syAddr);

  // geolocate (client)
  fetch('https://ipapi.co/json')
    .then(r=> r.ok ? r.json() : null)
    .then(d=>{
      const city = (d?.city || '').trim();
      setAddr(nycCities.includes(city) ? nyAddr : syAddr);
    })
    .catch(()=>{ /* keep fallback */ });

  // DOT numbers
  document.querySelectorAll('.nycm-dot').forEach(el=>{
    el.textContent = 'US DOT #3474045 • NYS DOT #41918';
  });
})();

/* 5) UTM + referrer capture (safe, no eval) */
(function(){
  const params = new URLSearchParams(location.search);
  const qs = (k)=> params.get(k) || '';
  const set = (name, value)=>{
    document.querySelectorAll(`[name="${name}"]`).forEach(el=> el.value = value);
  };
  ['utm_source','utm_medium','utm_campaign','utm_content','gclid','fbclid'].forEach(k=> set(k, qs(k)));
  set('landing_page', location.href);
  set('referrer', document.referrer);
})();
