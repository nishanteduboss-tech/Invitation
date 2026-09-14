/* NISHANT & SAUMYA — CINEMATIC INVITATION ENGINE
   Static-first architecture: scene state machine + interaction controller +
   deterministic animation hooks. No build step required for GitHub Pages.
*/
(() => {
  "use strict";

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const scenes = $$(".scene");
  const progress = $("#progress");
  const sceneNo = $("#sceneNo");
  const stage = $("#stage");
  const orb = $("#goldOrb");
  const hint = $("#ganeshHint");

  const ROUTES = {
    intro:0, ganesh:1, kailash:2, open:3, story:4,
    haldi:5, mehndi:6, baraat:7, wedding:8, finale:9
  };
  // There are 10 actual scene elements; HUD intentionally displays 01–09 as a
  // cinematic chapter count while the intro is treated as the prologue.
  let current = 0;
  let pointer = {x:.5,y:.5};
  let unlocked = false;
  let transitionLock = false;

  const state = {
    get name(){ return scenes[current]?.dataset.scene || "intro"; },
    go(target, source="interaction"){
      const next = typeof target === "number" ? target : ROUTES[target];
      if(next == null || next === current || transitionLock) return;
      if(next < 0 || next >= scenes.length) return;
      transitionLock = true;

      const oldScene = scenes[current];
      const newScene = scenes[next];
      oldScene.classList.add("exit");
      newScene.classList.add("active");
      current = next;
      sceneNo.textContent = String(Math.max(1,current)).padStart(2,"0");
      updateProgress();
      resetSceneHooks(newScene);

      window.setTimeout(() => {
        oldScene.classList.remove("active","exit");
        transitionLock = false;
      }, 1150);

      audio.softChime(source === "gesture" ? .7 : 1);
    }
  };

  function buildProgress(){
    scenes.forEach((s,i)=>{
      const b=document.createElement("button");
      b.title=`Go to ${s.dataset.scene}`;
      b.addEventListener("click",()=>state.go(i,"navigation"));
      progress.appendChild(b);
    });
    updateProgress();
  }
  function updateProgress(){
    $$("#progress button").forEach((b,i)=>b.classList.toggle("active",i===current));
  }

  // ---- Pointer / touch interaction ------------------------------------------------
  window.addEventListener("pointermove", e=>{
    pointer.x = e.clientX / innerWidth;
    pointer.y = e.clientY / innerHeight;

    if(state.name === "ganesh"){
      const tx = 50 + (pointer.x-.5)*5;
      const ty = 50 + (pointer.y-.5)*3;
      $(".divine", scenes[current]).style.transform =
        `translate(-50%,-50%) translate(${(pointer.x-.5)*24}px,${(pointer.y-.5)*14}px)`;
      if(orb){
        const near = Math.hypot(pointer.x-.75,pointer.y-.48);
        orb.style.transform = `translate(${(pointer.x-.5)*35}px,${(pointer.y-.5)*25}px)`;
        if(near < .20){
          unlocked = true;
          hint.textContent = "Ganesh Ji has noticed you. Tap the golden light.";
          orb.classList.add("ready");
        }
      }
    }
    parallax(pointer);
  }, {passive:true});

  function parallax(p){
    const active = scenes[current];
    if(!active) return;
    const amount = 10;
    $$(".mountains,.kailash,.kailash-cloud,.city,.mandap,.final-glow",active)
      .forEach((el,i)=>el.style.transform = `${el.dataset.base || ""} translate(${(p.x-.5)*amount*(i%3+1)}px,${(p.y-.5)*amount*.5}px)`);
  }

  orb?.addEventListener("pointerdown", e=>{
    e.stopPropagation();
    if(unlocked) state.go("kailash","gesture");
  });

  window.addEventListener("pointerdown", ()=>{
    if(state.name==="ganesh" && unlocked) state.go("kailash","gesture");
  });

  // ---- Navigation ----------------------------------------------------------------
  $$("[data-go]").forEach(el=>{
    el.addEventListener("click", e=>{
      e.stopPropagation();
      const target=el.dataset.go;
      if(target==="open") $("#invitationShell")?.classList.add("open");
      state.go(target,"button");
    });
  });

  $("#invitationShell")?.addEventListener("click", ()=>{
    $("#invitationShell").classList.add("open");
  });

  $("#replay")?.addEventListener("click", ()=>{
    $("#invitationShell")?.classList.remove("open");
    unlocked=false;
    state.go(0,"navigation");
  });

  // ---- Swipe controller -----------------------------------------------------------
  let startX=0,startY=0,startT=0;
  window.addEventListener("touchstart",e=>{
    const t=e.changedTouches[0]; startX=t.clientX; startY=t.clientY; startT=performance.now();
  },{passive:true});
  window.addEventListener("touchend",e=>{
    const t=e.changedTouches[0], dx=t.clientX-startX, dy=t.clientY-startY;
    const dt=performance.now()-startT;
    if(Math.abs(dx)>65 && Math.abs(dx)>Math.abs(dy)*1.15 && dt<900){
      state.go(current+(dx<0?1:-1),"gesture");
    }
  },{passive:true});

  window.addEventListener("keydown",e=>{
    if(e.key==="ArrowRight" || e.key===" ") state.go(current+1,"keyboard");
    if(e.key==="ArrowLeft") state.go(current-1,"keyboard");
    if(e.key==="Escape") state.go(0,"keyboard");
  });

  // ---- Ambient particles ----------------------------------------------------------
  const canvas=$("#fx"), ctx=canvas.getContext("2d");
  let W=0,H=0,dpr=1;
  const particles=[];
  function resize(){
    dpr=Math.min(devicePixelRatio||1,2); W=innerWidth; H=innerHeight;
    canvas.width=W*dpr; canvas.height=H*dpr; canvas.style.width=W+"px"; canvas.style.height=H+"px";
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  addEventListener("resize",resize); resize();

  for(let i=0;i<95;i++){
    particles.push({
      x:Math.random(),y:Math.random(),r:.4+Math.random()*1.7,
      a:.1+Math.random()*.55,s:.00025+Math.random()*.001,
      phase:Math.random()*Math.PI*2
    });
  }
  function particleLoop(t){
    ctx.clearRect(0,0,W,H);
    const isWedding=["wedding","finale","ganesh","kailash"].includes(state.name);
    for(const p of particles){
      p.y-=p.s;
      if(p.y<-.02){p.y=1.02;p.x=Math.random()}
      const pulse=p.a*(.65+.35*Math.sin(t*.001+p.phase));
      ctx.beginPath(); ctx.arc(p.x*W,p.y*H,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(241,198,104,${isWedding?pulse:pulse*.55})`;
      ctx.fill();
    }
    requestAnimationFrame(particleLoop);
  }
  requestAnimationFrame(particleLoop);

  // ---- Minimal WebAudio: original synthesized ambience/chimes, no external asset -
  const audio = {
    ctx:null, enabled:false,
    init(){
      if(this.ctx) return;
      const C=window.AudioContext||window.webkitAudioContext;
      if(!C) return;
      this.ctx=new C();
      this.enabled=true;
    },
    softChime(scale=1){
      if(!this.enabled || !this.ctx) return;
      const now=this.ctx.currentTime;
      [523.25,659.25,783.99].forEach((f,i)=>{
        const o=this.ctx.createOscillator(), g=this.ctx.createGain();
        o.type="sine"; o.frequency.value=f;
        g.gain.setValueAtTime(0,now+i*.09);
        g.gain.linearRampToValueAtTime(.045*scale,now+i*.09+.02);
        g.gain.exponentialRampToValueAtTime(.0001,now+i*.09+.7);
        o.connect(g).connect(this.ctx.destination); o.start(now+i*.09); o.stop(now+i*.09+.75);
      });
    }
  };
  $("#soundBtn")?.addEventListener("click",()=>{
    audio.init();
    audio.enabled=!audio.enabled;
    $("#soundBtn").textContent=audio.enabled?"♫":"♪";
    if(audio.enabled) audio.softChime(1.2);
  });
  window.addEventListener("pointerdown",()=>audio.init(),{once:true});

  function resetSceneHooks(scene){
    if(scene.dataset.scene==="open") $("#invitationShell")?.classList.remove("open");
    if(scene.dataset.scene==="finale") burst();
  }
  function burst(){
    for(let i=0;i<25;i++) particles.push({
      x:.5,y:.52,r:.5+Math.random()*2,a:.35+Math.random()*.6,
      s:-.0004-Math.random()*.0015,phase:Math.random()*6
    });
  }

  buildProgress();
  // Intro auto breathing cue; never auto-advances so the visitor controls the story.
  document.documentElement.classList.add("ready");
})();