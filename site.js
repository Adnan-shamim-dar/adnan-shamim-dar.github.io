/* Portfolio interactions: spotlight, section nav, reveal, lightbox, DNA helix, Genesis life sim. */
(() => {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");

  /* ---------- cursor spotlight ---------- */
  const spot = document.querySelector(".spotlight");
  if (!reduce && spot) {
    window.addEventListener("pointermove", (e) => {
      spot.style.setProperty("--x", e.clientX + "px");
      spot.style.setProperty("--y", e.clientY + "px");
    }, { passive: true });
  }

  /* ---------- active section in nav ---------- */
  const links = [...document.querySelectorAll(".toc a")];
  const navIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  document.querySelectorAll("main section").forEach((s) => navIO.observe(s));

  /* ---------- reveal on scroll ---------- */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); revealIO.unobserve(en.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".entry, .flagship, .mini, .cred, .proofbar, .trust, .hook").forEach((el) => {
    el.classList.add("reveal");
    if (reduce) el.classList.add("in"); else revealIO.observe(el);
  });

  /* ---------- lightbox ---------- */
  const dlg = document.getElementById("lightbox");
  if (dlg) {
    const img = dlg.querySelector("img");
    document.querySelectorAll("[data-lightbox]").forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        img.src = a.getAttribute("href");
        img.alt = a.querySelector("img")?.alt || a.querySelector("h4")?.textContent || "";
        dlg.showModal();
      });
    });
    dlg.addEventListener("click", (e) => { if (e.target !== img) dlg.close(); });
  }

  /* ---------- shared glow sprite ---------- */
  const sprite = (rgb) => {
    const s = document.createElement("canvas"); s.width = s.height = 64;
    const g = s.getContext("2d"), grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, `rgba(${rgb},1)`); grd.addColorStop(0.2, `rgba(${rgb},0.5)`); grd.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = grd; g.fillRect(0, 0, 64, 64); return s;
  };
  const MINT = "76,245,200", CYAN = "90,190,255", VIOLET = "170,140,255";
  const glows = { [MINT]: sprite(MINT), [CYAN]: sprite(CYAN), [VIOLET]: sprite(VIOLET) };

  // phones and low-core devices get a lighter renderer (lower resolution, no per-rung gradients, no bokeh)
  const LITE = window.innerWidth < 760 || (navigator.hardwareConcurrency || 8) <= 4;
  const fitCanvas = (cv) => {
    const dpr = Math.min(window.devicePixelRatio || 1, LITE ? 1.25 : 2);
    const W = cv.clientWidth, H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    cv.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);
    return [W, H];
  };

  /* ---------- immersive 3D neon DNA: you scroll through it ---------- */
  const dna = document.querySelector(".dna");
  if (dna) {
    const ctx = dna.getContext("2d");
    let [W, H] = fitCanvas(dna);
    let t0 = performance.now(), last = 0, smoothScroll = window.scrollY;

    // one helix = axis position, radius, parallax, brightness
    // B-DNA proportions: one full turn ~ 1.6x the helix diameter
    const mk = (cx, R, gap, par, alpha, tilt, spin, far) =>
      ({ cx, R, gap, par, alpha, tilt, spin, far, pitch: (2 * gap) / (1.6 * 2 * R) });
    const helices = () => {
      const small = W < 760;
      return [
        // distant helix: thin, slow, off to the right
        // hero helix: huge, close to camera, sweeps across the page
        mk(W * 0.5, Math.min(W * (small ? 0.38 : 0.26), 440), 22, 0.75, small ? 0.5 : 0.8, -0.2, 0.00035, false),
      ];
    };

    const drawHelix = (h, time, scroll) => {
      const D = h.R * 3.4;                       // camera distance from axis
      const cy = H / 2, cosT = Math.cos(h.tilt), sinT = Math.sin(h.tilt);
      const offset = (scroll * h.par) % (h.gap * 1000);
      const first = Math.floor((offset - H * 0.9) / h.gap), lastI = Math.ceil((offset + H * 1.9) / h.gap);
      const pts = [];
      for (let i = first; i <= lastI; i++) {
        const wy = i * h.gap - offset - H * 0.5;            // world y relative to screen centre
        const th = i * h.pitch * Math.PI + time * h.spin;
        for (let strand = 0; strand < 2; strand++) {
          const a = th + strand * Math.PI;
          const x = h.R * Math.cos(a), z = h.R * Math.sin(a);  // z > 0 toward camera
          const p = D / (D - z);
          let sx = x * (0.9 + 0.1 * p), sy = wy;          // depth drives size/glow, not shape
          const rx = sx * cosT - sy * sinT, ry = sx * sinT + sy * cosT;  // tilt the whole helix
          pts.push({ i, strand, x: h.cx + rx, y: cy + ry, z, p });
        }
      }
      // rungs (base pairs) first, faint
      for (let k = 0; k + 1 < pts.length; k += 2) {
        const A = pts[k], B = pts[k + 1];
        if (A.y < -80 && B.y < -80 || A.y > H + 80 && B.y > H + 80) continue;
        const depth = (Math.min(A.p, B.p) - 0.6) / 1.2;
        const violet = ((A.i % 7) + 7) % 7 === 0;
        const al = h.alpha * (0.10 + 0.24 * Math.max(0, depth));
        if (LITE) ctx.strokeStyle = `rgba(${violet ? VIOLET : "83,218,228"},${al.toFixed(3)})`;
        else {
          const g = ctx.createLinearGradient(A.x, A.y, B.x, B.y);
          g.addColorStop(0, `rgba(${violet ? VIOLET : MINT},${al})`);
          g.addColorStop(1, `rgba(${violet ? VIOLET : CYAN},${al})`);
          ctx.strokeStyle = g;
        } ctx.lineWidth = Math.max(0.6, 1.2 * Math.min(A.p, B.p));
        ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
      }
      // backbones
      for (let strand = 0; strand < 2; strand++) {
        const s = pts.filter((q) => q.strand === strand);
        for (let k = 0; k + 1 < s.length; k++) {
          const A = s[k], B = s[k + 1];
          const depth = Math.max(0, Math.min(1, (A.p - 0.6) / 1.1));
          ctx.strokeStyle = `rgba(${strand ? CYAN : MINT},${h.alpha * (0.14 + 0.38 * depth)})`;
          ctx.lineWidth = 1 + 2.2 * depth;
          ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
        }
      }
      // nucleotides, back to front; close ones become soft bokeh
      ctx.globalCompositeOperation = "lighter";
      pts.sort((a, b) => a.z - b.z);
      for (const q of pts) {
        if (q.y < -120 || q.y > H + 120) continue;
        const c = q.strand ? CYAN : MINT;
        const depth = Math.max(0, Math.min(1, (q.p - 0.6) / 1.1));
        const r = (h.far ? 1.2 : 1.6) + (h.far ? 1.6 : 3.2) * depth;
        if (!h.far && q.p > 1.3) {
          if (LITE) continue;                         // out-of-focus foreground
          const bs = r * 16;
          ctx.globalAlpha = h.alpha * 0.10;
          ctx.drawImage(glows[c], q.x - bs / 2, q.y - bs / 2, bs, bs);
          continue;
        }
        const gs = r * 8;
        ctx.globalAlpha = h.alpha * (0.12 + 0.35 * depth);
        ctx.drawImage(glows[c], q.x - gs / 2, q.y - gs / 2, gs, gs);
        ctx.globalAlpha = h.alpha * (0.25 + 0.6 * depth);
        ctx.fillStyle = `rgb(${c})`;
        ctx.beginPath(); ctx.arc(q.x, q.y, r * 0.7, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
    };

    const render = (now) => {
      ctx.clearRect(0, 0, W, H);
      const time = reduce ? 0 : now - t0;
      for (const h of helices()) drawHelix(h, time, smoothScroll);
    };

    const tick = (now) => {
      if (document.hidden) return;
      if (now - last > (LITE ? 40 : 33)) {
        smoothScroll += (window.scrollY - smoothScroll) * 0.18;   // eased, feels like gliding through it
        render(now); last = now;
      }
      requestAnimationFrame(tick);
    };

    render(t0);
    window.addEventListener("resize", () => { [W, H] = fitCanvas(dna); render(performance.now()); });
    if (reduce) window.addEventListener("scroll", () => { smoothScroll = window.scrollY; render(0); }, { passive: true });
    else {
      requestAnimationFrame(tick);
      document.addEventListener("visibilitychange", () => { if (!document.hidden) requestAnimationFrame(tick); });
    }
  }

  /* ---------- Genesis: tiny artificial-life sim (runs only when visible) ---------- */
  const life = document.querySelector("canvas.life");
  if (life) {
    const ctx = life.getContext("2d");
    let [W, H] = fitCanvas(life);
    let agents = [], food = [], visible = false, last = 0;
    const spawn = (x, y, e = 0.6) => agents.push({ x, y, vx: 0, vy: 0, e, dying: 0 });
    const reset = () => {
      agents = []; food = [];
      for (let i = 0; i < 26; i++) spawn(Math.random() * W, Math.random() * H, 0.4 + Math.random() * 0.4);
      for (let i = 0; i < 40; i++) food.push({ x: Math.random() * W, y: Math.random() * H });
    };
    reset();

    const step = () => {
      if (food.length < 60 && Math.random() < 0.5) food.push({ x: Math.random() * W, y: Math.random() * H });
      const born = [];
      for (const a of agents) {
        if (a.dying) { a.dying += 0.04; continue; }
        // seek the nearest food within sensing range, otherwise wander
        let best = null, bd = 70 * 70;
        for (const f of food) { const d = (f.x - a.x) ** 2 + (f.y - a.y) ** 2; if (d < bd) { bd = d; best = f; } }
        if (best) { a.vx += (best.x - a.x) * 0.0025; a.vy += (best.y - a.y) * 0.0025; }
        a.vx += (Math.random() - 0.5) * 0.25; a.vy += (Math.random() - 0.5) * 0.25;
        a.vx *= 0.92; a.vy *= 0.92;
        a.x = (a.x + a.vx + W) % W; a.y = (a.y + a.vy + H) % H;
        a.e -= 0.0035;
        if (best && bd < 36) { a.e += 0.22; food.splice(food.indexOf(best), 1); }
        if (a.e > 1 && agents.length + born.length < 70) { a.e = 0.5; born.push([a.x + 4, a.y + 4]); }
        if (a.e <= 0) a.dying = 0.01;
      }
      born.forEach(([x, y]) => spawn(x, y, 0.5));
      agents = agents.filter((a) => a.dying < 1);
      if (agents.length < 6) reset();
    };

    const draw = () => {
      ctx.fillStyle = "rgba(6, 9, 12, 0.32)"; ctx.fillRect(0, 0, W, H);   // motion trails
      ctx.globalCompositeOperation = "lighter";
      for (const f of food) { ctx.globalAlpha = 0.35; ctx.drawImage(glows[VIOLET], f.x - 4, f.y - 4, 8, 8); }
      for (const a of agents) {
        const c = a.dying ? "255,110,110" : MINT;
        const r = 2 + a.e * 2.4, alpha = a.dying ? 1 - a.dying : 0.55 + a.e * 0.4;
        ctx.globalAlpha = Math.max(0, alpha) * 0.6;
        ctx.drawImage(a.dying ? glows[VIOLET] : glows[MINT], a.x - r * 4, a.y - r * 4, r * 8, r * 8);
        ctx.globalAlpha = Math.max(0, alpha); ctx.fillStyle = `rgb(${c})`;
        ctx.beginPath(); ctx.arc(a.x, a.y, r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
    };

    const tick = (t) => {
      if (!visible || document.hidden) return;
      if (t - last > 33) { step(); draw(); last = t; }
      requestAnimationFrame(tick);
    };
    ctx.fillStyle = "#06090c"; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 40; i++) step(); draw();
    if (!reduce) {
      new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) requestAnimationFrame(tick); }).observe(life);
      document.addEventListener("visibilitychange", () => { if (!document.hidden && visible) requestAnimationFrame(tick); });
    }
    window.addEventListener("resize", () => { [W, H] = fitCanvas(life); reset(); });
  }
})();
