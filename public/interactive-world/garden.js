// Cached botanical artwork and time-based animation for the living garden.
const fallingLeaves = [], koi = [];
function leaf(c,x,y,size,angle,color,vein=false){
 c.save();c.translate(x,y);c.rotate(angle);c.fillStyle=color;c.beginPath();c.moveTo(-size,0);c.quadraticCurveTo(-size*.1,-size*.7,size,0);c.quadraticCurveTo(0,size*.65,-size,0);c.fill();if(vein)line(c,-size*.7,0,size*.8,0,'#e3e8b43b',.5);c.restore();
}
function tree(x,y,r,pink=false){
 const sprite=document.createElement('canvas');sprite.width=Math.ceil(r*2+90);sprite.height=Math.ceil(r*2+190);const c=sprite.getContext('2d'),ox=r+45,oy=r+110;c.translate(ox,oy);
 ellipse(g,x+30,y+32,r*.94,r*.38,'#17342535');
 const bark=c.createLinearGradient(-12,0,12,0);bark.addColorStop(0,'#3c3c28');bark.addColorStop(.5,'#77704b');bark.addColorStop(1,'#494834');
 c.lineCap='round';line(c,0,23,-8,-71,bark,17);line(c,-7,18,-12,-60,'#9d906045',2);
 function branch(bx,by,len,angle,width,depth){let ex=bx+Math.cos(angle)*len,ey=by+Math.sin(angle)*len;line(c,bx,by,ex,ey,bark,width);line(c,bx-1,by,ex-1,ey,'#b4a07635',Math.max(.5,width*.15));if(depth>0){branch(ex,ey,len*.68,angle-.5,width*.56,depth-1);branch(ex,ey,len*.73,angle+.55,width*.55,depth-1)}}
 branch(-6,-22,r*.48,-2.3,9,3);branch(-8,-39,r*.48,-.7,8,3);branch(-9,-53,r*.38,-1.5,7,3);
 const clusters=[];
 for(let j=0;j<25;j++){let a=j*2.4,d=Math.sqrt(j/25)*r*.79;clusters.push({x:Math.cos(a)*d,y:-84+Math.sin(a)*d*.59,r:r*range(.2,.34)})}
 clusters.sort((a,b)=>a.y-b.y);
 for(const cl of clusters){
  const grad=c.createRadialGradient(cl.x-cl.r*.25,cl.y-cl.r*.3,1,cl.x,cl.y,cl.r);
  grad.addColorStop(0,pink?'#eac1b7':'#8b9c55');grad.addColorStop(1,pink?'#aa6c7a':'#314e37');
  ellipse(c,cl.x,cl.y,cl.r,cl.r*.65,grad);
  for(let i=0;i<150;i++){
   let a=range(0,6.283),d=Math.sqrt(random())*cl.r,px=cl.x+Math.cos(a)*d,py=cl.y+Math.sin(a)*d*.64;
   if(pink){
    const col=['#b9798b','#d89eaa','#efbdc0','#f9d5cc','#ffe6d6'][Math.floor(random()*5)],sz=range(1.4,3.1);
    for(let k=0;k<5;k++){let q=k*1.256;ellipse(c,px+Math.cos(q)*sz*.7,py+Math.sin(q)*sz*.55,sz*.65,sz*.5,col)}ellipse(c,px,py,.45,.4,'#a97957');
    if(i%8===0)leaf(c,px+3,py,2.6,a,'#78845b');
   }else leaf(c,px,py,range(2,5.3),range(-2,2),['#3f643c','#55763c','#709044','#90a357','#aab66c','#bfd087'][Math.floor(random()*6)],i%3===0);
  }
 }
 trees.push({x,y,r,pink,sprite,ox,oy,shake:0,phase:range(0,6.28)});
}
function shakeTree(o){
 o.shake=1;
 const count=reduced?18:100;
 for(let i=0;i<count;i++){
  let a=range(0,6.28),d=Math.sqrt(random())*o.r*.88;
  fallingLeaves.push({x:o.x+Math.cos(a)*d,y:o.y-80+Math.sin(a)*d*.6,ground:o.y+range(-12,62),vx:range(-45,55),vy:range(5,35),spin:range(-3,3),angle:range(0,6.28),size:range(2,5),pink:o.pink,phase:range(0,6.28),age:0,landed:false});
 }
 if(fallingLeaves.length>600)fallingLeaves.splice(0,fallingLeaves.length-600);
 say(o.pink?'A thousand blossoms. One small touch.':'Even the oldest tree has something to let go.');
 document.querySelector('#announcement').textContent=o.pink?'Cherry blossoms falling from the tree.':'Green leaves falling from the tree.';
}
function drawLivingTrees(dt){
 const layers=trees.map(o=>({y:o.y+25,draw(){o.shake=Math.max(0,o.shake-dt*.65);const sway=reduced?0:Math.sin(t*.8+o.phase)*.65+Math.sin(t*32)*o.shake*4;ctx.save();ctx.translate(o.x,o.y);ctx.rotate(sway*.004);ctx.drawImage(o.sprite,-o.ox,-o.oy);ctx.restore()}}));
 layers.push({y:player.y+14,draw(){samurai(ctx,player.x,player.y,player.angle,player.moving?player.walk:0)}});layers.sort((a,b)=>a.y-b.y);for(const layer of layers)layer.draw();
}
function drawLeaves(dt){
 for(let i=fallingLeaves.length-1;i>=0;i--){const p=fallingLeaves[i];p.age+=dt;if(p.age>14){fallingLeaves.splice(i,1);continue}
  if(!p.landed){p.vy=Math.min(32,p.vy+dt*6);p.x+=(p.vx*Math.exp(-p.age*.7)+Math.sin(t*2+p.phase)*15)*dt;p.y+=p.vy*dt;p.angle+=p.spin*dt;if(p.y>=p.ground){p.y=p.ground;p.landed=true}}
  ctx.save();ctx.globalAlpha=Math.min(1,(14-p.age)/3);ctx.translate(p.x,p.y);ctx.scale(1,p.landed?.4:Math.max(.25,Math.abs(Math.cos(p.age*2+p.phase))));leaf(ctx,0,0,p.size,p.angle,p.pink?'#f0c2c6':'#91ab5d',!p.pink);ctx.restore();
 }
}
function drawBridge(c){
 const point=(u,v)=>[453+142*u,520+26*u+48*v-Math.sin(u*Math.PI)*21];
 ellipse(c,516,578,83,17,'#183c3d45');
 const rail=(v,h,color,width)=>{c.beginPath();for(let i=0;i<=30;i++){let p=point(i/30,v);if(i===0)c.moveTo(p[0],p[1]-h);else c.lineTo(p[0],p[1]-h)}c.strokeStyle=color;c.lineWidth=width;c.stroke()};
 rail(0,27,'#5e4233',5);
 for(let u of [0,.34,.68,1]){let p=point(u,0);line(c,p[0],p[1]+8,p[0],p[1]-30,'#80583b',5);ellipse(c,p[0],p[1]-30,4,2,'#b18c5b')}
 for(let i=0;i<19;i++){let a=i/19,b=(i+.93)/19;poly(c,[point(a,0),point(b,0),point(b,1),point(a,1)],['#a28053','#b09364','#94774e'][i%3]);for(let j=1;j<4;j++){const p=point(a+.017,j/4),q=point(b-.01,j/4);line(c,...p,...q,'#d4bb833f',.6)}let nail=point(a+.02,.12);ellipse(c,...nail,.7,.7,'#4d4735')}
 rail(1,-6,'#5e4934',8);rail(1,-2,'#b29462',2);
 for(let u of [0,.34,.68,1]){let p=point(u,1);line(c,p[0],p[1]+9,p[0],p[1]-26,'#6c4a34',5);line(c,p[0]-1,p[1]+5,p[0]-1,p[1]-27,'#b59360',1.5);ellipse(c,p[0],p[1]-27,4,2,'#c2a573')}
 rail(1,25,'#694a35',6);rail(1,27,'#bd9c66',2);rail(0,28,'#bd9c66',1.5);
}
function updateKoi(dt){
 if(!koi.length)for(let i=0;i<6;i++){let a=i*1.047;koi.push({x:342+Math.cos(a)*100,y:535+Math.sin(a)*65,angle:a+1.57,speed:13+i*1.6,phase:i*2.1,id:i})}
 for(const f of koi){
  let nx=(f.x-342)/160,ny=(f.y-535)/99,edge=Math.hypot(nx,ny),turn=Math.sin(t*.32+f.phase)*.22;
  if(edge>.76){let desired=Math.atan2(535-f.y,342-f.x),diff=Math.atan2(Math.sin(desired-f.angle),Math.cos(desired-f.angle));turn+=diff*Math.min(2,(edge-.76)*7)}
  for(const o of koi){if(o===f)continue;let dx=f.x-o.x,dy=f.y-o.y,d=Math.hypot(dx,dy);if(d<28&&d>0){let away=Math.atan2(dy,dx);turn+=Math.atan2(Math.sin(away-f.angle),Math.cos(away-f.angle))*(1-d/28)*.45}}
  f.angle+=Math.max(-.9,Math.min(.9,turn))*dt;const pace=f.speed*(.8+.2*Math.sin(t*.8+f.phase));f.x+=Math.cos(f.angle)*pace*dt;f.y+=Math.sin(f.angle)*pace*dt;
  if(edge>1.12){f.x=342+nx/edge*159;f.y=535+ny/edge*98}
  drawKoi(f,pace);
 }
}
function drawKoi(f,speed){
 ctx.save();ctx.translate(f.x,f.y);ctx.rotate(f.angle);ctx.scale(1,.84);const tail=Math.sin(t*(3+speed*.06)+f.phase),bend=tail*2;
 ellipse(ctx,2,7,20,6,'#173f4130');ctx.globalAlpha=.84;
 // Fins move independently of the body's slow, continuous turn.
 poly(ctx,[[3,-3],[-5,-12-tail],[-10,-7],[-4,-2]],'#dddcc084');poly(ctx,[[3,3],[-5,12+tail],[-10,7],[-4,2]],'#dddcc084');
 ctx.fillStyle=f.id%3===0?'#dfb568':'#d5d7bf';ctx.beginPath();ctx.moveTo(18,0);ctx.bezierCurveTo(14,-7,0,-9,-12,-3);ctx.quadraticCurveTo(-17,bend,-22,bend*2);ctx.lineTo(-22,3+bend*2);ctx.quadraticCurveTo(-17,bend,-12,3);ctx.bezierCurveTo(0,9,14,7,18,0);ctx.fill();
 ctx.save();ctx.beginPath();ctx.ellipse(1,0,15,6,0,0,Math.PI*2);ctx.clip();for(let j=0;j<3;j++){let px=10-j*10;ellipse(ctx,px,Math.sin(f.id+j)*3,3.8,4.5,f.id===4?'#333f39':f.id%3===0?'#eee1b0':'#b86243')}ctx.restore();
 ctx.fillStyle='#d3d9bd90';ctx.beginPath();ctx.moveTo(-19,bend);ctx.quadraticCurveTo(-28,-9+tail*5,-33,-7+tail*7);ctx.lineTo(-28,tail*6);ctx.lineTo(-32,8+tail*7);ctx.quadraticCurveTo(-25,7+tail*5,-19,bend+3);ctx.fill();
 line(ctx,-22,bend+1,-29,tail*6,'#e6dfbc70',.6);ellipse(ctx,12,-3.4,.85,.8,'#23342d');ellipse(ctx,12,3.4,.85,.8,'#23342d');line(ctx,7,-4,5,-2,'#817e5e80',.6);line(ctx,7,4,5,2,'#817e5e80',.6);line(ctx,12,-1,15,-1,'#fff7d170',1);
 ctx.restore();
}
function detailHouse(){
 // Layered roof tiles, subtle timber grain, brass door handles and porch joinery.
 for(let row=0;row<7;row++){let v=(row+1)/8,y=111+v*92,left=1021-160*v,right=1021+168*v;line(g,left,y,right,y,'#a0aea132',1);for(let x=left+10;x<right;x+=20)line(g,x,y-9,x+2,y,'#263e3d55',1)}
 for(let i=0;i<140;i++){let x=range(866,1184),y=range(335,367);line(g,x,y,Math.min(1185,x+range(5,24)),y+.3,'#c9b38b25',.6)}
 for(let x of [870,1013,1161])for(let i=0;i<8;i++)line(g,x+range(-3,3),238+i*12,x+range(-3,3),247+i*12,'#c0a07838',.7);
 for(let x of [990,1042]){ellipse(g,x,272,2.6,6,'#64583f');ellipse(g,x-1,271,1.2,4,'#bbab73')}
 for(let x=883;x<1164;x+=28){line(g,x,332,x,365,'#493e3255',1);ellipse(g,x,338,1,1,'#37362b')}
 for(let i=0;i<100;i++){let x=range(890,1143),y=range(214,316);if(x<1001||x>1032)line(g,x,y,x+range(1,5),y,'#fff6d41a',.5)}
}
function samurai(c,x,y,angle,walk,opacity=1,ghost=false){
 c.save();c.translate(x,y);c.globalAlpha=opacity;const face=Math.cos(angle)>=0?1:-1,bob=Math.sin(walk*2)*.7;c.scale(1.16,1.16);ellipse(c,3,11,21,7,'#13242755');c.translate(0,bob);c.scale(face,1);
 const steel=ghost?'#b6dad7':'#202e33',edge=ghost?'#e0ece4':'#728180',red=ghost?'#c2ded4':'#8f3031',gold='#bca367';
 // Armoured shin guards and split hakama.
 for(let side of [-1,1]){let step=Math.sin(walk)*4*side;poly(c,[[side*3,-5],[side*13,-3],[side*11+step,11],[side*4+step,10]],'#1b272c');line(c,side*8+step,1,side*8+step,11,edge,3);for(let k=0;k<3;k++)line(c,side*5+step,3+k*3,side*11+step,3+k*3,'#34494c',1);line(c,side*7+step,13,side*13+step,13,'#29261f',5)}
 // Scabbard, armoured torso, overlapping lacquer plates.
 line(c,-12,-15,-25,17,'#272829',4);line(c,-13,-14,-24,16,gold,.7);
 poly(c,[[-12,-35],[11,-35],[15,-12],[12,3],[-15,2],[-13,-17]],steel);poly(c,[[-9,-33],[9,-33],[10,-17],[-9,-17]],'#3c4849');
 for(let row=0;row<5;row++){const y=-26+row*5;line(c,-11,y,12,y,edge,1.2);for(let col=-8;col<=9;col+=5)line(c,col,y-2,col,y+2,red,1)}
 for(let side of [-1,1]){poly(c,[[side*10,-35],[side*22,-29],[side*21,-19],[side*12,-22]],steel);for(let k=0;k<3;k++)line(c,side*12,-30+k*4,side*21,-26+k*4,edge,1);poly(c,[[side*2,-10],[side*15,-10],[side*18,3],[side*4,2]],steel);for(let k=0;k<3;k++)line(c,side*4,-8+k*4,side*15,-7+k*4,edge,1)}
 line(c,-12,-12,13,-12,red,4);ellipse(c,2,-12,3,2,gold);
 // Flowing crimson sash.
 poly(c,[[-7,-34],[-24,-31],[-40-Math.sin(t*5)*5,-38],[-32,-27],[-18,-25]],red);line(c,-12,-32,-30,-32,'#d0786140',1);
 // Menpo mask and angular kabuto helmet, with a gold crescent crest.
 ellipse(c,0,-40,9,10,'#b39b7d');poly(c,[[-9,-41],[9,-41],[8,-32],[0,-29],[-8,-33]],'#353235');line(c,-5,-36,5,-36,'#bf7864',1);line(c,-5,-34,-2,-32,'#d4c6a9',1);line(c,3,-34,5,-32,'#d4c6a9',1);
 poly(c,[[-13,-44],[-9,-55],[0,-61],[10,-54],[14,-43]],steel);poly(c,[[-18,-44],[17,-44],[12,-39],[-12,-39]],'#26373b');line(c,0,-59,0,-46,edge,1.5);line(c,-8,-53,-10,-46,edge,1);line(c,8,-53,10,-46,edge,1);
 c.strokeStyle=gold;c.lineWidth=2.4;c.beginPath();c.arc(0,-60,12,.08,Math.PI-.08);c.stroke();line(c,-12,-58,-15,-65,gold,2);line(c,12,-58,15,-65,gold,2);
 // Glinting katana held forward in a ready stance.
 line(c,18,-24,24,-15,steel,7);ellipse(c,25,-16,3,3,'#8c7963');line(c,25,-17,33,-27,'#302d2b',4);for(let i=0;i<4;i++)line(c,26+i*1.6,-19-i*2,29+i*1.6,-17-i*2,'#c6bba0',.8);line(c,29,-29,37,-23,gold,3);
 c.beginPath();c.moveTo(34,-27);c.quadraticCurveTo(51,-42,61,-64);c.quadraticCurveTo(56,-43,37,-24);c.closePath();c.fillStyle=ghost?'#fff':'#d8e4e2';c.fill();c.strokeStyle='#769397';c.lineWidth=.7;c.stroke();line(c,36,-27,51,-44,'#fffef0',1);if(!ghost&&Math.sin(t*1.7)>.94){line(c,48,-46,55,-46,'#fff',1);line(c,52,-50,52,-42,'#fff',1)}
 c.restore();
}

'use strict';
// A hand-painted canvas garden. All art is generated locally; no remote assets.
const canvas=document.querySelector('#scene'),ctx=canvas.getContext('2d');
const W=1440,H=810,terrain=document.createElement('canvas');terrain.width=W;terrain.height=H;const g=terrain.getContext('2d');
let seed=3419;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296},range=(a,b)=>a+random()*(b-a);
const trees=[],petals=[],ripples=[],trails=[],sparks=[];let night=false,muted=true,audio,noiseNode,volume,last=0,t=0,steps=0,dashCount=0,flash=0,whisperTimer;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const player={x:735,y:535,tx:735,ty:535,angle:-.8,walk:0,moving:false,dash:null};
const pointer={x:735,y:535,visible:false};const keys=new Set();
function ellipse(c,x,y,rx,ry,color){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill()}
function poly(c,points,color,stroke){c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();c.fillStyle=color;c.fill();if(stroke){c.strokeStyle=stroke;c.stroke()}}
function line(c,x,y,x2,y2,color,width=1){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(x,y);c.lineTo(x2,y2);c.stroke()}
function stone(x,y,r){ellipse(g,x+5,y+7,r*1.1,r*.65,'#253e2638');poly(g,[[x-r,y],[x-r*.65,y-r*.5],[x+r*.35,y-r*.68],[x+r,y-r*.1],[x+r*.7,y+r*.4],[x-r*.5,y+r*.5]],'#979c81');line(g,x-r*.65,y-r*.4,x+r*.3,y-r*.57,'#c6c5a9',2);line(g,x-r*.5,y+r*.5,x+r*.7,y+r*.4,'#687962',2)}
function pondContains(x,y){return ((x-342)/198)**2+((y-535)/137)**2<1}
function grass(x,y,n=7){for(let i=0;i<n;i++){let len=range(5,16),dx=range(-7,7);line(g,x+range(-7,7),y,x+dx,y-len,['#718b4d','#a5af64','#436d42','#86934d'][Math.floor(random()*4)],range(.5,1.5))}}
function shrub(x,y,r,color){ellipse(g,x+10,y+12,r*1.2,r*.7,'#263e2840');for(let j=0;j<45;j++){let a=range(0,Math.PI*2),d=Math.sqrt(random())*r;ellipse(g,x+Math.cos(a)*d,y+Math.sin(a)*d*.7,range(4,13),range(3,8),color[Math.floor(random()*color.length)])}}
function lantern(x,y){ellipse(g,x+7,y+10,19,8,'#263b2940');poly(g,[[x-14,y+4],[x+14,y+4],[x+10,y-3],[x-10,y-3]],'#a9aa8a');g.fillStyle='#979d7e';g.fillRect(x-5,y-24,10,25);poly(g,[[x-13,y-25],[x+13,y-25],[x+11,y-45],[x-11,y-45]],'#b4b697');g.fillStyle='#e9c575';g.fillRect(x-6,y-41,12,12);poly(g,[[x-22,y-45],[x,y-62],[x+22,y-45]],'#858e72');ellipse(g,x,y-61,4,5,'#b6b99d')}
function house(){
 ellipse(g,1050,315,259,105,'#25372a55');
 poly(g,[[838,198],[1201,198],[1234,382],[862,382]],'#7b7156');
 for(let y=211;y<383;y+=10)line(g,850,y,1228,y,'#988369',1);
 poly(g,[[866,165],[1188,165],[1188,333],[866,333]],'#5a4636');
 g.fillStyle='#e6d5a8';g.fillRect(888,205,113,116);g.fillRect(1031,205,113,116);
 for(let x=889;x<1148;x+=28)line(g,x,205,x,321,'#8d7251',3);
 for(let y=207;y<320;y+=28)line(g,888,y,1146,y,'#967f5b',2);
 g.fillStyle='#523e30';g.fillRect(1002,200,25,130);g.fillRect(865,197,14,145);g.fillRect(1155,197,14,145);
 poly(g,[[826,204],[878,111],[1157,111],[1230,204]],'#394f4e');
 poly(g,[[815,202],[1021,69],[1242,202],[1186,223],[1021,113],[868,220]],'#536564');
 for(let i=0;i<16;i++){let x=850+i*22;line(g,1021+(x-1021)*.23,108,x,203,'#72827a',3);line(g,1023+(x-1021)*.23,109,x+3,203,'#354b49',2)}
 poly(g,[[811,202],[864,215],[1021,101],[1191,216],[1248,202],[1246,214],[1186,231],[1021,120],[869,230],[815,215]],'#334b49');
 line(g,1021,71,1021,109,'#a9aa87',7);line(g,999,78,1043,78,'#62756d',7);
 for(let x of [870,1161]){g.fillStyle='#443d30';g.fillRect(x,234,9,116)}
 poly(g,[[953,383],[1105,383],[1118,398],[942,398]],'#b4a486');poly(g,[[965,368],[1095,368],[1105,383],[953,383]],'#c5b18a');
 ellipse(g,1193,333,21,10,'#453b2c');g.fillStyle='#796449';g.fillRect(1176,307,33,24);shrub(1194,301,22,['#566a3b','#718349','#8e9b58']);
}
function paintGarden(){
 g.fillStyle='#738351';g.fillRect(0,0,W,H);
 for(let i=0;i<17000;i++){let x=range(0,W),y=range(0,H);ellipse(g,x,y,range(1,5),range(.6,2),['#82915a','#6d844f','#8b965d','#637c4b','#99a368'][Math.floor(random()*5)])}
 // Winding gravel path, with thousands of tiny stones.
 g.lineCap='round';g.strokeStyle='#afb397';g.lineWidth=92;g.beginPath();g.moveTo(650,850);g.bezierCurveTo(650,659,960,647,881,479);g.quadraticCurveTo(848,423,1018,376);g.stroke();
 for(let i=0;i<3200;i++){let y=range(390,810),x=range(590,1065);let center=y>650?650+(810-y)*.98:y>480?890+(y-550)*.24:1000-(y-390)*1.5;if(Math.abs(x-center)<range(25,50))ellipse(g,x,y,range(.5,2),range(.5,1.2),random()>.5?'#d8d4b6':'#909b7b')}
 // Pond with irregular rocky shore.
 ellipse(g,343,544,215,151,'#485e3d');const water=g.createRadialGradient(290,478,12,341,534,205);water.addColorStop(0,'#659a88');water.addColorStop(.58,'#477d73');water.addColorStop(1,'#234c50');ellipse(g,341,534,198,137,water);for(let i=0;i<600;i++){let x=range(150,535),y=range(400,675);if(pondContains(x,y))ellipse(g,x,y,range(.5,2),range(.4,1.4),['#bed4ad16','#173a3d16','#d7d9a01a'][i%3])}
 for(let i=0;i<43;i++){let a=i/43*Math.PI*2;stone(342+Math.cos(a)*201,535+Math.sin(a)*138,range(8,20))}
 for(let i=0;i<23;i++){let x=range(205,440),y=range(455,590);if(random()>.3){ellipse(g,x,y,range(8,15),range(4,8),'#748b48');line(g,x,y,x+7,y-2,'#b1b576',1)}}
 // Boundary bamboo fence.
 for(let x=30;x<W;x+=20){line(g,x,0,x,96+Math.sin(x*.005)*18,'#57674a',5);line(g,x+2,0,x+2,91+Math.sin(x*.005)*18,'#9aa16b',2)}line(g,0,53,W,53,'#8c9062',6);
 for(let i=0;i<240;i++){let x=range(0,W),y=range(0,H);if(!pondContains(x,y)&&!(x>810&&y<405))grass(x,y,5)}
 for(let p of [[113,333,48],[139,679,54],[567,158,47],[1232,588,57],[1376,401,76],[1144,722,37],[65,468,43]])shrub(...p,['#4b6a3b','#638043','#7a8e4d','#95a05b']);
 for(let i=0;i<280;i++){let side=random()>.5,x=side?range(1170,1400):range(20,170),y=range(100,770);let color=['#f2e7bd','#dfbf88','#c7c99a','#d9a19c'][Math.floor(random()*4)];line(g,x,y,x,y-6,'#6d7c47',1);ellipse(g,x,y-6,2.5,1.8,color)}
 for(let p of [[689,674,27],[754,625,24],[812,572,24],[840,507,23],[900,440,22]])stone(...p);
 house(); detailHouse();
 lantern(720,328);lantern(1187,470);lantern(603,696);
 tree(183,268,108,true);tree(560,168,91);tree(1303,297,112,true);tree(74,790,145);tree(1398,791,165);tree(1022,809,71,true);
 // Raked sand and a small meditation rock.
 for(let i=0;i<6;i++){g.strokeStyle='#aeb28a55';g.lineWidth=2;g.beginPath();g.ellipse(630,382,51+i*8,23+i*4,-.2,0,Math.PI*2);g.stroke()}stone(630,380,30);
 // Fallen blossoms.
 for(let i=0;i<320;i++){let x=range(50,1400),y=range(230,810);if((x<290||x>1200||y>740)&&!pondContains(x,y))ellipse(g,x,y,2,1,['#e8c4b4','#e5b4ac','#eccbb9'][Math.floor(random()*3)])}
 // Warm afternoon light.
 const light=g.createLinearGradient(0,0,W,H);light.addColorStop(0,'#fff2b51b');light.addColorStop(.5,'#ffffff00');light.addColorStop(1,'#1f40202b');g.fillStyle=light;g.fillRect(0,0,W,H);
}
paintGarden();for(let i=0;i<35;i++)petals.push({x:range(0,W),y:range(0,H),z:range(.6,1.8),phase:range(0,6.28)});
function safe(x,y){x=Math.max(35,Math.min(W-35,x));y=Math.max(130,Math.min(H-30,y));if(x>805&&x<1250&&y<410)y=419;if(pondContains(x,y)){let a=Math.atan2((y-535)/137,(x-342)/198);x=342+Math.cos(a)*215;y=535+Math.sin(a)*154}return{x,y}}
function target(e){const rect=canvas.getBoundingClientRect();return safe((e.clientX-rect.left)/rect.width*W,(e.clientY-rect.top)/rect.height*H)}
function say(text){clearTimeout(whisperTimer);document.querySelector('#whisper').textContent=text;document.querySelector('#whisper').style.opacity=1;whisperTimer=setTimeout(()=>document.querySelector('#whisper').style.opacity=.0,3800)}
function dash(p){player.dash={sx:player.x,sy:player.y,x:p.x,y:p.y,age:0};player.tx=p.x;player.ty=p.y;player.angle=Math.atan2(p.y-player.y,p.x-player.x);dashCount++;flash=.1;ripples.push({x:p.x,y:p.y,age:0});if(!reduced)for(let i=0;i<9;i++)trails.push({x:player.x+(p.x-player.x)*i/9,y:player.y+(p.y-player.y)*i/9,angle:player.angle,life:.3+i*.012});for(let i=0;i<22;i++)sparks.push({x:p.x,y:p.y,vx:range(-160,160),vy:range(-100,100),life:range(.2,.7)});if(dashCount===1)say('A little less walking. A little more wind.');else if(dashCount%6===0)say(['The koi are trying to keep up.','Leave only a breeze behind.','Fast feet. Quiet mind.'][Math.floor(random()*3)]);playDash();document.querySelector('#announcement').textContent='Dashed to your chosen spot.'}
canvas.addEventListener('pointermove',e=>{const p=target(e);pointer.x=p.x;pointer.y=p.y;pointer.visible=true;if(!player.dash){player.tx=p.x;player.ty=p.y}});canvas.addEventListener('pointerleave',()=>{pointer.visible=false;player.tx=player.x;player.ty=player.y});canvas.addEventListener('pointerdown',e=>{e.preventDefault();canvas.focus({preventScroll:true});const r=canvas.getBoundingClientRect();const point={x:(e.clientX-r.left)/r.width*W,y:(e.clientY-r.top)/r.height*H};const hit=trees.slice().reverse().find(o=>((point.x-o.x)/o.r)**2+((point.y-(o.y-80))/(o.r*.68))**2<1);if(hit){shakeTree(hit);player.tx=player.x;player.ty=player.y}else dash(target(e))});
canvas.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)){e.preventDefault();keys.add(e.key);if(e.key===' '&&!e.repeat)dash(safe(player.x+Math.cos(player.angle)*160,player.y+Math.sin(player.angle)*160))}});window.addEventListener('keyup',e=>keys.delete(e.key));canvas.addEventListener('blur',()=>keys.clear());
function draw(dt){t+=dt;ctx.clearRect(0,0,canvas.width,canvas.height);ctx.save();ctx.scale(canvas.width/W,canvas.height/H);ctx.drawImage(terrain,0,0);
 updateKoi(dt); drawBridge(ctx);
 for(let i=0;i<5;i++){let phase=(t*.17+i*.2)%1;ctx.strokeStyle=`rgba(197,222,186,${(1-phase)*.2})`;ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(265+i*36,490+i*24,10+phase*33,4+phase*10,0,0,Math.PI*2);ctx.stroke()}
 if(player.dash){const d=player.dash;d.age+=dt;let a=Math.min(1,d.age/(reduced?.08:.19)),e=1-Math.pow(1-a,3);player.x=d.sx+(d.x-d.sx)*e;player.y=d.sy+(d.y-d.sy)*e;if(a>=1)player.dash=null}
 else{let kx=(keys.has('ArrowRight')?1:0)-(keys.has('ArrowLeft')?1:0),ky=(keys.has('ArrowDown')?1:0)-(keys.has('ArrowUp')?1:0);if(kx||ky){const p=safe(player.x+kx*80,player.y+ky*80);player.tx=p.x;player.ty=p.y}let dx=player.tx-player.x,dy=player.ty-player.y,d=Math.hypot(dx,dy);player.moving=d>5;if(d>5){let speed=Math.min(d,125*dt),p=safe(player.x+dx/d*speed,player.y+dy/d*speed);player.x=p.x;player.y=p.y;player.angle=Math.atan2(dy,dx);player.walk+=dt*10;steps+=dt;if(steps>.23){steps=0;ripples.push({x:player.x,y:player.y+11,age:.5,foot:true})}}}
 for(let i=trails.length-1;i>=0;i--){let p=trails[i];p.life-=dt;if(p.life<=0){trails.splice(i,1);continue}samurai(ctx,p.x,p.y,p.angle,0,p.life*.7,true)}
 if(pointer.visible){ctx.strokeStyle='#f4efd38a';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(pointer.x,pointer.y,8,4,0,0,Math.PI*2);ctx.stroke();ellipse(ctx,pointer.x,pointer.y,1.5,1,'#fff4cf')}
 for(let i=ripples.length-1;i>=0;i--){const p=ripples[i];p.age+=dt;if(p.age>1){ripples.splice(i,1);continue}ctx.strokeStyle=`rgba(245,241,191,${(1-p.age)*(p.foot?.16:.8)})`;ctx.lineWidth=p.foot?1:2;ctx.beginPath();ctx.ellipse(p.x,p.y,4+p.age*(p.foot?16:50),2+p.age*(p.foot?6:20),0,0,Math.PI*2);ctx.stroke()}
 drawLivingTrees(dt);
 drawLeaves(dt);
 for(let i=sparks.length-1;i>=0;i--){let p=sparks[i];p.life-=dt;if(p.life<=0){sparks.splice(i,1);continue}p.x+=p.vx*dt;p.y+=p.vy*dt;line(ctx,p.x,p.y,p.x-p.vx*.025,p.y-p.vy*.025,`rgba(250,245,194,${p.life})`,2)}
 for(let p of petals){if(!reduced){p.x+=dt*(10+p.z*8);p.y+=dt*(7+p.z*6);if(p.x>W+15)p.x=-15;if(p.y>H+15)p.y=-15}ctx.save();ctx.translate(p.x+Math.sin(t*.7+p.phase)*12,p.y);ctx.rotate(Math.sin(t+p.phase));ellipse(ctx,0,0,3*p.z,1.4*p.z,'#f2c7b8b0');ctx.restore()}
 if(night){ctx.fillStyle='#12273e88';ctx.fillRect(0,0,W,H);for(let [x,y]of [[720,291],[1187,433],[603,659],[945,262],[1086,262]]){let l=ctx.createRadialGradient(x,y,0,x,y,75);l.addColorStop(0,'#ffd18b60');l.addColorStop(1,'#ffc27100');ctx.fillStyle=l;ctx.fillRect(x-75,y-75,150,150)}for(let i=0;i<20;i++)ellipse(ctx,180+i*54+Math.sin(t*.3+i)*30,390+Math.sin(t*.24+i*5)*200,1.6,1.6,`rgba(242,232,152,${.25+(Math.sin(t*1.8+i)+1)*.3})`)}
 const vig=ctx.createRadialGradient(W/2,H/2,H*.2,W/2,H/2,W*.65);vig.addColorStop(0,'#142e1600');vig.addColorStop(1,'#122a2240');ctx.fillStyle=vig;ctx.fillRect(0,0,W,H);if(flash>0&&!reduced){ctx.fillStyle=`rgba(255,250,213,${flash})`;ctx.fillRect(0,0,W,H);flash=Math.max(0,flash-dt*.8)}ctx.restore()}
function loop(now){const dt=Math.min(.035,(now-last)/1000||.016);last=now;draw(dt);requestAnimationFrame(loop)}
function resize(){const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d)}new ResizeObserver(resize).observe(canvas);resize();requestAnimationFrame(loop);
document.querySelector('#theme').onclick=()=>{night=!night;document.body.classList.toggle('evening',night);document.querySelector('#theme').innerHTML=night?'◑ <span>Evening</span>':'◐ <span>Daylight</span>';document.querySelector('#theme').setAttribute('aria-label',night?'Switch to daylight':'Switch to evening');document.querySelector('#season').textContent=night?'Late spring · 19:26':'Late spring · 16:42';say(night?'The lanterns are on. You can stay.':'The afternoon belongs to no one.')};
document.querySelector('#reset').onclick=()=>{player.x=735;player.y=535;player.tx=735;player.ty=535;player.dash=null;player.moving=false;trails.length=0;ripples.length=0;sparks.length=0;fallingLeaves.length=0;trees.forEach(o=>o.shake=0);dashCount=0;say('Even a warrior needs a quiet afternoon.')};
function startAudio(){audio=new(window.AudioContext||window.webkitAudioContext)();const buffer=audio.createBuffer(1,audio.sampleRate*3,audio.sampleRate),data=buffer.getChannelData(0);let prev=0;for(let i=0;i<data.length;i++){prev=(prev+Math.random()*.04-.02)/1.02;data[i]=prev}noiseNode=audio.createBufferSource();noiseNode.buffer=buffer;noiseNode.loop=true;const filter=audio.createBiquadFilter();filter.type='lowpass';filter.frequency.value=900;volume=audio.createGain();volume.gain.value=.35;noiseNode.connect(filter).connect(volume).connect(audio.destination);noiseNode.start()}
function playDash(){if(muted||!audio)return;const o=audio.createOscillator(),v=audio.createGain();o.type='sine';o.frequency.setValueAtTime(600,audio.currentTime);o.frequency.exponentialRampToValueAtTime(70,audio.currentTime+.18);v.gain.setValueAtTime(.07,audio.currentTime);v.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.2);o.connect(v).connect(audio.destination);o.start();o.stop(audio.currentTime+.21)}
document.querySelector('#sound').onclick=async()=>{try{if(!audio)startAudio();if(audio.state==='suspended')await audio.resume();muted=!muted;volume.gain.setTargetAtTime(muted?0:.35,audio.currentTime,.3);document.querySelector('#sound').setAttribute('aria-pressed',String(!muted));document.querySelector('#sound').setAttribute('aria-label',muted?'Enable garden sounds':'Mute garden sounds');document.querySelector('#soundpath').setAttribute('d',muted?'m16 9 6 6m0-6-6 6':'M15 8c3 2 3 6 0 8m3-11c5 4 5 10 0 14')}catch{say('Sound is unavailable in this browser.')}};
whisperTimer=setTimeout(()=>document.querySelector('#whisper').style.opacity=0,6500);
