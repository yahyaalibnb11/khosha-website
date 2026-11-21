(function(){
const K='khosha_cart_v1';
function load(){try{return JSON.parse(localStorage.getItem(K)||'[]')}catch(e){return window.__cart||[]}}
function save(c){window.__cart=c;try{localStorage.setItem(K,JSON.stringify(c))}catch(e){}render();document.dispatchEvent(new CustomEvent('cart:change'))}
const byId=id=>PRODUCTS.find(p=>p.id===id)||BUNDLES.find(b=>b.id===id);
function priceOf(id){const p=byId(id);return p?p.price:0}
const Cart={
 items:load,
 add(id,q=1){const c=load();const i=c.find(x=>x.id===id);i?i.q+=q:c.push({id,q});save(c);toast(byId(id));},
 set(id,q){let c=load();if(q<=0)c=c.filter(x=>x.id!==id);else{const i=c.find(x=>x.id===id);if(i)i.q=q}save(c)},
 clear(){save([])},
 count(){return load().reduce((a,b)=>a+b.q,0)},
 subtotal(){return load().reduce((a,b)=>a+priceOf(b.id)*b.q,0)},
 byId,priceOf
};
window.Cart=Cart;
window.fmt=n=>'Rs '+n.toLocaleString('en-PK');
function render(){document.querySelectorAll('[data-cart-count]').forEach(e=>{const n=Cart.count();e.textContent=n;e.classList.toggle('on',n>0)})}
function toast(p){if(!p)return;let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}
 t.innerHTML=`<span class="tk">✓</span><div><b>${p.en||p.name}</b><small>cart mein shamil</small></div><a href="order.html">Cart dekhein →</a>`;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2600)}
document.addEventListener('DOMContentLoaded',render);
document.addEventListener('click',e=>{const b=e.target.closest('[data-add]');if(b){e.preventDefault();Cart.add(b.dataset.add,+(b.dataset.qty||1));b.classList.add('pulse');setTimeout(()=>b.classList.remove('pulse'),500)}});
})();
window.lighten=(h,t)=>{const n=parseInt(h.slice(1),16);const base=[243,235,221];const c=[16,8,0].map((k,i)=>Math.round(((n>>k)&255)*(1-t)+base[i]*t));return '#'+c.map(x=>x.toString(16).padStart(2,'0')).join('')};
window.qs=k=>new URLSearchParams(location.search).get(k);
