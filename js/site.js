(function(){
const EAR=(c='#D9A21B',s='currentColor')=>{let g=`<path d="M15,60 L15,13" stroke="${s}" stroke-width="1.8" stroke-linecap="round"/>`;const L=11,W=4.4;const gp=(x,y,a)=>`<path transform="translate(${x} ${y}) rotate(${a})" d="M0,0 C${W*.75},${-L*.2} ${W*.55},${-L*.85} 0,${-L} C${-W*.55},${-L*.85} ${-W*.75},${-L*.2} 0,0Z" fill="${c}"/>`;g+=gp(15,13,0);for(let i=0;i<4;i++){const y=19+i*7.6;g+=gp(14,y,-30)+gp(16,y,30)}return `<svg viewBox="0 0 30 60" aria-hidden="true">${g}</svg>`};
window.EAR=EAR;
const page=document.body.dataset.page;
const L=[['index.html','Home','home'],['shop.html','Shop','shop'],['story.html','Hamari Kahani','story'],['order.html','Order','order']];
const nav=document.getElementById('nav');
if(nav){nav.innerHTML=`<header class="nav ${document.body.dataset.solid?'solid':''}"><div class="wrap in">
<a class="brand" href="index.html">${EAR('#A0472D','#2B1D14')}<b>KHOSHA</b></a>
<nav class="links">${L.map(l=>`<a href="${l[0]}" class="${page===l[2]?'on':''}">${l[1]}</a>`).join('')}</nav>
<div class="nav-r"><a class="cart-btn" href="order.html"><b>CART</b><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg><i data-cart-count>0</i></a>
<button class="burger" aria-label="Menu"><span></span></button></div></div></header>
<div class="drawer"><button class="x" aria-label="Close">×</button>${L.map(l=>`<a href="${l[0]}">${l[1]}</a>`).join('')}<p class="ur" style="font-size:26px;margin-top:20px;opacity:.8">ہر روٹی ایک خوشے سے شروع ہوتی ہے</p></div>`;
 const hd=nav.querySelector('.nav');addEventListener('scroll',()=>{if(!document.body.dataset.solid)hd.classList.toggle('solid',scrollY>40)},{passive:true});
 const dr=nav.querySelector('.drawer');nav.querySelector('.burger').onclick=()=>dr.classList.add('open');dr.querySelector('.x').onclick=()=>dr.classList.remove('open');}
const ft=document.getElementById('footer');
if(ft){ft.innerHTML=`<footer><div class="wrap"><div class="cols">
<div><p class="ur" style="font-size:30px;color:#D9A21B">ہر روٹی ایک خوشے سے شروع ہوتی ہے</p><p style="opacity:.7;max-width:360px;margin-top:10px">Desi grains, single-origin masalay aur wellness foods. Desired Mill, Faisalabad mein purane tareeqay se pise hue.</p></div>
<div><h4>SHOP</h4><a href="shop.html#atta">Atta</a><a href="shop.html#masala">Masalay</a><a href="shop.html#seeds">Seeds</a><a href="shop.html#wellness">Wellness</a></div>
<div><h4>KHOSHA</h4><a href="story.html">Hamari Kahani</a><a href="index.html#faq">FAQ</a><a href="order.html">Order</a></div>
<div><h4>RABTA</h4><a href="#" data-wa>WhatsApp</a><a href="#">Instagram</a><a href="#">TikTok</a><a>Faisalabad, Pakistan</a></div></div>
<div class="big">KHOSHA</div>
<div class="bot"><span>© 2026 Khosha by Desired Mill. Faisalabad.</span><span>Cash on delivery · Poore Pakistan mein delivery</span></div></div></footer>`;
 ft.querySelectorAll('[data-wa]').forEach(a=>a.href='https://wa.me/'+SHOP.whatsapp);}
// reveal
function splitText(){document.querySelectorAll('.split:not(.done)').forEach(el=>{el.classList.add('done');const walk=n=>{[...n.childNodes].forEach(c=>{if(c.nodeType===3){const f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(w=>{if(!w.trim()){f.appendChild(document.createTextNode(w));return}const s=document.createElement('span');s.className='w';s.innerHTML=`<span>${w}</span>`;f.appendChild(s)});c.replaceWith(f)}else if(c.nodeType===1&&!c.classList.contains('w'))walk(c)})};walk(el);el.querySelectorAll('.w>span').forEach((s,i)=>s.style.transitionDelay=(i*.045)+'s')})}
window.reveal=function(){splitText();const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});document.querySelectorAll('[data-r]:not(.in),.split:not(.in)').forEach(el=>io.observe(el))};
document.addEventListener('DOMContentLoaded',()=>{reveal()});
window.lighten=(h,t)=>{const n=parseInt(h.slice(1),16);const c=[16,8,0].map(k=>Math.round(((n>>k)&255)*(1-t)+[243,235,221][[16,8,0].indexOf(k)]*t));return '#'+c.map(x=>x.toString(16).padStart(2,'0')).join('')};
window.qs=k=>new URLSearchParams(location.search).get(k);
})();
