(function(){
  const cv=document.getElementById('bgCanvas');
  const cx=cv.getContext('2d');
  let W,H;
  function resize(){W=cv.width=window.innerWidth;H=cv.height=window.innerHeight;}
  resize();
  window.addEventListener('resize',()=>{resize();init();});
  const mouse={x:W/2,y:H/2};
  window.addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;});
  const rand=(a,b)=>Math.random()*(b-a)+a;

  // Grid
  function drawGrid(){
    cx.strokeStyle='rgba(0,212,255,0.03)';
    cx.lineWidth=1;
    const gs=80;
    cx.beginPath();
    for(let x=0;x<W;x+=gs){cx.moveTo(x,0);cx.lineTo(x,H);}
    for(let y=0;y<H;y+=gs){cx.moveTo(0,y);cx.lineTo(W,y);}
    cx.stroke();
  }

  // Particles
  const PCOUNT=60;
  let pts=[];
  class Pt{
    constructor(){this.reset(true);}
    reset(init){
      this.x=rand(0,W);this.y=init?rand(0,H):H+10;
      this.vx=rand(-0.15,0.15);this.vy=rand(-0.3,-0.1);
      this.r=rand(0.5,2);this.a=rand(0.1,0.4);
    }
    update(){
      const dx=this.x-mouse.x,dy=this.y-mouse.y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<100){this.vx+=(dx/d)*0.02;this.vy+=(dy/d)*0.02;}
      this.vx*=0.99;this.vy*=0.99;
      this.x+=this.vx;this.y+=this.vy;
      if(this.y<-10)this.reset(false);
      if(this.x<-10)this.x=W+10;
      if(this.x>W+10)this.x=-10;
    }
    draw(){
      cx.beginPath();cx.arc(this.x,this.y,this.r,0,Math.PI*2);
      cx.fillStyle='rgba(0,212,255,'+this.a+')';cx.fill();
    }
  }

  // Lines between close particles
  function drawLines(){
    for(let i=0;i<pts.length;i++){
      for(let j=i+1;j<pts.length;j++){
        const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<120){
          cx.beginPath();cx.moveTo(pts[i].x,pts[i].y);cx.lineTo(pts[j].x,pts[j].y);
          cx.strokeStyle='rgba(0,212,255,'+(0.06*(1-d/120))+')';cx.lineWidth=0.5;cx.stroke();
        }
      }
    }
  }

  function init(){
    pts=Array.from({length:PCOUNT},()=>new Pt());
  }
  init();

  function loop(){
    cx.clearRect(0,0,W,H);
    drawGrid();
    drawLines();
    pts.forEach(p=>{p.update();p.draw();});
    requestAnimationFrame(loop);
  }
  loop();
})();
