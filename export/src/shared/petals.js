// Pétalos flotantes — configurable por diseño
(function(){
  function createPetals(opts){
    opts = opts || {};
    const count = opts.count || 18;
    const colors = opts.colors || ['#c9a8d4', '#a97bb8', '#e8d5ef', '#ffffff'];
    const container = document.createElement('div');
    container.className = 'petals-layer';
    container.setAttribute('aria-hidden','true');
    Object.assign(container.style, {
      position: 'fixed', inset: '0', pointerEvents: 'none',
      overflow: 'hidden', zIndex: opts.zIndex || '5'
    });
    document.body.appendChild(container);

    for (let i = 0; i < count; i++){
      const p = document.createElement('span');
      const size = 10 + Math.random() * 22;
      const hue = colors[Math.floor(Math.random() * colors.length)];
      const delay = Math.random() * 20;
      const dur = 18 + Math.random() * 22;
      const drift = (Math.random() * 200 - 100);
      const startX = Math.random() * 100;
      const rotStart = Math.random() * 360;
      const rotEnd = rotStart + (Math.random() * 720 - 360);
      p.style.cssText = `
        position:absolute;
        left:${startX}vw;
        top:-8vh;
        width:${size}px;
        height:${size * 1.3}px;
        background:${hue};
        border-radius: 100% 0 100% 0;
        opacity:${0.35 + Math.random() * 0.45};
        filter: blur(${Math.random() < 0.3 ? 1 : 0}px);
        transform: rotate(${rotStart}deg);
        animation: petalFall ${dur}s linear ${delay}s infinite;
        --drift: ${drift}px;
        --rot-end: ${rotEnd}deg;
        will-change: transform;
      `;
      container.appendChild(p);
    }

    if (!document.getElementById('petals-kf')){
      const style = document.createElement('style');
      style.id = 'petals-kf';
      style.textContent = `
        @keyframes petalFall {
          0%   { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(var(--drift), 115vh) rotate(var(--rot-end)); }
        }
      `;
      document.head.appendChild(style);
    }
  }
  window.createPetals = createPetals;
})();
