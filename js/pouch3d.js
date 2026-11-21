import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const W=1, H=1.5;
function pouchGeo(side){
  const g=new THREE.PlaneGeometry(W,H,40,60);const p=g.attributes.position;
  for(let i=0;i<p.count;i++){
    let x=p.getX(i),y=p.getY(i);const nx=x/(W/2),ny=(y+H/2)/H;
    let fx=Math.pow(Math.max(0,Math.cos(nx*Math.PI/2)),.55);
    let fy=1; if(ny>.9)fy=0; else if(ny>.78)fy=Math.pow(1-(ny-.78)/.12,1.6); if(ny<.06)fy*=ny/.06;
    const depth=.085*(1+.55*(1-ny));
    const z=depth*fx*Math.sqrt(Math.max(0,fy));
    x*=1-.035*fx*fy; // pinch inward where it bulges
    // subtle wrinkles
    const wr=.0025*Math.sin(nx*17+ny*9)*Math.sin(ny*23)*fx;
    if(side==='back'){p.setXYZ(i,-x,y,-(z+wr))}else p.setXYZ(i,x,y,z+wr);
  }
  g.computeVertexNormals();return g;
}
function sealGeo(){ // crimped top seal strip
  const g=new THREE.BoxGeometry(W*.995,H*.095,.006,60,1,1);const p=g.attributes.position;
  for(let i=0;i<p.count;i++){p.setZ(i,p.getZ(i)+Math.sin(p.getX(i)*260)*.0012)}g.computeVertexNormals();g.translate(0,H/2-H*.0475,0);return g;
}
let shadowTex;
function getShadowTex(){if(shadowTex)return shadowTex;const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');const gr=x.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,'rgba(43,29,20,.55)');gr.addColorStop(.5,'rgba(43,29,20,.18)');gr.addColorStop(1,'rgba(43,29,20,0)');x.fillStyle=gr;x.fillRect(0,0,128,128);shadowTex=new THREE.CanvasTexture(c);return shadowTex}

const loader=new THREE.TextureLoader();
export function loadTex(url,renderer){return new Promise(res=>loader.load(url,t=>{t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=renderer.capabilities.getMaxAnisotropy();res(t)},undefined,()=>res(null)))}

export function makePouch(front,back,color){
  const grp=new THREE.Group();const body=new THREE.Group();grp.add(body);
  const mat=(map)=>new THREE.MeshPhysicalMaterial({map,roughness:.52,metalness:0,clearcoat:.18,clearcoatRoughness:.6,});
  const f=new THREE.Mesh(pouchGeo('front'),mat(front));const b=new THREE.Mesh(pouchGeo('back'),mat(back));
  const seal=new THREE.Mesh(sealGeo(),new THREE.MeshPhysicalMaterial({color:new THREE.Color(color).multiplyScalar(.92),roughness:.45,clearcoat:.3}));
  body.add(f,b,seal);
  const sh=new THREE.Mesh(new THREE.PlaneGeometry(1.5,.5),new THREE.MeshBasicMaterial({map:getShadowTex(),transparent:true,depthWrite:false,fog:false}));
  sh.rotation.x=-Math.PI/2;sh.position.y=-H/2-.32;grp.add(sh);grp.userData={body,shadow:sh};
  return grp;
}
export function makeRenderer(canvas){
  const r=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'});
  r.setPixelRatio(Math.min(2,window.devicePixelRatio||1));r.outputColorSpace=THREE.SRGBColorSpace;r.toneMapping=THREE.NoToneMapping;
  return r;
}
export function lightScene(scene,renderer){
  const pm=new THREE.PMREMGenerator(renderer);scene.environment=pm.fromScene(new RoomEnvironment(),.04).texture;scene.environmentIntensity=.25;
  scene.add(new THREE.HemisphereLight(0xfff6ea,0x6b4a35,.55));
  const k=new THREE.DirectionalLight(0xfff1de,1.35);k.position.set(2.5,3.5,4);scene.add(k);
  const rim=new THREE.DirectionalLight(0xffd9a8,.9);rim.position.set(-3,1.5,-2.5);scene.add(rim);
}
export {THREE,H};

/* ---------- HERO CAROUSEL ---------- */
export async function hero(opts){
  const {canvas,products,onActive,onProgress,onOpen}=opts;
  const renderer=makeRenderer(canvas);const scene=new THREE.Scene();lightScene(scene,renderer);scene.fog=new THREE.Fog(0xF1E8DA,7.5,12.5);
  const cam=new THREE.PerspectiveCamera(28,1,.1,50);
  const N=products.length;const items=[];let done=0;
  await Promise.all(products.map(async(p,i)=>{const [f,b]=await Promise.all([loadTex(p.front,renderer),loadTex(p.back,renderer)]);const m=makePouch(f,b,p.color);m.userData.p=p;m.userData.i=i;m.userData.flip=0;m.userData.flipT=0;items[i]=m;scene.add(m);done++;onProgress&&onProgress(done/N)}));
  let R=3.1, rot=0, target=0, vel=0, active=-1, mobile=false;
  function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);cam.aspect=w/h;mobile=w<700;R=mobile?2.2:3.1;
    cam.position.set(0,mobile?-.1:.3,mobile?8.4:6.6);cam.lookAt(0,mobile?-.42:.12,0);cam.updateProjectionMatrix()}
  resize();addEventListener('resize',resize);
  const step=Math.PI*2/N;
  // input
  let down=false,sx=0,sy=0,lx=0,moved=0,grab=null,t0=0;const ray=new THREE.Raycaster(),v2=new THREE.Vector2();
  function pick(e){const r=canvas.getBoundingClientRect();v2.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(v2,cam);const hit=ray.intersectObjects(items.map(m=>m.userData.body),true)[0];if(!hit)return null;let o=hit.object;while(o&&o.userData.p===undefined)o=o.parent;return o}
  canvas.addEventListener('pointerdown',e=>{down=true;sx=lx=e.clientX;sy=e.clientY;moved=0;t0=performance.now();const o=pick(e);grab=(o&&o.userData.i===active)?o:null;idle=0});
  addEventListener('pointermove',e=>{if(!down)return;const dx=e.clientX-lx;lx=e.clientX;moved+=Math.abs(dx);
    if(grab){grab.userData.flip+=dx*.012}else{target-=dx*.0045;vel=-dx*.0045}});
  addEventListener('pointerup',e=>{if(!down)return;down=false;
    if(grab){const f=grab.userData;f.flip=Math.round(f.flip/Math.PI)*Math.PI;if(moved<6&&performance.now()-t0<350)onOpen&&onOpen(f.p);grab=null;return}
    if(moved<6){const o=pick(e);if(o){if(o.userData.i===active)onOpen&&onOpen(o.userData.p);else go(o.userData.i)}return}
    target+=vel*8;target=Math.round(target/step)*step});
  function go(i){const cur=Math.round(target/step);let d=((-i-cur)%N+N)%N;if(d>N/2)d-=N;target=(cur+d)*step}
  const api={next(){target-=step},prev(){target+=step},flip(){if(active>=0){const f=items[active].userData;f.flip=Math.round(f.flip/Math.PI)*Math.PI+Math.PI}},go};
  let idle=0,last=performance.now();
  function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;idle+=dt;
    if(idle>5&&!down){target-=step;idle=0}
    rot+=(target-rot)*Math.min(1,dt*5);
    let best=-1,bz=-1e9;
    items.forEach((m,i)=>{const a=i*step+rot;const x=Math.sin(a)*R,z=Math.cos(a)*R-R;const front=(Math.cos(a)+1)/2;
      const bob=Math.sin(now/1000*1.1+i*1.7)*.06;
      m.position.set(x*(mobile?1.0:1.32),bob+(-.3+front*.18),z*1.7);
      let an=Math.atan2(Math.sin(a),Math.cos(a));const focus=Math.exp(-(an*an)/.12);const s=(mobile?.36:.46)+focus*(mobile?.5:.66);m.visible=front>.42;m.position.z+=focus*.6;m.position.y+=focus*.08;m.scale.setScalar(s);
      const u=m.userData;u.flipT+=(u.flip-u.flipT)*Math.min(1,dt*6);
      m.userData.body.rotation.y=-Math.sin(a)*.5+Math.sin(now/1000*.7+i)*.08+u.flipT;
      m.userData.body.rotation.z=Math.sin(now/1000*.9+i*2.1)*.035+(-Math.sin(a)*.08);
      m.userData.body.rotation.x=-.04;
      u.shadow.material.opacity=.35+front*.5-bob*1.5;u.shadow.scale.setScalar(.9+front*.2);
      if(z>bz){bz=z;best=i}});
    if(best!==active){if(active>=0){items[active].userData.flip=0}active=best;onActive&&onActive(products[best],best)}
    canvas.style.cursor=down?'grabbing':'grab';
    renderer.render(scene,cam);requestAnimationFrame(frame)}
  requestAnimationFrame(frame);return api;
}

/* ---------- SINGLE VIEWER ---------- */
export async function viewer({canvas,p}){
  const renderer=makeRenderer(canvas);const scene=new THREE.Scene();lightScene(scene,renderer);
  const cam=new THREE.PerspectiveCamera(26,1,.1,50);cam.position.set(0,.05,4.6);cam.lookAt(0,-.05,0);
  const [f,b]=await Promise.all([loadTex(p.front,renderer),loadTex(p.back,renderer)]);const m=makePouch(f,b,p.color);scene.add(m);m.position.y=.05;
  function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);cam.aspect=w/h;cam.position.z=w/h<.8?5.6:4.6;cam.updateProjectionMatrix()}resize();addEventListener('resize',resize);
  let ry=-.35,tr=-.35,down=false,lx=0,vel=0,idle=0,last=performance.now(),rx=0,trx=0;
  canvas.addEventListener('pointerdown',e=>{down=true;lx=e.clientX;idle=0});
  addEventListener('pointermove',e=>{if(!down)return;const dx=e.clientX-lx;lx=e.clientX;tr+=dx*.012;vel=dx*.012});
  addEventListener('pointerup',()=>{if(down){down=false;tr+=vel*6}});
  canvas.addEventListener('mousemove',e=>{const r=canvas.getBoundingClientRect();trx=((e.clientY-r.top)/r.height-.5)*.25});
  const api={front(){tr=Math.round(tr/(Math.PI*2))*Math.PI*2},back(){tr=Math.round(tr/(Math.PI*2))*Math.PI*2+Math.PI},spin(){tr+=Math.PI*2}};
  function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;idle+=dt;if(idle>3&&!down)tr+=dt*.35;
    ry+=(tr-ry)*Math.min(1,dt*5);rx+=(trx-rx)*Math.min(1,dt*3);
    m.userData.body.rotation.y=ry;m.userData.body.rotation.x=rx-.03;m.position.y=.05+Math.sin(now/900)*.035;
    m.userData.shadow.material.opacity=.7-Math.sin(now/900)*.15;renderer.render(scene,cam);requestAnimationFrame(frame)}
  requestAnimationFrame(frame);return api;
}
