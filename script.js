const BACKGROUND_IMAGE = 'assets/background.jpg';

const PROJECTS = [
  { name:'S.D.V.T.P',         image:'assets/S.D.V.T.P.png', thumb:null, hero:null, description:"Une reproduction légère et performante de l'utilitaire WizTree, développée en C pour les systèmes GNU/Linux. Ce projet permet de visualiser instantanément l'occupation de l'espace disque sous forme de Treemap interactive.", link:'https://github.com/Kenzus241/S.D.V.T.P', colors:['#ff9a3c','#ffd23c','#1a1a1a'], shape:'circle'   },
  { name:'MODIBO-Music',     image:'assets/MODIBO.jpg', thumb:null, hero:null, description:"le but du projet MODIBO est de créer un bot discord qui lance de la musique dépendant des commande tapé par l'utilisateur", link:'https://github.com/Kenzus241/MODIBO-Music', colors:['#7a5cff','#2b1d8f','#0d0d2a'], shape:'ring'     },
  { name:'42sh',   image:'assets/42sh.png', thumb:null, hero:null, description:"42sh est une implementation en C d'un shell Unix inspire de tcsh. Le programme lance une boucle interactive capable d'executer des commandes systeme, de gerer des builtins, des redirections, des pipes, l'historique, les alias et une partie du job control.", link:'https://github.com/Kenzus241/42sh', colors:['#2ee6a8','#0a7a4f','#03150d'], shape:'blob'     },
  { name:'shatta-vodou',   image:'assets/shatta-vodou.png', thumb:null, hero:null, description:"shatta-vodou est un projet qui vise à créer une application de jeux de cartes entre amis. Ce dernier à pour principe de choisir une carte de départ en lançant un dé qui déterminera la carte. Àprès que la carte soit choisie, le joueur devra retrouver cette dernière dans le paquet dans lequel elle a été remise.", link:'https://github.com/Kenzus241/shatta-vodou', colors:['#2ee6a8','#0a7a4f','#03150d'], shape:'blob'     },
  { name:'Tardis',   image:'assets/Tardis.png', thumb:null, hero:null, description:"Dans le cadre du nouveau service d'analyse de données de la SNCF, le projet TARDIS vise à améliorer l'efficacité du transport ferroviaire. L'objectif est d'analyser les données historiques relatives aux retards afin de développer un modèle prédictif capable d'anticiper les perturbations avant qu'elles ne se produisent. Le résultat final est un tableau de bord interactif destiné à des milliers de voyageurs afin de les aider à mieux planifier leurs trajets.", link:'https://github.com/Kenzus241/Tardis', colors:['#2ee6a8','#0a7a4f','#03150d'], shape:'blob'     },
];

if (BACKGROUND_IMAGE){
  const appEl = document.getElementById('app');
  appEl.style.backgroundImage = 'url(' + BACKGROUND_IMAGE + ')';
  appEl.classList.add('has-bg');
}

function makeTexture(p){
  const w = 640, h = 400;
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const x = c.getContext('2d');
  const g = x.createLinearGradient(0,0,w,h);
  g.addColorStop(0,p.colors[0]); g.addColorStop(.55,p.colors[1]); g.addColorStop(1,p.colors[2]);
  x.fillStyle = g; x.fillRect(0,0,w,h);

  const r = x.createRadialGradient(w*.3,h*.3,0,w*.3,h*.3,w*.5);
  r.addColorStop(0,'rgba(255,255,255,.5)'); r.addColorStop(1,'rgba(255,255,255,0)');
  x.fillStyle = r; x.fillRect(0,0,w,h);

  x.fillStyle = 'rgba(0,0,0,.78)';
  x.strokeStyle = 'rgba(0,0,0,.78)';
  if (p.shape === 'circle'){
    x.beginPath(); x.arc(w*.68,h*.5,h*.26,0,7); x.fill();
  } else if (p.shape === 'ring'){
    x.lineWidth = 26;
    x.beginPath(); x.arc(w*.62,h*.52,h*.27,0,7); x.stroke();
  } else if (p.shape === 'asterisk'){
    x.save(); x.translate(w*.66,h*.5); x.lineWidth = 30; x.lineCap = 'round';
    for(let i=0;i<3;i++){ x.rotate(Math.PI/3);
      x.beginPath(); x.moveTo(-h*.24,0); x.lineTo(h*.24,0); x.stroke(); }
    x.restore();
  } else {
    x.beginPath(); x.moveTo(w*.5,h*.28);
    x.bezierCurveTo(w*.78,h*.18,w*.86,h*.62,w*.62,h*.74);
    x.bezierCurveTo(w*.42,h*.84,w*.3,h*.55,w*.5,h*.28);
    x.fill();
  }

  const img = x.getImageData(0,0,w,h), d = img.data;
  for(let i=0;i<d.length;i+=16){ const n=(Math.random()-.5)*16; d[i]+=n; d[i+1]+=n; d[i+2]+=n; }
  x.putImageData(img,0,0);
  return c;
}

const texLoader = new THREE.TextureLoader();
const ASSETS = PROJECTS.map((p, i) => {
  const placeholderCanvas = makeTexture(p);
  let texture;
  if (p.image){

    texture = texLoader.load(p.image, t => {
      const planeAspect = 1.78 / 1.11;
      const imgAspect = t.image.width / t.image.height;
      const s = new THREE.Vector2(1, 1), o = new THREE.Vector2(0, 0);
      if (imgAspect > planeAspect){
        s.x = planeAspect / imgAspect; o.x = (1 - s.x) / 2;
      } else {
        s.y = imgAspect / planeAspect; o.y = (1 - s.y) / 2;
      }
      const m = cards[i] && cards[i].material;
      if (m){ m.uniforms.uUVScale.value.copy(s); m.uniforms.uUVOffset.value.copy(o); }
    });
  } else {
    texture = new THREE.CanvasTexture(placeholderCanvas);
  }
  texture.minFilter = THREE.LinearFilter;

  let thumbURL;
  if (p.thumb)      thumbURL = p.thumb;
  else if (p.image) thumbURL = p.image;
  else {
    const small = document.createElement('canvas');
    small.width = 84; small.height = 60;
    small.getContext('2d').drawImage(placeholderCanvas, 0, 0, 84, 60);
    thumbURL = small.toDataURL();
  }

  const heroURL = p.hero || p.image || placeholderCanvas.toDataURL();
  return { texture, thumbURL, heroURL };
});

const app      = document.getElementById('app');
const canvas   = document.getElementById('webgl');
const spotlight = document.getElementById('spotlight');
const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, 1, .1, 50);
camera.position.set(0, 0, 4.6);

const VERT = `
  uniform float uCurl;
  uniform float uVel;
  uniform float uTime;
  varying vec2 vUv;
  void main(){
    vUv = uv;
    vec3 p = position;
    p.z += sin(uv.x * 3.14159) * uCurl;
    p.z += sin(uv.y * 3.14159) * uVel * 0.55;
    p.y += sin(uv.x * 3.14159) * uVel * 0.10;

    float tw = uVel * 0.6 * (uv.y - 0.5);
    p.xz = mat2(cos(tw), -sin(tw), sin(tw), cos(tw)) * p.xz;

    p.xy *= 1.0 - min(abs(uVel) * 0.35, 0.08);

    p.z += sin(uTime * 0.8 + uv.x * 6.2831) * 0.006;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;
const FRAG = `
  uniform sampler2D uMap;
  uniform float uBlur;
  uniform float uVel;
  uniform float uAlpha;
  uniform vec2 uUVScale;
  uniform vec2 uUVOffset;
  varying vec2 vUv;
  void main(){

    vec2 uvc = vUv * uUVScale + uUVOffset;

    vec2 asp = vec2(1.6, 1.0);
    vec2 q = abs(vUv - 0.5) * asp;
    float rad = 0.07;
    vec2 b = 0.5 * asp - vec2(rad);
    float d = length(max(q - b, 0.0)) - rad;
    float mask = 1.0 - smoothstep(-0.004, 0.004, d);
    if (mask <= 0.0) discard;


    vec4 col = vec4(0.0);
    float total = 0.0;
    for (int i = -4; i <= 4; i++){
      float fi = float(i);
      float wgt = 1.0 - abs(fi) / 5.0;
      vec2 off = vec2(fi * 0.006, fi * 0.02) * uBlur;
      col += texture2D(uMap, clamp(uvc + off * uUVScale, 0.001, 0.999)) * wgt;
      total += wgt;
    }
    col /= total;


    vec2 ca = vec2(0.0, clamp(uVel * 0.18, -0.035, 0.035)) * uUVScale;
    float rC = texture2D(uMap, clamp(uvc + ca, 0.001, 0.999)).r;
    float bC = texture2D(uMap, clamp(uvc - ca, 0.001, 0.999)).b;
    float mixCA = min(abs(uVel) * 9.0, 0.85);
    col.r = mix(col.r, rC, mixCA);
    col.b = mix(col.b, bC, mixCA);


    col.rgb = mix(col.rgb, col.rgb * col.rgb * 1.35 + col.rgb * 0.18, (1.0 - uBlur) * 0.25);

    gl_FragColor = vec4(col.rgb, mask * uAlpha);
  }
`;

const N      = PROJECTS.length;
const STEP   = 0.66;
const RANGE  = N * STEP;
const geo    = new THREE.PlaneGeometry(1.78, 1.11, 32, 18);
const cards  = [];

PROJECTS.forEach((p, i) => {
  const mat = new THREE.ShaderMaterial({
    vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false,
    uniforms: {
      uMap:   { value: ASSETS[i].texture },
      uCurl:  { value: .06 },
      uVel:   { value: 0 },
      uTime:  { value: 0 },
      uBlur:  { value: 0 },
      uAlpha: { value: 1 },
      uUVScale:  { value: new THREE.Vector2(1, 1) },
      uUVOffset: { value: new THREE.Vector2(0, 0) },
    }
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.userData = { index: i, base: i * STEP };
  scene.add(mesh);
  cards.push(mesh);
});

let scrollTarget = 0, scrollCurrent = 0, velocity = 0;
let lastInputAt = 0;
addEventListener('wheel', e => {
  if (!experienceMode || projectOpen || menuOpen) return;
  scrollTarget += e.deltaY * 0.0019;
  lastInputAt = performance.now();
}, { passive:true });

let touchY = null;
addEventListener('touchstart', e => { touchY = e.touches[0].clientY; }, { passive:true });
addEventListener('touchmove', e => {
  if (!experienceMode || touchY === null || projectOpen || menuOpen) return;
  scrollTarget += (touchY - e.touches[0].clientY) * 0.0045;
  touchY = e.touches[0].clientY;
  lastInputAt = performance.now();
}, { passive:true });
addEventListener('touchend', () => { touchY = null; });

const RX = 2.55, RZ = 2.15, PITCH = 0.58;
function wrap(a){
  return ((a % RANGE) + RANGE * 1.5) % RANGE - RANGE / 2;
}
function layout(t){
  cards.forEach(m => {
    const a = wrap(m.userData.base + scrollCurrent);
    m.position.x = Math.sin(a) * RX * 0.9;
    m.position.y = -a * PITCH;
    m.position.z = (Math.cos(a) - 1) * RZ;
    m.rotation.y = Math.sin(a) * 0.32;
    m.rotation.x = -a * 0.05;
    m.rotation.z = -Math.sin(a) * 0.10;
    m.renderOrder = Math.round(m.position.z * 100);

    const depth = Math.abs(m.position.z + 0.25) + Math.abs(m.position.y) * 0.35;
    const tBlur = Math.min(1, depth * 0.42 + Math.abs(velocity) * 7);
    const u = m.material.uniforms;
    const isHover = (hovered === m);
    u.uBlur.value  += (((isHover ? 0 : tBlur)) - u.uBlur.value) * 0.12;
    u.uVel.value   += (velocity * 6 - u.uVel.value) * 0.1;
    u.uTime.value   = t * 0.001;
    u.uAlpha.value  = 1 - Math.min(1, Math.max(0, (Math.abs(a) - Math.PI * 0.78) * 1.6));
    m.userData.angle = a;
  });
}

const raycaster = new THREE.Raycaster();
const pointer   = new THREE.Vector2(-2, -2);
let hovered = null;
const tooltip     = document.getElementById('tooltip');
const tooltipImg  = document.getElementById('tooltip-img');
const tooltipName = document.getElementById('tooltip-name');
let mouseX = innerWidth / 2, mouseY = innerHeight / 2;
let tipX = mouseX, tipY = mouseY;

addEventListener('pointermove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  const r = canvas.getBoundingClientRect();
  pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
  pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
});

function updateHover(){
  if (!entered || !experienceMode || isList || menuOpen || projectOpen || panelOpen){ hovered = null; tooltip.classList.remove('is-visible'); return; }
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(cards)
    .filter(h => Math.abs(h.object.userData.angle) < 1.35 && h.object.material.uniforms.uAlpha.value > .5);
  const next = hits.length ? hits[0].object : null;
  if (next !== hovered){
    hovered = next;
    if (hovered){
      const i = hovered.userData.index;
      tooltipName.textContent = PROJECTS[i].name;
      tooltipImg.src = ASSETS[i].thumbURL;
      tooltip.classList.add('is-visible');
    } else tooltip.classList.remove('is-visible');
  }
}

canvas.addEventListener('click', () => {
  if (hovered && entered && experienceMode && !isList) openProject(hovered.userData.index);
});

function resize(){
  const w = app.clientWidth, h = app.clientHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize);
resize();

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
function tick(now){

  if (!reduceMotion && entered && experienceMode && !isList && !menuOpen && !projectOpen && !panelOpen && now - lastInputAt > 2600)
    scrollTarget += 0.0011;

  const prev = scrollCurrent;
  scrollCurrent += (scrollTarget - scrollCurrent) * 0.075;
  velocity = scrollCurrent - prev;

  layout(now);
  updateHover();

  tipX += (mouseX - tipX) * 0.16;
  tipY += (mouseY - tipY) * 0.16;
  const r = app.getBoundingClientRect();
  tooltip.style.left = (tipX - r.left) + 'px';
  tooltip.style.top  = (tipY - r.top - 52) + 'px';
  spotlight.style.left = (mouseX - r.left) + 'px';
  spotlight.style.top  = (mouseY - r.top) + 'px';

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

let soundOn = false;
const bgMusic = new Audio('assets/song.ogg');
bgMusic.loop = true;
bgMusic.preload = 'auto';
bgMusic.volume = 0.09;
const soundBtn = document.getElementById('sound-btn');
function setSound(on){
  soundOn = on;
  soundBtn.classList.toggle('is-muted', !on);
  if (on){
    bgMusic.play().catch(() => {
      soundOn = false;
      soundBtn.classList.add('is-muted');
    });
  } else {
    bgMusic.pause();
  }
}
soundBtn.addEventListener('click', () => setSound(!soundOn));

let entered = false;
let experienceMode = false;
const intro = document.getElementById('intro');
function setExperienceMode(open){
  experienceMode = open;
  app.classList.toggle('is-experience', open);
  if (!open){
    setView(false);
    tooltip.classList.remove('is-visible');
    hovered = null;
  }
}
function enter(withSound){
  entered = true;
  intro.classList.add('is-hidden');
  app.classList.add('is-entered');
  setExperienceMode(false);
  if (withSound) setSound(true);

  scrollTarget += 1.4;
}
document.getElementById('enter-sound').addEventListener('click', () => enter(true));
document.getElementById('enter-muted').addEventListener('click', () => enter(false));

let isList = false;
const btnSpiral = document.getElementById('btn-spiral');
const btnList   = document.getElementById('btn-list');
const listview  = document.getElementById('listview');
PROJECTS.forEach((p, i) => {
  const a = document.createElement('a');
  a.href = '#'; a.textContent = p.name;
  a.style.transitionDelay = (i * 45) + 'ms';
  a.addEventListener('click', e => { e.preventDefault(); openProject(i); });
  listview.appendChild(a);
});
function setView(list){
  isList = list;
  app.classList.toggle('is-list', list);
  btnSpiral.classList.toggle('is-active', !list);
  btnList.classList.toggle('is-active', list);
}
btnSpiral.addEventListener('click', () => setView(false));
btnList.addEventListener('click', () => setView(true));

let menuOpen = false;
const menu = document.getElementById('menu');
function setMenu(open){ menuOpen = open; menu.classList.toggle('is-open', open); }
document.getElementById('menu-open').addEventListener('click', () => setMenu(true));
document.getElementById('menu-close').addEventListener('click', () => setMenu(false));
menu.querySelectorAll('[data-close]').forEach(a =>
  a.addEventListener('click', e => { e.preventDefault(); setMenu(false); }));
document.querySelectorAll('[data-experience-open]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    closePanels();
    setMenu(false);
    setExperienceMode(true);
  });
});
document.querySelectorAll('[data-home]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    closePanels();
    setMenu(false);
    setExperienceMode(false);
  });
});
document.getElementById('experience-close').addEventListener('click', () => {
  closePanels();
  setExperienceMode(false);
});

let panelOpen = false;
const panels = document.querySelectorAll('.panel');
function openPanel(id){
  const panel = document.getElementById(id);
  if (!panel) return;
  setExperienceMode(false);
  panelOpen = true;
  panels.forEach(p => p.classList.toggle('is-open', p === panel));
  setMenu(false);
  tooltip.classList.remove('is-visible');
}
function closePanels(){
  panelOpen = false;
  panels.forEach(panel => {
    panel.classList.remove('is-open');
    panel.scrollTop = 0;
  });
}
document.querySelectorAll('[data-panel]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    openPanel(link.dataset.panel);
  });
});
document.querySelectorAll('[data-close-panel]').forEach(btn => {
  btn.addEventListener('click', closePanels);
});

let projectOpen = false;
const project   = document.getElementById('project');
const projHero  = document.getElementById('proj-hero');
const projTitle = document.getElementById('proj-title');
const projDesc  = document.getElementById('proj-desc');
const projLink  = document.getElementById('proj-link');
function openProject(i){
  closePanels();
  setExperienceMode(true);
  projectOpen = true;
  projTitle.textContent = PROJECTS[i].name;
  projDesc.textContent  = PROJECTS[i].description;
  projLink.hidden = !PROJECTS[i].link;
  if (PROJECTS[i].link) projLink.href = PROJECTS[i].link;
  projHero.style.backgroundImage = 'url(' + ASSETS[i].heroURL + ')';
  project.classList.add('is-open');
  tooltip.classList.remove('is-visible');
}
document.getElementById('proj-close').addEventListener('click', () => {
  projectOpen = false;
  project.classList.remove('is-open');
  project.scrollTop = 0;
});
addEventListener('keydown', e => {
  if (e.key === 'Escape'){
    setMenu(false);
    if (projectOpen){
      projectOpen = false;
      project.classList.remove('is-open');
      project.scrollTop = 0;
    } else if (panelOpen){
      closePanels();
    } else if (experienceMode){
      setExperienceMode(false);
    }
  }
});
