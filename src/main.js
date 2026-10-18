import './style.css'

(function(){
  const EMAIL='danijela.stojanovic@beispiel.ch';
  const $=id=>document.getElementById(id);
  document.getElementById('yr').textContent=new Date().getFullYear();

  // Mobile Menü
  const btn=$('menuBtn'),nav=$('nav');
  btn.addEventListener('click',()=>{const o=nav.classList.toggle('open');btn.setAttribute('aria-expanded',o);btn.textContent=o?'Schliessen':'Menü'});
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');btn.setAttribute('aria-expanded','false');btn.textContent='Menü'}));

  // Angebot aus Karte übernehmen
  document.querySelectorAll('[data-offer]').forEach(a=>a.addEventListener('click',()=>{$('f-offer').value=a.dataset.offer}));

  // Datum: frühestens morgen
  const t=new Date();t.setDate(t.getDate()+1);
  const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  $('f-date').min=iso(t);

  const fmtDate=v=>{const [y,m,d]=v.split('-');return d+'.'+m+'.'+y};

  $('bookForm').addEventListener('submit',e=>{
    e.preventDefault();
    const name=$('f-name').value.trim(),tel=$('f-tel').value.trim(),offer=$('f-offer').value,date=$('f-date').value,time=$('f-time').value,msg=$('f-msg').value.trim();
    const err=$('formErr');const missing=[];
    if(!name)missing.push('Name');if(!tel)missing.push('Telefonnummer');if(!date)missing.push('Wunschdatum');if(!time)missing.push('Uhrzeit');
    if(missing.length){err.textContent='Bitte ergänzen Sie: '+missing.join(', ')+'.';err.hidden=false;return}
    if(date<$('f-date').min){err.textContent='Bitte wählen Sie ein Datum ab morgen.';err.hidden=false;return}
    err.hidden=true;
    const subject='Rückruf-Wunsch: '+offer;
    const body='Guten Tag Frau Stojanovic\n\nIch wünsche mir einen Anruf am '+fmtDate(date)+' um '+time+' Uhr.\n\n'
      +'Name: '+name+'\nTelefon: '+tel+'\nAngebot: '+offer+'\n'
      +(msg?'\nMein Projekt:\n'+msg+'\n':'')
      +'\nFreundliche Grüsse\n'+name;
    const href='mailto:'+EMAIL+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
    $('mailText').textContent='An: '+EMAIL+'\nBetreff: '+subject+'\n\n'+body;
    $('mailLink').href=href;
    $('result').hidden=false;
    try{window.location.href=href}catch(_){}
    $('result').scrollIntoView({behavior:'smooth',block:'nearest'});
  });

  $('copyBtn').addEventListener('click',()=>{
    const txt=$('mailText').textContent,b=$('copyBtn');
    const done=()=>{b.textContent='Kopiert';setTimeout(()=>b.textContent='Text kopieren',2000)};
    const fallback=()=>{const r=document.createRange();r.selectNodeContents($('mailText'));const s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Text markiert'};
    try{navigator.clipboard.writeText(txt).then(done,fallback)}catch(_){fallback()}
  });
})();
