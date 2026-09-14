const scenes=[...document.querySelectorAll(".scene")];
const progress=document.getElementById("progress");
scenes.forEach((_,i)=>{const dot=document.createElement("i");dot.dataset.i=i;progress.appendChild(dot)});
let index=0, unlocked=false;
function show(i){
  index=Math.max(0,Math.min(i,scenes.length-1));
  scenes.forEach((s,n)=>s.classList.toggle("active",n===index));
  [...progress.children].forEach((d,n)=>d.classList.toggle("active",n===index));
  window.scrollTo(0,0);
}
show(0);

const orb=document.getElementById("orb"), hint=document.getElementById("ganeshHint");
let mouseX=.5,mouseY=.5;
window.addEventListener("pointermove",e=>{
  mouseX=e.clientX/innerWidth; mouseY=e.clientY/innerHeight;
  if(index===0){
    const dx=(mouseX-.5)*18, dy=(mouseY-.45)*10;
    document.querySelector(".ganesh").style.transform=`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px))`;
    orb.style.transform=`translate(${(mouseX-.5)*40}px,${(mouseY-.5)*25}px)`;
    if(mouseX>.58 && mouseY>.2 && mouseY<.75){
      hint.textContent="Ganesh Ji has noticed you. Tap the golden light.";
      orb.style.opacity="1"; unlocked=true;
    }
  }
});
window.addEventListener("pointerdown",()=>{
  if(index===0 && unlocked) show(1);
});
document.getElementById("goldenCard").addEventListener("click",()=>show(2));
document.getElementById("openBtn").addEventListener("click",()=>show(3));
document.querySelectorAll(".next").forEach(b=>b.addEventListener("click",()=> {
  const key=b.dataset.next;
  const map={story:4,mehndi:5,baraat:6,wedding:7,finale:8};
  show(map[key] ?? index+1);
}));
document.getElementById("restart").addEventListener("click",()=>{unlocked=false;hint.textContent="Move your pointer toward Ganesh Ji.";show(0)});

let startX=0;
window.addEventListener("touchstart",e=>startX=e.touches[0].clientX,{passive:true});
window.addEventListener("touchend",e=>{
  const dx=e.changedTouches[0].clientX-startX;
  if(Math.abs(dx)>80 && index>3) show(index+(dx<0?1:-1));
},{passive:true});

document.addEventListener("keydown",e=>{
  if(e.key==="ArrowRight"||e.key===" ") show(index+1);
  if(e.key==="ArrowLeft") show(index-1);
});

const petals=document.getElementById("petals");
for(let i=0;i<28;i++){
  const p=document.createElement("span");
  p.style.left=Math.random()*100+"%";
  p.style.animationDelay=(Math.random()*8)+"s";
  p.style.animationDuration=(7+Math.random()*8)+"s";
  petals.appendChild(p);
}
window.addEventListener("load",()=>setTimeout(()=>document.getElementById("loader").classList.add("hide"),700));
