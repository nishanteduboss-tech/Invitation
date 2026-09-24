'use strict';
const $=s=>document.querySelector(s),pick=a=>a[Math.random()*a.length|0],rnd=n=>Math.random()*n;
let skip=false;const wait=ms=>new Promise(r=>setTimeout(r,skip?0:ms));

/* ===== EDIT ME ===== */
const CFG={
  whatsapp:'', // RSVP number with country code, e.g. '919876543210'. Empty = guest picks a contact.
  share:'Nishant ♥ Saumya invite you to their wedding · 2 Dec 2026 · Sakhwat Premkapur, Jaunpur'
};
const RIT=[
 ['🕉️','Ganesh Vandana','We begin by invoking Shri Ganesh, remover of all obstacles'],
 ['🌼','Tilak','A sacred mark of blessing, respect and welcome'],
 ['💛','Haldi','Golden turmeric, laughter and the warmth of family'],
 ['🌿','Mehndi','Intricate henna, songs and stories written on the hands'],
 ['🥁','Sangeet','An evening of music, dance and joyful celebration'],
 ['🐎','Baraat','The groom arrives in a grand procession of dhol and dance'],
 ['🔥','Havan','Sacred fire, Vedic mantras and pure intentions'],
 ['💐','Jai Mala','Garlands exchanged, the first promise of togetherness'],
 ['🪷','Phere','Seven steps, seven vows, one lifetime'],
 ['🙏','Final Blessings','Elders, family and the divine bless the newly wed couple']
];

/* ===== Deity art (SVG fallback; drop assets/ganesh.png & assets/shiva-parvati.png to replace) ===== */
const D={gn:'<svg viewBox="0 0 100 120"><circle cx="50" cy="40" r="34" fill="none" stroke="#f6df9a" opacity=".4"/><path d="M36 22L50 4l14 18z" fill="url(#g)"/><ellipse cx="27" cy="42" rx="12" ry="17" fill="url(#g)" opacity=".85"/><ellipse cx="73" cy="42" rx="12" ry="17" fill="url(#g)" opacity=".85"/><ellipse cx="50" cy="40" rx="17" ry="18" fill="url(#g)"/><path d="M50 46C44 62 46 74 56 78c6 2 8-4 2-6" fill="none" stroke="#8a5a1c" stroke-width="6" stroke-linecap="round"/><circle cx="43" cy="36" r="2" fill="#3a0d10"/><circle cx="57" cy="36" r="2" fill="#3a0d10"/><ellipse cx="50" cy="94" rx="27" ry="26" fill="url(#g)"/><path d="M14 118Q50 104 86 118z" fill="url(#g)" opacity=".7"/></svg>',
sp:'<svg viewBox="0 0 200 150"><circle cx="100" cy="62" r="56" fill="none" stroke="#f6df9a" opacity=".45"/><circle cx="100" cy="62" r="46" fill="#f6df9a" opacity=".1"/><circle cx="78" cy="44" r="11" fill="url(#g)"/><path d="M71 34q7-16 14 0z" fill="url(#g)"/><path d="M90 20a7 7 0 1 0 8 8 5 5 0 1 1-8-8z" fill="url(#g)"/><path d="M60 114Q62 62 78 58q16 4 18 56z" fill="url(#g)"/><circle cx="122" cy="46" r="10" fill="url(#g)"/><path d="M115 38l7-13 7 13z" fill="url(#g)"/><path d="M102 114q2-48 20-54 18 6 20 54z" fill="url(#g)" opacity=".9"/><path d="M156 22v98M148 32V22M164 32V22M148 32q8 10 16 0M156 22v-9" stroke="#e9c46a" stroke-width="2.5" fill="none"/><path d="M40 120q30-12 60 0 30-12 60 0-60 22-120 0z" fill="url(#g)" opacity=".85"/></svg>'};
document.querySelectorAll('[data-d]').forEach(e=>{e.innerHTML=D[e.dataset.d]+`<img src="assets/${e.dataset.i}.png" alt="" onload="this.parentNode.classList.add('has')" onerror="this.remove()">`});
(function(){let s='<svg viewBox="-100 -100 200 200" fill="none" stroke="currentColor" stroke-width=".5">';
 [[24,88,10],[16,66,12],[12,44,9],[8,26,8]].forEach(([n,r,ry])=>{for(let i=0;i<n;i++)s+=`<ellipse cx="0" cy="-${r}" rx="${ry*.5}" ry="${ry}" transform="rotate(${i*360/n})"/>`});
 [95,78,55,35,15].forEach((r,i)=>s+=`<circle r="${r}" ${i%2?'stroke-dasharray="1 3"':''}/>`);$('.mandala').innerHTML=s+'</svg>'})();

/* ===== Ritual scenes ===== */
const tp=document.createElement('template');
tp.innerHTML=RIT.map(([g,t,d],i)=>`<section class="scene"><div class="glyph r" style="--d:0">${g}</div><p class="num r" style="--d:1">${String(i+1).padStart(2,'0')} / 10</p><h2 class="r" style="--d:2">${t}</h2><i class="orn r" style="--d:3"></i><p class="sub r" style="--d:4">${d}</p></section>`).join('');
$('#bless').before(tp.content);
const S=[...document.querySelectorAll('.scene')],L=S.length-1,dots=$('#dots');
S.forEach(()=>dots.appendChild(document.createElement('i')));
const INT=S.map((_,i)=>i==0?.2:i==1?.75:i==2?.55:i==L?1:i==L-1?.8:.45+(i-3)*.025);

/* ===== Petals & golden sparks ===== */
const cv=$('#fx'),x=cv.getContext('2d');let W,H,P=[],rate={s:.6,p:0};
function rs(){const d=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;x.setTransform(d,0,0,d,0,0)}
addEventListener('resize',rs);rs();
(function tick(){x.clearRect(0,0,W,H);
 if(P.length<150){
  if(Math.random()<rate.s*.4)P.push({t:0,x:rnd(W),y:H+8,vy:-.3-rnd(.7),vx:rnd(.4)-.2,r:.8+rnd(1.8),k:rnd(9)});
  if(Math.random()<rate.p*.25)P.push({t:1,x:rnd(W),y:-14,vy:.7+rnd(1.1),vx:rnd(.8)-.3,r:5+rnd(5),k:rnd(9),rt:rnd(6),c:pick(['#f2a03d','#e8862a','#fff4e0','#fbd36b','#c93d3d'])})}
 P=P.filter(p=>{p.k+=.03;p.x+=p.vx+Math.sin(p.k)*.4;p.y+=p.vy;
  if(p.t){p.rt+=.03;x.save();x.translate(p.x,p.y);x.rotate(p.rt);x.globalAlpha=.85;x.fillStyle=p.c;x.beginPath();x.ellipse(0,0,p.r,p.r*.55,0,0,7);x.fill();x.restore()}
  else{x.globalAlpha=.3+.6*Math.sin(p.k*2)**2;x.fillStyle='#ffd77a';x.beginPath();x.arc(p.x,p.y,p.r,0,7);x.fill()}
  return p.y>-20&&p.y<H+20});
 x.globalAlpha=1;requestAnimationFrame(tick)})();

/* ===== Music: generative devotional ambience (royalty-free, made live). Optional assets/wedding-music.mp3 takes over if present ===== */
let ac,mg,dg,on=false,synth=true,inten=.2,mp,tm;
const N=[261.63,293.66,329.63,392,440,523.25,587.33];
function tone(f,t,dur,v,type='triangle'){const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.03);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(mg);o.start(t);o.stop(t+dur+.1)}
function bell(v=.13){if(!ac||!on)return;const t=ac.currentTime;[1,2.76,5.4].forEach((m,i)=>tone(660*m,t,3.6/(i+1),v/(i+1)/(i+1),'sine'))}
function loop(){if(!on||!synth)return;const t=ac.currentTime;
 if(Math.random()<.5+inten*.4)tone(pick(N),t,2.8,.05+inten*.05);
 if(inten>.5&&Math.random()<.5)tone(pick(N)*2,t+.35,2.2,.03);
 tm=setTimeout(loop,1500-inten*750)}
function initAudio(){ac=new(window.AudioContext||window.webkitAudioContext)();mg=ac.createGain();mg.connect(ac.destination);
 const d=ac.createDelay(),fb=ac.createGain();d.delayTime.value=.37;fb.gain.value=.4;mg.connect(d);d.connect(fb);fb.connect(d);d.connect(ac.destination);
 dg=ac.createGain();dg.gain.value=0;const lp=ac.createBiquadFilter();lp.frequency.value=700;dg.connect(lp);lp.connect(ac.destination);
 [65.41,130.81,196].forEach(f=>{const o=ac.createOscillator();o.frequency.value=f;o.connect(dg);o.start()})}
async function music(v){on=v;$('#music').classList.toggle('off',!v);$('#music').textContent=v?'🔊':'🔇';
 if(v){if(!ac)initAudio();ac.resume();synth=true;dg.gain.linearRampToValueAtTime(.06,ac.currentTime+4);clearTimeout(tm);loop();
  if(!mp){mp=new Audio('assets/wedding-music.mp3');mp.loop=true}
  mp.volume=.3+inten*.5;mp.play().then(()=>{synth=false;dg.gain.value=0;clearTimeout(tm)}).catch(()=>{})}
 else{clearTimeout(tm);mp&&mp.pause();ac&&ac.suspend()}}
$('#music').onclick=e=>{e.stopPropagation();music(!on)};

/* ===== Scene engine ===== */
let cur=-1,lock=false,ready=false,started=false,opening=false,ivt;
function go(n){if(lock||n<0||n>L||n===cur)return;lock=true;
 S.forEach((s,i)=>s.classList.toggle('on',i===n));
 [...dots.children].forEach((d,i)=>d.classList.toggle('a',i===n));
 document.body.dataset.s=n?n===L?'final':'mid':'intro';
 clearTimeout(ivt);document.body.classList.remove('ivory');if(n===L)ivt=setTimeout(()=>document.body.classList.add('ivory'),2400);
 if(n===0)$('#intro').classList.remove('open');
 rate.p=n===1||n>=L-1?1:n>1?.25:0;rate.s=n===0?.6:.4;
 inten=INT[n];if(mp&&!synth)mp.volume=.3+inten*.5;
 if(cur>=0&&n>0)bell(n===L?.2:.13);
 cur=n;setTimeout(()=>lock=false,900)}
function openCard(){if(opening)return;opening=true;$('#intro').classList.add('open');$('#flash').classList.add('fl');bell(.2);
 setTimeout(()=>{go(1);$('#flash').classList.remove('fl');opening=false},1000)}
function nav(d){if(!started)return;if(cur===0&&d>0){if(!ready)skip=true;else openCard();return}go(cur+d)}

async function story(){const I=$('#intro'),c=$('#cap'),cap=t=>{c.style.opacity=0;setTimeout(()=>{c.textContent=t;c.style.opacity=1},skip?0:500)};
 await wait(1200);I.classList.add('c1');cap('A gentle touch reaches Shri Ganesh…');
 await wait(2600);I.classList.add('c2');bell();cap('Ganesh ji notices the sacred invitation');
 await wait(2200);I.classList.add('c3');cap('He lifts it with care…');
 await wait(2200);I.classList.add('c4');bell(.18);cap('…and presents it to Mahadev & Maa Parvati');
 await wait(2600);ready=true;skip=false;cap('Tap to open the invitation');c.classList.add('tap')}

$('#begin').onclick=e=>{e.stopPropagation();started=true;$('#gate').classList.add('h');music(true);go(0);story()};

/* input: tap, swipe, wheel, keys */
let sx,sy;
addEventListener('pointerdown',e=>{sx=e.clientX;sy=e.clientY});
addEventListener('pointerup',e=>{if(e.target.closest('button,a')||sx==null)return;const dx=e.clientX-sx,dy=e.clientY-sy;
 if(Math.hypot(dx,dy)<30)nav(1);else if(Math.abs(dy)>Math.abs(dx))nav(dy<0?1:-1);else nav(dx<0?1:-1);sx=null});
addEventListener('wheel',e=>{if(Math.abs(e.deltaY)>20)nav(e.deltaY>0?1:-1)},{passive:true});
addEventListener('keydown',e=>{if(['ArrowRight','ArrowDown','PageDown',' ','Enter'].includes(e.key)){e.preventDefault();nav(1)}else if(['ArrowLeft','ArrowUp','PageUp'].includes(e.key))nav(-1)});

/* final buttons */
$('#rsvp').onclick=()=>open(`https://wa.me/${CFG.whatsapp}?text=`+encodeURIComponent('Namaste 🙏 Thank you for the invitation! We will be there to celebrate Nishant ♥ Saumya’s wedding on 2 December 2026.'),'_blank');
$('#share').onclick=()=>navigator.share?navigator.share({title:document.title,text:CFG.share,url:location.href}).catch(()=>{}):open('https://wa.me/?text='+encodeURIComponent(CFG.share+' '+location.href),'_blank');
