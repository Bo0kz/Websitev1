(function(){
const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const yr=$('#yr'); if(yr) yr.textContent=new Date().getFullYear();
$$('.nycm-dot').forEach(el=> el.textContent='US DOT #3474045 • NYS DOT #41918');
function activate(id){
  const next=document.getElementById(id)||document.getElementById('home');
  $$('.page').forEach(p=>p.classList.remove('active')); next.classList.add('active');
  $$('.tab').forEach(t=>t.classList.toggle('active', t.dataset.tab===id));
  window.scrollTo({top:0,behavior:'auto'});
}
$$('.tab').forEach(t=> t.addEventListener('click', e=>{e.preventDefault(); activate(t.dataset.tab); history.pushState({page:t.dataset.tab},'', '#'+t.dataset.tab);}));
window.addEventListener('popstate', ()=> activate((location.hash||'#home').slice(1)));
activate((location.hash||'#home').slice(1));
document.getElementById('leadForm')?.addEventListener('submit', e=>{e.preventDefault(); const fd=new FormData(e.target); fetch('/',{method:'POST',body:fd}).catch(()=>{}); alert('Submitted!');});
})();