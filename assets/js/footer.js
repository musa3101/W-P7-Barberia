/**
 * footer.js — Halftone Wordmark Footer (21st.dev adaptado a JS puro para P7 Barber)
 * - Dibuja el wordmark gigante en puntos halftone sobre Canvas 2D
 * - Física de muelles al pasar el puntero (los puntos se apartan y se tiñen de oro P7)
 * - Onda expansiva al hacer clic/toque sobre el footer
 * - Grano fino editorial + ResizeObserver + IntersectionObserver + prefers-reduced-motion
 */
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('p7-halftone-footer');
  const canvas = document.getElementById('p7-halftone-canvas');
  const backToTopBtn = document.getElementById('p7-back-to-top');

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (!root || !canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const config = {
    wordmark: root.dataset.wordmark || 'p7 barber',
    background: '#0b0b0c',
    ink: '#f3ead8',
    warm: '#e5c16c',
    crop: 0.2,
    grain: 0.45,
    fontWeight: 700,
    fontFamily: '"General Sans", "Inter", "Helvetica Neue", Arial, system-ui, sans-serif',
  };

  const hexToRgb = (hex) => {
    const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((hex || '').trim());
    if (!m) return null;
    const h = m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1];
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ];
  };

  const dotRadius = (coverage, gap) => {
    const c = coverage < 0 ? 0 : coverage > 1 ? 1 : coverage;
    return Math.sqrt(c) * gap * 0.56;
  };

  const stepDot = (x, y, vx, vy, hx, hy, px, py, r) => {
    const dx = x - px;
    const dy = y - py;
    const d2 = dx * dx + dy * dy;
    if (r > 0 && d2 < r * r) {
      const d = Math.sqrt(d2) + 0.001;
      const f = (1 - d / r) * 2.6;
      vx += (dx / d) * f;
      vy += (dy / d) * f;
    }
    vx = (vx + (hx - x) * 0.05) * 0.84;
    vy = (vy + (hy - y) * 0.05) * 0.84;
    return [x + vx, y + vy, vx, vy];
  };

  const dotWarmth = (x, y, hx, hy, span) => {
    const d = Math.hypot(x - hx, y - hy);
    return span > 0 ? Math.min(1, d / span) : 0;
  };

  const fitSize = (measured, width) => (measured > 0 ? (width / measured) * 100 : 0);

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ink = hexToRgb(config.ink) || [243, 234, 216];
  const warm = hexToRgb(config.warm) || [229, 193, 108];

  let w = 0;
  let h = 0;
  let dpr = 1;
  let px = -1e5;
  let py = -1e5;
  let raf = 0;
  let visible = true;
  let awake = true;
  let ring = { x: 0, y: 0, t: -1 };
  let dots = new Float32Array(0);
  let count = 0;
  let grainTile = null;

  const getResponsiveGap = (width) => {
    if (width < 480) return 3.6;
    if (width < 768) return 4.8;
    return 6;
  };

  const getResponsiveCrop = (width) => (width < 480 ? 0.04 : config.crop);

  const getResponsiveScaleY = (width) => {
    if (width < 480) return 1.38;
    if (width < 768) return 1.15;
    return 1;
  };

  const getResponsiveRadius = (width) => (width < 640 ? 64 : 84);

  const layout = () => {
    const rect = root.getBoundingClientRect();
    w = Math.max(1, Math.round(rect.width));
    h = Math.max(1, Math.round(rect.height));
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);

    const mask = document.createElement('canvas');
    mask.width = w;
    mask.height = h;
    const m = mask.getContext('2d', { willReadFrequently: true });
    if (!m) return;

    const word = config.wordmark;
    m.font = `${config.fontWeight} 100px ${config.fontFamily}`;
    const fit = fitSize(m.measureText(word).width, w * 0.96);
    m.font = `${config.fontWeight} ${fit}px ${config.fontFamily}`;
    const box = m.measureText(word);
    const cap = box.actualBoundingBoxAscent || fit * 0.72;
    const c = Math.max(0, Math.min(0.6, getResponsiveCrop(w)));
    const scaleY = getResponsiveScaleY(w);

    m.fillStyle = '#000';
    m.textBaseline = 'alphabetic';
    m.save();
    m.translate(0, h + cap * scaleY * c);
    m.scale(1, scaleY);
    m.fillText(word, (w - box.width) / 2, 0);
    m.restore();
    const img = m.getImageData(0, 0, w, h).data;

    const gap = Math.max(3, getResponsiveGap(w));
    const cols = Math.ceil(w / gap);
    const rows = Math.ceil(h / gap);
    const tmp = [];

    for (let gy = 0; gy < rows; gy++) {
      for (let gx = 0; gx < cols; gx++) {
        let sum = 0;
        for (let sy = 0; sy < 3; sy++) {
          for (let sx = 0; sx < 3; sx++) {
            const sxPos = Math.min(w - 1, Math.floor(gx * gap + ((sx + 0.5) * gap) / 3));
            const syPos = Math.min(h - 1, Math.floor(gy * gap + ((sy + 0.5) * gap) / 3));
            sum += img[(syPos * w + sxPos) * 4 + 3];
          }
        }
        const cov = sum / (9 * 255);
        if (cov < 0.06) continue;
        const hx = gx * gap + gap / 2;
        const hy = gy * gap + gap / 2;
        tmp.push(hx, hy, 0, 0, hx, hy, dotRadius(cov, gap));
      }
    }

    dots = new Float32Array(tmp);
    count = tmp.length / 7;

    if (!grainTile) {
      grainTile = document.createElement('canvas');
      grainTile.width = 256;
      grainTile.height = 256;
      const g = grainTile.getContext('2d');
      if (g) {
        const id = g.createImageData(256, 256);
        for (let i = 0; i < id.data.length; i += 4) {
          const v = Math.random() * 255;
          id.data[i] = id.data[i + 1] = id.data[i + 2] = v;
          id.data[i + 3] = Math.random() < 0.5 ? 0 : 255;
        }
        g.putImageData(id, 0, 0);
      }
    }

    awake = true;
  };

  const draw = (now) => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = config.background;
    ctx.fillRect(0, 0, w, h);

    const r = !reduced ? getResponsiveRadius(w) : 0;
    const ringAge = ring.t < 0 ? 1e9 : now - ring.t;
    const ringR = ringAge * 0.9;
    let moving = false;

    for (let i = 0; i < count; i++) {
      const j = i * 7;
      let x = dots[j];
      let y = dots[j + 1];
      let vx = dots[j + 2];
      let vy = dots[j + 3];
      const hx = dots[j + 4];
      const hy = dots[j + 5];

      if (!reduced) {
        if (ringAge < 900) {
          const dx = hx - ring.x;
          const dy = hy - ring.y;
          const d = Math.sqrt(dx * dx + dy * dy) + 0.001;
          const band = 1 - Math.min(1, Math.abs(d - ringR) / 26);
          if (band > 0) {
            const f = band * 3.2 * (1 - ringAge / 900);
            vx += (dx / d) * f;
            vy += (dy / d) * f;
          }
        }
        const s = stepDot(x, y, vx, vy, hx, hy, px, py, r);
        x = s[0];
        y = s[1];
        vx = s[2];
        vy = s[3];
        if (Math.abs(vx) + Math.abs(vy) > 0.02 || Math.abs(x - hx) + Math.abs(y - hy) > 0.05) {
          moving = true;
        } else {
          x = hx;
          y = hy;
          vx = 0;
          vy = 0;
        }
        dots[j] = x;
        dots[j + 1] = y;
        dots[j + 2] = vx;
        dots[j + 3] = vy;
      }

      const k = dotWarmth(x, y, hx, hy, 28);
      ctx.fillStyle =
        k > 0.02
          ? `rgb(${Math.round(ink[0] + (warm[0] - ink[0]) * k)},${Math.round(
              ink[1] + (warm[1] - ink[1]) * k
            )},${Math.round(ink[2] + (warm[2] - ink[2]) * k)})`
          : config.ink;
      ctx.beginPath();
      ctx.arc(x, y, dots[j + 6], 0, 6.2832);
      ctx.fill();
    }

    if (grainTile && config.grain > 0) {
      ctx.globalAlpha = Math.min(1, config.grain) * 0.09;
      ctx.globalCompositeOperation = 'overlay';
      const pattern = ctx.createPattern(grainTile, 'repeat');
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }

    awake = moving || ringAge < 900 || px > -1e4;
  };

  const loop = (now) => {
    raf = 0;
    if (!visible) return;
    draw(now);
    if (awake) raf = requestAnimationFrame(loop);
  };

  const wake = () => {
    awake = true;
    if (!raf && visible) raf = requestAnimationFrame(loop);
  };

  const toLocal = (e) => {
    const b = canvas.getBoundingClientRect();
    return [e.clientX - b.left, e.clientY - b.top];
  };

  root.addEventListener('pointermove', (e) => {
    const p = toLocal(e);
    px = p[0];
    py = p[1];
    wake();
  });

  root.addEventListener('pointerleave', () => {
    px = -1e5;
    py = -1e5;
    wake();
  });

  root.addEventListener('pointerdown', (e) => {
    if (reduced) return;
    if (e.target.closest('a, button')) return;
    const p = toLocal(e);
    ring = { x: p[0], y: p[1], t: performance.now() };
    wake();
  });

  layout();
  draw(performance.now());
  wake();

  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(() => {
      layout();
      wake();
    });
    ro.observe(root);
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      visible = entries[0] ? entries[0].isIntersecting : true;
      if (visible) wake();
    });
    io.observe(root);
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      layout();
      wake();
    });
  }
});
