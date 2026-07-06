const portada=document.getElementById('portada');
const presentacion=document.getElementById('presentacion');
const btnComenzar=document.getElementById('btnComenzar');
const musica=document.getElementById('musica');
const imagen=document.getElementById('diapositiva');
const btnAnterior=document.getElementById('btnAnterior');
const btnSiguiente=document.getElementById('btnSiguiente');
const lluvia=document.getElementById('lluviaCorazones');
const lluviaPresentacion=document.getElementById('lluviaPresentacion');
const mensajeFinal=document.getElementById('mensajeFinal');
const btnIrComienzo=document.getElementById('btnIrComienzo');
let actual=1;
const total=7;
let finalLanzado=false;
let corazonesActivos=true;
let transicionBloqueada=false;
let renderDiapositiva=0;
const diapositivasPrecargadas=Array.from({length:total},(_,i)=>{
  const img=new Image();
  img.src=`img/${i+1}.png`;
  return img;
});

function actualizarViewportMovil(){
  const viewport=window.visualViewport;
  const alto=Math.round(viewport?.height||window.innerHeight);
  const ancho=Math.round(viewport?.width||window.innerWidth);
  const esHorizontal=ancho>alto;
  const distanciaControles=esHorizontal
    ? Math.max(58,Math.min(92,alto*.13))
    : Math.max(86,Math.min(124,alto*.12));

  document.documentElement.style.setProperty('--app-height',alto+'px');
  document.documentElement.style.setProperty('--mobile-control-bottom',Math.round(distanciaControles)+'px');
  document.documentElement.style.setProperty('--mobile-message-bottom',Math.round(distanciaControles+64)+'px');
}

actualizarViewportMovil();
window.addEventListener('resize',actualizarViewportMovil);
window.addEventListener('orientationchange',actualizarViewportMovil);
if(window.visualViewport){
  window.visualViewport.addEventListener('resize',actualizarViewportMovil);
  window.visualViewport.addEventListener('scroll',actualizarViewportMovil);
}

function actualizarFlechas(){
  btnAnterior.classList.toggle('oculta',actual===1);
  btnSiguiente.classList.toggle('oculta',actual===total);
}

function animarImagen(clase){
  imagen.classList.remove('slide-enter-right','slide-enter-left','slide-enter-first');
  void imagen.offsetWidth;
  imagen.classList.add(clase);
}

async function mostrarDiapositiva(direccion='first'){
  const token=++renderDiapositiva;
  const objetivo=actual;
  const precargada=diapositivasPrecargadas[objetivo-1];
  if(precargada?.decode){
    await precargada.decode().catch(()=>{});
  }
  if(token!==renderDiapositiva)return;
  imagen.src=precargada?.src||`img/${objetivo}.png`;
  actualizarFlechas();
  mensajeFinal.classList.remove('visible');
  btnIrComienzo.classList.toggle('visible',objetivo===total);
  if(objetivo===total)limpiarLluviaPresentacion();
  const clase=direccion==='prev'?'slide-enter-left':direccion==='next'?'slide-enter-right':'slide-enter-first';
  animarImagen(clase);
  if(objetivo===total&&!finalLanzado){
    finalLanzado=true;
    setTimeout(()=>mensajeFinal.classList.add('visible'),900);
    setTimeout(confetiFinal,1100);
  }
}

function iniciarMusica(){
  musica.volume=0;
  musica.currentTime=0;
  musica.play().then(()=>{
    let v=0;
    const fade=setInterval(()=>{
      v+=0.04;
      musica.volume=Math.min(v,0.55);
      if(v>=0.55)clearInterval(fade);
    },180);
  }).catch(()=>{});
}

btnComenzar.addEventListener('click',()=>{
  iniciarMusica();
  btnComenzar.style.animation='pulsoClick .55s ease forwards';
  portada.classList.add('saliendo');
  setTimeout(()=>{
    portada.classList.remove('pantalla-activa');
    portada.style.display='none';
    presentacion.classList.add('pantalla-activa');
    presentacion.style.display='flex';
    presentacion.style.opacity='1';
    actual=1;
    finalLanzado=false;
    limpiarLluviaPresentacion();
    mostrarDiapositiva('first');
  },780);
});

btnSiguiente.addEventListener('click',()=>{
  navegarDiapositiva('next');
});

btnAnterior.addEventListener('click',()=>{
  navegarDiapositiva('prev');
});

btnIrComienzo.addEventListener('click',volverPortada);

function navegarDiapositiva(direccion){
  if(transicionBloqueada)return;

  if(direccion==='next'&&actual<total){
    bloquearTransicion();
    actual++;
    mostrarDiapositiva('next');
  }

  if(direccion==='prev'&&actual>1){
    bloquearTransicion();
    actual--;
    mostrarDiapositiva('prev');
  }
}

function bloquearTransicion(){
  transicionBloqueada=true;
  setTimeout(()=>{transicionBloqueada=false},520);
}

function volverPortada(){
  btnIrComienzo.classList.remove('visible');
  limpiarLluviaPresentacion();
  presentacion.style.transition='opacity .45s ease, filter .45s ease';
  presentacion.style.opacity='0';
  presentacion.style.filter='blur(4px)';
  setTimeout(()=>{
    presentacion.classList.remove('pantalla-activa');
    presentacion.style.display='none';
    presentacion.style.filter='none';
    portada.style.display='flex';
    portada.classList.add('pantalla-activa');
    portada.classList.remove('saliendo');
    portada.style.opacity='0';
    portada.style.filter='blur(6px)';
    btnComenzar.style.animation='latido 1.65s ease-in-out infinite';
    setTimeout(()=>{
      portada.style.transition='opacity .6s ease, filter .6s ease';
      portada.style.opacity='1';
      portada.style.filter='blur(0)';
    },30);
  },450);
}

document.addEventListener('keydown',(e)=>{
  if(e.key==='Escape'&&presentacion.classList.contains('pantalla-activa'))volverPortada();
  if(e.key==='ArrowRight')navegarDiapositiva('next');
  if(e.key==='ArrowLeft')navegarDiapositiva('prev');
});

function crearCorazon(){
  if(!corazonesActivos)return;
  const h=document.createElement('div');
  h.className='heart-rain';
  h.textContent='';
  const heart=document.createElement('span');
  heart.className='heart-shape';
  h.appendChild(heart);
  h.style.left=Math.random()*100+'vw';
  h.style.fontSize=(18+Math.random()*18)+'px';
  h.style.animationDuration=(6+Math.random()*4)+'s';
  h.style.opacity=0.75+Math.random()*0.25;
  lluvia.appendChild(h);
  setTimeout(()=>h.remove(),10500);
}
setInterval(crearCorazon,700);

function crearCorazonSuave(){
  if(!presentacion.classList.contains('pantalla-activa')||actual===total)return;

  const h=document.createElement('div');
  h.className='heart-rain presentacion-heart';

  const heart=document.createElement('span');
  heart.className='heart-shape';
  heart.style.setProperty('--heart-color',Math.random()>.45?'rgba(255, 120, 184, .34)':'rgba(255, 255, 255, .38)');
  h.appendChild(heart);

  const cercaDelBorde=Math.random()<.72;
  const izquierda=Math.random()<.5;
  const x=cercaDelBorde
    ? izquierda?4+Math.random()*18:78+Math.random()*18
    : 24+Math.random()*52;

  h.style.left=x+'vw';
  h.style.fontSize=(10+Math.random()*8)+'px';
  h.style.animationDuration=(8+Math.random()*5)+'s';
  h.style.opacity=0.12+Math.random()*0.12;
  lluviaPresentacion.appendChild(h);
  setTimeout(()=>h.remove(),13500);
}
setInterval(crearCorazonSuave,2300);

function limpiarLluviaPresentacion(){
  lluviaPresentacion.replaceChildren();
}

function confetiFinal(){
  for(let i=0;i<45;i++){
    setTimeout(()=>{
      const c=document.createElement('div');
      c.className='confeti-final';
      c.textContent=['❤️','🩷','💕','✨','🌸'][Math.floor(Math.random()*5)];
      c.style.left=Math.random()*100+'vw';
      c.style.fontSize=(17+Math.random()*22)+'px';
      c.style.animationDuration=(2.8+Math.random()*1.8)+'s';
      document.body.appendChild(c);
      setTimeout(()=>c.remove(),4800);
    },i*55);
  }
}

actualizarFlechas();
