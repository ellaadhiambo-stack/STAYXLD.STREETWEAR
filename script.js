
// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('menuBtn');
  const nav = document.querySelector('header.nav nav');
  if(btn && nav){
    btn.addEventListener('click', () => {
      nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
      nav.style.flexDirection = 'column';
      nav.style.gap = '10px';
      nav.style.background = '#000000ee';
      nav.style.position = 'absolute';
      nav.style.top = '56px';
      nav.style.right = '12px';
      nav.style.padding = '12px';
      nav.style.border = '1px solid var(--ring)';
      nav.style.borderRadius = '14px';
    });
  }

  // Shop page logic
  const grid = document.getElementById('productGrid');
  if(grid){
    fetch('products.json')
      .then(r => r.json())
      .then(products => initShop(products));
  }

  // Lookbook page placeholders from products
  const look = document.getElementById('lookbookGrid');
  if(look){
    fetch('lookbook.json')
      .then(r => r.json())
      .then(images => {
        images.forEach(src => {
          const tile = document.createElement('div');
          tile.className = 'tile';
          const ph = document.createElement('div');
          ph.className = 'ph';
          const img = new Image(); img.src = src;
          img.onload = () => { tile.appendChild(img); ph.remove(); };
          tile.appendChild(ph);
          look.appendChild(tile);
        });
      });
  }

  function initShop(products){
    const q = document.getElementById('search');
    const cat = document.getElementById('category');
    const sort = document.getElementById('sort');
    function render(){
      let list = [...products];
      const s = q.value.trim().toLowerCase();
      if(s) list = list.filter(p => p.name.toLowerCase().includes(s));
      if(cat.value) list = list.filter(p => p.category === cat.value);
      if(sort.value === 'low') list.sort((a,b)=>a.price-b.price);
      if(sort.value === 'high') list.sort((a,b)=>b.price-a.price);
      if(sort.value === 'new') list.sort((a,b)=> (b.new?1:0) - (a.new?1:0));
      grid.innerHTML = '';
      list.forEach(p => grid.appendChild(productCard(p)));
    }
    [q,cat,sort].forEach(el => el && el.addEventListener('input', render));
    render();
  }

  function productCard(p){
    const wrap = document.createElement('article');
    wrap.className = 'product';
    const thumb = document.createElement('div');
    thumb.className = 'thumb';
    const img = new Image(); img.alt = p.name; img.loading = 'lazy'; img.src = p.image || 'assets/placeholder.svg';
    thumb.appendChild(img);
    const meta = document.createElement('div');
    meta.className = 'meta';
    const left = document.createElement('div');
    left.innerHTML = '<div>'+p.name+'</div><div class="muted">'+(p.category || '')+'</div>';
    const price = document.createElement('div');
    price.className = 'price';
    price.textContent = '$' + p.price.toFixed(2);
    meta.append(left, price);
    wrap.append(thumb, meta);
    if(p.new){
      const b = document.createElement('div');
      b.className = 'badge';
      b.textContent = 'New';
      wrap.appendChild(b);
    }
    return wrap;
  }
});
