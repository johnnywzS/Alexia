const portada=document.getElementById('portada');
const presentacion=document.getElementById('presentacion');
const btnComenzar=document.getElementById('btnComenzar');
const musica=document.getElementById('musica');
const imagen=document.getElementById('diapositiva');
const btnAnterior=document.getElementById('btnAnterior');
const btnSiguiente=document.getElementById('btnSiguiente');
const lluvia=document.getElementById('lluviaCorazones');
const mensajeFinal=document.getElementById('mensajeFinal');
const btnIrComienzo=document.getElementById('btnIrComienzo');
let actual=1;
const total=7;
let finalLanzado=false;
let corazonesActivos=true;

function actualizarFlechas(){
  btnAnterior.classList.toggle('oculta',actual===1);
  btnSiguiente.classList.toggle('oculta',actual===total);
}

function animarImagen(clase){
  imagen.classList.remove('slide-enter-right','slide-enter-left','slide-enter-first');
  void imagen.offsetWidth;
  imagen.classList.add(clase);
}

function mostrarDiapositiva(direccion='first'){
  imagen.src=`img/${actual}.png`;
  actualizarFlechas();
  mensajeFinal.classList.remove('visible');
  btnIrComienzo.classList.toggle('visible',actual===total);
  const clase=direccion==='prev'?'slide-enter-left':direccion==='next'?'slide-enter-right':'slide-enter-first';
  animarImagen(clase);
  if(actual===total&&!finalLanzado){
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
    mostrarDiapositiva('first');
  },780);
});

btnSiguiente.addEventListener('click',()=>{
  if(actual<total){actual++;mostrarDiapositiva('next')}
});

btnAnterior.addEventListener('click',()=>{
  if(actual>1){actual--;mostrarDiapositiva('prev')}
});

btnIrComienzo.addEventListener('click',volverPortada);

function volverPortada(){
  btnIrComienzo.classList.remove('visible');
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
  if(e.key==='ArrowRight'&&actual<total){actual++;mostrarDiapositiva('next')}
  if(e.key==='ArrowLeft'&&actual>1){actual--;mostrarDiapositiva('prev')}
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
setInterval(crearCorazon,1300);

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
