document.body.classList.remove('no-js');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const WA='https://wa.me/79964100062';

// reveal on scroll
const io=new IntersectionObserver(es=>{let k=0;es.forEach(e=>{if(e.isIntersecting){e.target.style.transitionDelay=Math.min(k++*80,240)+'ms';e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.08});
document.querySelectorAll('[data-r],[data-rise]').forEach(el=>io.observe(el));

// home: lit strip, the frame nearest the centre is lit
const strip=document.getElementById('strip');
if(strip){
  const frames=[...strip.querySelectorAll('figure')];
  const lightCentre=()=>{const c=innerWidth/2;let best=null,bd=1e9;frames.forEach(f=>{const r=f.getBoundingClientRect();const d=Math.abs(r.left+r.width/2-c);if(d<bd){bd=d;best=f;}});frames.forEach(f=>f.classList.toggle('on',f===best));};
  strip.addEventListener('scroll',()=>requestAnimationFrame(lightCentre),{passive:true});
  const centreOn=(i,smooth)=>{const fr=frames[i].getBoundingClientRect(),sr=strip.getBoundingClientRect();strip.scrollTo({left:strip.scrollLeft+(fr.left+fr.width/2)-(sr.left+sr.width/2),behavior:smooth&&!reduce?'smooth':'auto'});};
  frames.forEach((f,i)=>f.addEventListener('click',()=>centreOn(i,true)));
  const start=()=>{centreOn(1,false);lightCentre();};
  start(); addEventListener('load',start);
  let down=false,sx=0,sl=0;
  strip.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;down=true;sx=e.clientX;sl=strip.scrollLeft;strip.style.scrollSnapType='none';});
  addEventListener('pointerup',()=>{if(!down)return;down=false;strip.style.scrollSnapType='';});
  addEventListener('pointermove',e=>{if(down)strip.scrollLeft=sl-(e.clientX-sx);});
}

// home: reasons, one card at a time
const run=document.getElementById('eve-run');
if(run){
  const ecs=[...document.querySelectorAll('.ecard')],nbs=[...document.querySelectorAll('.eve-names button')];
  const wide=()=>innerWidth>900;
  const setOn=i=>{ecs.forEach((c,k)=>c.classList.toggle('on',k===i));nbs.forEach((b,k)=>{b.classList.toggle('on',k===i);b.setAttribute('aria-pressed',k===i);});};
  const move=()=>{if(!wide())return;const r=run.getBoundingClientRect();const span=run.offsetHeight-innerHeight;const p=Math.min(.999,Math.max(0,-r.top/span));setOn(Math.floor(p*ecs.length));};
  const fit=()=>{run.style.height=wide()?(innerHeight*2.1)+'px':'';move();};
  nbs.forEach((b,i)=>b.addEventListener('click',()=>{if(!wide()){setOn(i);return;}const span=run.offsetHeight-innerHeight;scrollTo({top:run.offsetTop+span*(i+.5)/ecs.length,behavior:reduce?'auto':'smooth'});}));
  addEventListener('scroll',()=>requestAnimationFrame(move),{passive:true});
  addEventListener('resize',fit); addEventListener('load',fit); fit();
}

// metrika goals
const YM=(document.querySelector('meta[name="ym-id"]')||{}).content;
const goal=n=>{try{if(YM&&window.ym)ym(+YM,'reachGoal',n);}catch(e){}};
document.addEventListener('click',e=>{const a=e.target.closest('[data-goal]');if(a&&!a.classList.contains('off'))goal(a.dataset.goal);});

// menu: order builder for delivery
const bar=document.getElementById('bar');
if(bar){
  const MIN=+bar.dataset.min||0;
  const order=new Map(),sum=document.getElementById('bar-sum'),send=document.getElementById('bar-send');
  const fmt=n=>n.toLocaleString('ru-RU');
  const render=()=>{
    let total=0,count=0;const lines=[];
    order.forEach((q,n)=>{const row=document.querySelector(`.r[data-n="${CSS.escape(n)}"]`);total+=+row.dataset.p*q;count+=q;lines.push(`${n} × ${q}`);});
    document.querySelectorAll('.r[data-n]').forEach(r=>{const q=order.get(r.dataset.n)||0;r.querySelector('.q').textContent=q||'';r.querySelector('.add').classList.toggle('has',!!q);r.querySelector('.sub').hidden=!q;});
    sum.innerHTML=`${count} поз. · <b>${fmt(total)} ₽</b>`;
    bar.classList.toggle('show',count>0);
    const ok=total>=MIN;
    send.classList.toggle('off',!ok);
    send.setAttribute('aria-disabled',String(!ok));
    send.textContent=ok?'Заказать в WhatsApp':`Ещё ${fmt(MIN-total)} ₽ до заказа`;
    send.href=WA+'?text='+encodeURIComponent('Здравствуйте! Хочу заказать доставку:\n'+lines.join('\n')+`\nИтого по сайту: ${fmt(total)} ₽\nАдрес: `);
  };
  send.addEventListener('click',e=>{if(send.classList.contains('off'))e.preventDefault();});
  document.querySelectorAll('.r[data-n] .add').forEach(b=>b.addEventListener('click',()=>{const n=b.closest('.r').dataset.n;order.set(n,(order.get(n)||0)+1);render();}));
  document.querySelectorAll('.r[data-n] .sub').forEach(b=>b.addEventListener('click',()=>{const n=b.closest('.r').dataset.n;const q=(order.get(n)||0)-1;if(q>0)order.set(n,q);else order.delete(n);render();}));
  document.getElementById('bar-clear').addEventListener('click',()=>{order.clear();render();});
}

// cookie notice
const ck=document.getElementById('cookie');
if(ck){
  let seen=false;try{seen=localStorage.getItem('ck')==='1';}catch(e){}
  if(!seen)ck.hidden=false;
  document.getElementById('cookie-ok').addEventListener('click',()=>{ck.hidden=true;try{localStorage.setItem('ck','1');}catch(e){}});
}

// photos: lightbox
const lb=document.getElementById('lb');
if(lb){
  const shots=[...document.querySelectorAll('.photos button')],big=lb.querySelector('img');let cur=0;
  const show=i=>{cur=(i+shots.length)%shots.length;const im=shots[cur].querySelector('img');big.src=im.src;big.alt=im.alt;};
  shots.forEach((b,i)=>b.addEventListener('click',()=>{show(i);lb.showModal();}));
  lb.querySelector('.lb-x').addEventListener('click',()=>lb.close());
  lb.querySelector('.lb-p').addEventListener('click',()=>show(cur-1));
  lb.querySelector('.lb-n').addEventListener('click',()=>show(cur+1));
  lb.addEventListener('click',e=>{if(e.target===lb)lb.close();});
  addEventListener('keydown',e=>{if(!lb.open)return;if(e.key==='ArrowLeft')show(cur-1);if(e.key==='ArrowRight')show(cur+1);});
}

// footer: name fills the width
const bign=document.getElementById('bigname');
if(bign){
  const fitName=()=>{bign.style.maxWidth='none';bign.style.fontSize='100px';const w=bign.parentElement.clientWidth;bign.style.fontSize=(100*w/bign.scrollWidth*0.995)+'px';bign.style.maxWidth='';};
  addEventListener('resize',fitName); addEventListener('load',fitName); document.fonts.ready.then(fitName);
}
