/* UNBNDED landing: 3D hero garment, scroll animations, interactions */
(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const src = (file) => encodeURI(file);
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------
     Data
     Hero variants use transparent front/back cutouts (assets/hero/)
     cut from the side-by-side product shots. ar = width / height.
  --------------------------------------------------------------- */
  const VARIANTS = [
    { group: "tee", id: "lwl-black", name: "LWL Tee", color: "Black", c: "#3a3a3a", ar: 1.22 },
    { group: "tee", id: "medieval", name: "Medieval Tee", color: "Washed Black", c: "#1c1c1c", ar: 1.17 },
    { group: "tee", id: "lwl-red", name: "LWL Tee", color: "Red", c: "#ff4b4b", ar: 1.22 },
    { group: "hoodie", id: "hoodie-black", name: "UNB Hoodie", color: "Black", c: "#0c0c0c", ar: 1.15 },
    { group: "hoodie", id: "hoodie-forest", name: "UNB Hoodie", color: "Forest", c: "#173a26", ar: 1.15 },
    { group: "hoodie", id: "hoodie-espresso", name: "UNB Hoodie", color: "Espresso", c: "#2c1a17", ar: 1.15 },
    { group: "hoodie", id: "hoodie-cream", name: "UNB Hoodie", color: "Cream", c: "#e4ddb0", ar: 1.15 },
  ];
  const cutout = (v, side) => `assets/hero/${v.id}-${side}.png`;

  const PRODUCTS = [
    { name: "Core Tee", tags: ["tee"], label: "Graphic Tee", img: "CORE TEE.jpg",
      colors: [{ n: "White", c: "#f4f4f4" }, { n: "Blue", c: "#1f2fe0" }],
      desc: "Boxy heavyweight tee with the UNBNDÉD wordmark across the back. Clean enough for every day." },
    { name: "UNB Hoodie", tags: ["hoodie"], label: "Heavy Hoodie", img: "Hoodie5.jpg",
      colors: [{ n: "Forest", c: "#173a26", img: "Hoodie5.jpg" }, { n: "Grey", c: "#a9a9a9", img: "Hoodie1.jpg" }, { n: "Espresso", c: "#2c1a17", img: "Hoodi4.jpg" }, { n: "Black", c: "#0c0c0c", img: "Hoodieh3.jpg" }, { n: "Cream", c: "#e4ddb0", img: "Hoodie2.jpg" }],
      desc: "Brushed fleece, dropped shoulders and a puff-print UNBOUNDED arc across the back." },
    { name: "Baggy Sweatpants", tags: ["pants"], label: "Bottoms", img: "Baggy Sweatpant.jpg",
      colors: [{ n: "Grey", c: "#b9b9b9" }, { n: "Black", c: "#111" }],
      desc: "Wide, stacked leg with an elastic cuff. Built to sit right over any sneaker." },
    { name: "Ignite Tee 2024", tags: ["tee", "ignite"], label: "Ignite 2024", img: "IGNITE TEE.jpg", alt: "IGNITE TEE1.jpg",
      colors: [{ n: "Black", c: "#111" }, { n: "White", c: "#f4f4f4" }],
      desc: "Flame-gradient UNB blackletter for the 2024 Ignite drop. Limited run." },
    { name: "Signature Tee", tags: ["tee", "signature"], label: "Signature Series", img: "SIGNATURE TEE-white.jpg",
      colors: [{ n: "White", c: "#f4f4f4", img: "SIGNATURE TEE-white.jpg" }, { n: "Grey", c: "#9d9d9d", img: "SIGNATURE TEE-grey.jpg" }],
      desc: "Script oval on the chest and \"Live without limits\" across the shoulders." },
    { name: "U Tee", tags: ["tee", "signature"], label: "Signature Series", img: "U TEE.jpg",
      colors: [{ n: "Black", c: "#111" }, { n: "White", c: "#f4f4f4" }],
      desc: "Varsity UNBOUNDED arc up front, oversized U crest on the back." },
    { name: "LWL Tee", tags: ["tee"], label: "Graphic Tee", img: "LWL TEE.jpg",
      colors: [{ n: "Black", c: "#111" }, { n: "Red", c: "#ff4b4b" }],
      desc: "Tonal college arc on black, bright white on red. \"Live without limits\" since 2024." },
    { name: "Medieval Tee", tags: ["tee"], label: "Graphic Tee", img: "Medieval Tee.jpg",
      colors: [{ n: "Washed Black", c: "#1c1c1c" }],
      desc: "Acid-washed black with a blackletter circle on the back that cracks in over time." },
  ];

  /* ---------------------------------------------------------------
     Text splitting
  --------------------------------------------------------------- */
  $$(".split").forEach((el) => {
    const text = el.textContent;
    el.textContent = "";
    [...text].forEach((ch) => {
      const s = document.createElement("span");
      s.className = "char";
      s.textContent = ch === " " ? " " : ch;
      el.appendChild(s);
    });
  });
  $$(".words").forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w) => `<span class="word">${w}</span>`).join(" ");
  });

  /* ---------------------------------------------------------------
     Collection cards
  --------------------------------------------------------------- */
  const track = $("#track");
  PRODUCTS.forEach((p, i) => {
    const card = document.createElement("article");
    card.className = "card group relative w-[clamp(260px,24vw,360px)] flex-none rounded-2xl bg-white px-3 pb-[18px] pt-3";
    card.dataset.tags = p.tags.join(" ");
    card.dataset.index = i;
    card.innerHTML = `
      <div class="card__img relative aspect-square cursor-pointer overflow-hidden rounded-[10px] bg-white">
        <span class="absolute left-2.5 top-2.5 z-[2] rounded-full bg-lime px-2 py-1 text-[10px] font-semibold uppercase tracking-[.06em]">${p.label}</span>
        <img src="${src(p.img)}" alt="${p.name}" loading="lazy" class="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.08]">
        <button class="absolute bottom-2.5 right-2.5 z-[2] h-[34px] translate-y-3.5 rounded-full bg-ink px-3.5 text-xs text-white opacity-0 transition duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 focus:translate-y-0 focus:opacity-100" data-qv="${i}">Quick view</button>
      </div>
      <div class="mt-3.5 flex items-end justify-between px-1">
        <div><h3 class="text-[15px] font-medium tracking-[-.01em]">${p.name}</h3><small class="text-xs text-muted">${p.colors.map((c) => c.n).join(", ")}</small></div>
        <div class="card__dots flex gap-1">${p.colors.map((c, ci) => `<i class="block h-3 w-3 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,.12)]" style="background:${c.c}" data-ci="${ci}" title="${c.n}"></i>`).join("")}</div>
      </div>`;
    track.appendChild(card);

    const img = $("img", card);
    // Colour dots swap the photo where a per-colour shot exists
    $$(".card__dots i", card).forEach((dot) => {
      const color = p.colors[dot.dataset.ci];
      if (!color.img) return;
      dot.style.cursor = "pointer";
      dot.addEventListener("mouseenter", () => swapImg(img, color.img));
      dot.addEventListener("click", () => swapImg(img, color.img));
    });
    if (p.alt) {
      card.addEventListener("mouseenter", () => swapImg(img, p.alt));
      card.addEventListener("mouseleave", () => swapImg(img, p.img));
    }
  });
  $("#colTotal").textContent = String(PRODUCTS.length).padStart(2, "0");

  function swapImg(img, file) {
    const next = src(file);
    if (img.getAttribute("src") === next) return;
    if (!window.gsap) { img.src = next; return; }
    gsap.to(img, { opacity: 0, duration: 0.18, onComplete: () => {
      img.src = next;
      gsap.to(img, { opacity: 1, duration: 0.3 });
    } });
  }

  let lenis = null;
  let smoothTo = (target) => document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });

  /* ---------------------------------------------------------------
     Without GSAP (CDN blocked) the page still works, just static
  --------------------------------------------------------------- */
  if (!window.gsap) {
    $("#loader").remove();
    $$(".look__img").forEach((el) => (el.style.clipPath = "none"));
    initHero(null);
    initUI();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------------------------------------------------------------
     Smooth scroll
  --------------------------------------------------------------- */
  if (window.Lenis && !reduceMotion) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    smoothTo = (target) => lenis.scrollTo(target, { duration: 1.4 });
  }
  // GSAP owns these transforms so percentages survive resizes
  gsap.set(".stage", { xPercent: -50, yPercent: -48, x: 0, y: 0 });
  gsap.set(".hero__ghost", { xPercent: -50, yPercent: -50, x: 0, y: 0 });

  /* ---------------------------------------------------------------
     Preloader
  --------------------------------------------------------------- */
  document.body.classList.add("is-loading");
  lenis?.stop();
  const imgs = $$("img[src]:not([loading=lazy])");
  const heroFiles = VARIANTS.flatMap((v) => [cutout(v, "front"), cutout(v, "back")]);
  const total = imgs.length + heroFiles.length;
  let loaded = 0;
  const progress = { v: 0 };
  const bump = () => {
    loaded++;
    gsap.to(progress, { v: (loaded / total) * 100, duration: 0.4, overwrite: true, onUpdate: renderProgress });
  };
  const renderProgress = () => {
    $("#loaderBar").style.width = progress.v + "%";
  };
  imgs.forEach((im) => (im.complete ? bump() : (im.addEventListener("load", bump, { once: true }), im.addEventListener("error", bump, { once: true }))));
  heroFiles.forEach((f) => { const im = new Image(); im.onload = im.onerror = bump; im.src = src(f); });

  const minTime = new Promise((r) => setTimeout(r, 1200));
  const allLoaded = new Promise((r) => {
    const check = () => (loaded >= total ? r() : requestAnimationFrame(check));
    check();
  });
  const maxTime = new Promise((r) => setTimeout(r, 4500));
  gsap.from(".loader__brand span", { yPercent: 110, duration: 1, ease: "expo.out" });

  Promise.all([minTime, Promise.race([allLoaded, maxTime])]).then(() => {
    gsap.to(progress, { v: 100, duration: 0.3, onUpdate: renderProgress });
    const tl = gsap.timeline({ delay: 0.35, onComplete: () => {
      $("#loader").remove();
      document.body.classList.remove("is-loading");
      lenis?.start();
      ScrollTrigger.refresh();
    } });
    tl.to(".loader__brand span", { yPercent: -110, duration: 0.6, ease: "expo.in" })
      .to("#loader", { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "expo.inOut" }, "-=0.1")
      .add(heroIntro(), "-=0.45");
  });

  const hero = initHero(gsap);
  initUI();
  initScroll();

  /* ---------------------------------------------------------------
     Hero intro
  --------------------------------------------------------------- */
  function heroIntro() {
    const tl = gsap.timeline();
    tl.from(".hero__title .char", { yPercent: 115, duration: 1.1, ease: "expo.out", stagger: 0.03 })
      .from(hero.fx, { scale: 0.4, duration: 1.8, ease: "expo.out" }, 0)
      .from("#garment", { opacity: 0, duration: 0.6 }, 0)
      .from(".floor", { scaleX: 0, opacity: 0, duration: 1.4, ease: "expo.out" }, 0.3)
      .from(".hero__ghost", { opacity: 0, scale: 1.15, duration: 1.6, ease: "expo.out" }, 0)
      .from(".swatches__group", { y: 40, opacity: 0, duration: 0.8, ease: "back.out(1.6)", stagger: 0.08 }, 0.5)
      .from(".viewctl", { opacity: 0, duration: 0.8 }, 0.6)
      .from(".readout > *, .hero__tag, .hero__hint", { y: 20, opacity: 0, duration: 0.8, ease: "expo.out", stagger: 0.06 }, 0.6)
      .from(".bar > *", { y: 20, opacity: 0, duration: 0.8, ease: "expo.out", stagger: 0.08 }, 0.7);
    return tl;
  }

  /* ---------------------------------------------------------------
     3D garment
  --------------------------------------------------------------- */
  function initHero(g) {
    const stage = $("#stage");
    const garment = $("#garment");
    const front = $("#imgFront");
    const back = $("#imgBack");
    const sideLabel = $("#readoutSide");

    const apply = (v) => {
      [[front, "front"], [back, "back"]].forEach(([img, side]) => {
        img.src = cutout(v, side);
        img.alt = `${v.name} ${v.color}, ${side}`;
      });
      garment.style.setProperty("--ar", v.ar);
      $("#readoutName").textContent = v.name;
      $("#readoutColor").textContent = v.color;
    };

    // Swatches
    let current = 0;
    VARIANTS.forEach((v, i) => {
      const b = document.createElement("button");
      b.className = "swatch" + (i === 0 ? " is-active" : "");
      b.style.setProperty("--c", v.c);
      b.dataset.tip = `${v.name} · ${v.color}`;
      b.setAttribute("aria-label", `${v.name} ${v.color}`);
      b.addEventListener("click", () => select(i));
      $(`.swatches__stack[data-group="${v.group}"]`).appendChild(b);
    });
    apply(VARIANTS[0]);

    // Rotation state
    let rotY = 0, target = 0;
    let dragging = false, lastX = 0, vel = 0;
    // Tweenable extras layered on top of the drag rotation
    const fx = { scale: 1 };

    function select(i) {
      if (i === current) return;
      current = i;
      $$(".swatch").forEach((s, k) => s.classList.toggle("is-active", k === i));
      if (!g) { apply(VARIANTS[i]); return; }
      g.timeline()
        .to(fx, { scale: 0.82, duration: 0.3, ease: "power2.in" })
        .to(garment, { opacity: 0, duration: 0.3, ease: "power2.in" }, 0)
        .add(() => { apply(VARIANTS[i]); })
        .to(fx, { scale: 1, duration: 0.7, ease: "expo.out" })
        .to(garment, { opacity: 1, duration: 0.4 }, "<");
      g.fromTo("#readout .readout__name, #readout .readout__color", { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "expo.out" });
    }

    function setView(view) {
      $$(".viewbtn").forEach((b) => b.classList.toggle("is-active", b.dataset.view === view));
      // Nearest angle that shows the requested side
      const base = view === "front" ? 0 : 180;
      target = Math.round((target - base) / 360) * 360 + base;
    }
    $$(".viewbtn").forEach((b) => b.addEventListener("click", () => setView(b.dataset.view)));

    // Drag to rotate (with inertia)
    stage.addEventListener("pointerdown", (e) => {
      dragging = true; lastX = e.clientX; vel = 0;
      $$(".viewbtn").forEach((b) => b.classList.remove("is-active"));
      stage.setPointerCapture(e.pointerId);
    });
    stage.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      target += dx * 0.75;
      vel = dx * 0.75;
    });
    const end = () => {
      if (!dragging) return;
      dragging = false;
    };
    stage.addEventListener("pointerup", end);
    stage.addEventListener("pointercancel", end);

    // Keyboard support
    stage.tabIndex = 0;
    stage.setAttribute("aria-label", "3D garment viewer. Use left and right arrow keys to rotate.");
    stage.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") target -= 30;
      if (e.key === "ArrowRight") target += 30;
    });

    const loop = () => {
      if (!dragging && Math.abs(vel) > 0.01) { target += vel; vel *= 0.92; }
      rotY += (target - rotY) * (dragging ? 0.18 : 0.08);
      const ang = rotY;
      garment.style.transform = `rotateY(${ang.toFixed(2)}deg) scale(${fx.scale.toFixed(3)})`;
      const n = ((ang % 360) + 360) % 360;
      const isBack = n > 90 && n < 270;
      if (sideLabel.dataset.side !== String(isBack)) {
        sideLabel.dataset.side = String(isBack);
        sideLabel.textContent = isBack ? "Back" : "Front";
      }
      // Faces darken as they turn edge-on to the viewer
      const light = 0.62 + 0.38 * Math.abs(Math.cos((ang * Math.PI) / 180));
      garment.style.setProperty("--light", light.toFixed(3));
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    return {
      fx,
    };
  }

  /* ---------------------------------------------------------------
     UI: menu, chips, modal, form, flip image
  --------------------------------------------------------------- */
  function initUI() {
    const g = window.gsap;
    const go = (hash) => smoothTo(hash);

    // In-page links
    $$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
      const hash = a.getAttribute("href");
      if (hash.length < 2) return;
      e.preventDefault();
      if (a.hasAttribute("data-menu-link")) { closeMenu(); setTimeout(() => go(hash), 500); }
      else go(hash);
    }));

    // Menu
    const menu = $("#menu");
    let menuTl;
    if (g) {
      menuTl = g.timeline({ paused: true })
        .set(menu, { visibility: "visible" })
        .to(menu, { clipPath: "inset(0 0 0% 0)", duration: 0.8, ease: "expo.inOut" })
        .from(".menu__links a span", { yPercent: 110, duration: 0.8, ease: "expo.out", stagger: 0.05 }, "-=0.35")
        .from(".menu__foot, .menu__close", { opacity: 0, duration: 0.4 }, "-=0.5");
    }
    function openMenu() {
      menu.setAttribute("aria-hidden", "false");
      if (menuTl) { menuTl.timeScale(1).play(); lenis?.stop(); }
      else { menu.style.visibility = "visible"; menu.style.clipPath = "none"; }
    }
    function closeMenu() {
      menu.setAttribute("aria-hidden", "true");
      if (menuTl) { menuTl.timeScale(1.6).reverse(); lenis?.start(); }
      else menu.style.visibility = "hidden";
    }
    $$("[data-menu-open]").forEach((b) => b.addEventListener("click", openMenu));
    $$("[data-menu-close]").forEach((b) => b.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeMenu(); closeQV(); } });

    // Flip the about photo front/back
    const flip = $("#flipimg");
    const chip = $("#flipChip");
    $(".about__media").addEventListener("click", () => {
      flip.classList.toggle("is-flipped");
      chip.textContent = flip.classList.contains("is-flipped") ? "Back · tap to flip" : "Front · tap to flip";
    });

    // Range chips filter the collection
    $$(".chip").forEach((chipEl) => chipEl.addEventListener("click", () => {
      const f = chipEl.dataset.filter;
      const active = chipEl.classList.toggle("is-active");
      $$(".chip").forEach((o) => o !== chipEl && o.classList.remove("is-active"));
      $$(".card").forEach((card) => {
        const hit = card.dataset.tags.split(" ").includes(f);
        card.classList.toggle("is-dim", active && !hit);
        card.classList.toggle("is-hit", active && hit);
      });
      if (active) go("#collection");
    }));

    // Quick view modal
    const qv = $("#qv");
    function openQV(i) {
      const p = PRODUCTS[i];
      $("#qvImg").src = src(p.img);
      $("#qvImg").alt = p.name;
      $("#qvName").textContent = p.name;
      $("#qvTag").textContent = p.label;
      $("#qvColors").textContent = p.colors.map((c) => c.n).join(" · ");
      $("#qvDesc").textContent = p.desc;
      qv.classList.add("is-open");
      qv.setAttribute("aria-hidden", "false");
      lenis?.stop();
    }
    function closeQV() {
      if (!qv.classList.contains("is-open")) return;
      qv.classList.remove("is-open");
      qv.setAttribute("aria-hidden", "true");
      lenis?.start();
    }
    $$("[data-qv]").forEach((b) => b.addEventListener("click", (e) => { e.stopPropagation(); openQV(+b.dataset.qv); }));
    $$(".card__img").forEach((el) => el.addEventListener("click", () => openQV(+el.closest(".card").dataset.index)));
    $$("[data-qv-close]").forEach((b) => b.addEventListener("click", closeQV));

    // Form
    $("#ctaForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const t = $("#toast");
      t.classList.add("is-show");
      e.target.reset();
      setTimeout(() => t.classList.remove("is-show"), 3200);
    });
  }

  /* ---------------------------------------------------------------
     Scroll animations
  --------------------------------------------------------------- */
  function initScroll() {
    // Progress bar + floating nav
    gsap.to("#progress", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.2 } });
    ScrollTrigger.create({
      trigger: ".hero", start: "bottom 20%",
      onEnter: () => $("#floatnav").classList.add("is-visible"),
      onLeaveBack: () => $("#floatnav").classList.remove("is-visible"),
    });

    // Hero: card eases back as you scroll away
    gsap.timeline({ scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } })
      .to(".hero__card", { scale: 0.94, borderRadius: 40, ease: "none" }, 0)
      .to(".hero__title", { yPercent: -40, opacity: 0.2, ease: "none" }, 0)
      .to(".stage", { yPercent: -30, ease: "none" }, 0);

    // Marquee: endless loop, speeds up with scroll velocity
    const mq = $("#marquee");
    mq.innerHTML += mq.innerHTML;
    const loop = gsap.to(mq, { xPercent: -50, duration: 28, ease: "none", repeat: -1 });
    let dir = 1;
    ScrollTrigger.create({
      onUpdate: (st) => {
        const v = st.getVelocity();
        if (v !== 0) dir = v > 0 ? 1 : -1;
        gsap.to(loop, { timeScale: dir * (1 + Math.min(Math.abs(v) / 250, 6)), duration: 0.3, overwrite: true });
        gsap.to(loop, { timeScale: dir, duration: 1.2, delay: 0.3, overwrite: false });
      },
    });

    // Headings: characters rise in
    $$(".display").forEach((h) => {
      gsap.from($$(".char", h), {
        yPercent: 115, duration: 1, ease: "expo.out", stagger: 0.025,
        scrollTrigger: { trigger: h, start: "top 85%" },
      });
    });

    // Paragraphs: word-by-word ink in, tied to scroll
    $$(".words").forEach((p) => {
      gsap.fromTo($$(".word", p), { opacity: 0.12 }, {
        opacity: 1, stagger: 0.05, ease: "none",
        scrollTrigger: { trigger: p, start: "top 85%", end: "bottom 55%", scrub: true },
      });
    });

    // Small fades
    $$(".reveal-up").forEach((el) => {
      gsap.from(el, { y: 30, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%" } });
    });

    // About image: clip reveal + parallax
    gsap.fromTo(".about__media", { clipPath: "inset(20% 10% 20% 10% round 22px)" },
      { clipPath: "inset(0% 0% 0% 0% round 22px)", ease: "none", scrollTrigger: { trigger: ".about", start: "top 90%", end: "top 30%", scrub: true } });
    gsap.fromTo(".flipimg img", { yPercent: -8 }, { yPercent: 0, ease: "none",
      scrollTrigger: { trigger: ".about__media", start: "top bottom", end: "bottom top", scrub: true } });

    // Chips pop + counters
    gsap.from(".chip", { y: 24, opacity: 0, scale: 0.9, duration: 0.7, ease: "back.out(2)", stagger: 0.06,
      scrollTrigger: { trigger: ".chips", start: "top 90%" } });
    $$("[data-count]").forEach((el) => {
      const n = { v: 0 };
      gsap.to(n, { v: +el.dataset.count, duration: 1.6, ease: "power3.out",
        onUpdate: () => (el.textContent = Math.round(n.v)),
        scrollTrigger: { trigger: el, start: "top 90%" } });
    });

    // Collection: pinned horizontal scroll on desktop
    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px)", () => {
      const viewport = $(".collection__viewport");
      const dist = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
      const cards = $$(".card");
      gsap.to(track, {
        x: () => -dist(), ease: "none",
        scrollTrigger: {
          trigger: ".collection", start: "top top", end: () => "+=" + (dist() + 200), pin: true, scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (st) => {
            const i = Math.min(cards.length, Math.floor(st.progress * (cards.length - 1)) + 1);
            $("#colIndex").textContent = String(i).padStart(2, "0");
          },
        },
      });
    });
    gsap.from(".card", { y: 80, opacity: 0, rotate: 3, duration: 1, ease: "expo.out", stagger: 0.07,
      scrollTrigger: { trigger: ".collection", start: "top 70%" } });

    // Alley: soft upward reveals, captions that follow, and a restrained image drift.
    $$(".look").forEach((look, i) => {
      const frame = $(".look__img", look);
      const image = $("img", look);
      const caption = $("figcaption", look);

      if (reduceMotion) {
        gsap.set(frame, { clipPath: "inset(0% 0 0 0 round 14px)", y: 0, autoAlpha: 1 });
        return;
      }

      const reveal = gsap.timeline({
        delay: i * 0.14,
        scrollTrigger: { trigger: look, start: "top 84%", once: true },
      });
      reveal.fromTo(frame,
        { clipPath: "inset(100% 0 0 0 round 14px)", y: 34, autoAlpha: 0 },
        { clipPath: "inset(0% 0 0 0 round 14px)", y: 0, autoAlpha: 1, duration: 1.2, ease: "power4.out" }
      ).fromTo(caption,
        { y: 16, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.65, ease: "power3.out" },
        "-=0.52"
      );

      gsap.fromTo(image, { yPercent: -9, scale: 1.06 }, { yPercent: 0, scale: 1, ease: "none",
        scrollTrigger: { trigger: look, start: "top bottom", end: "bottom top", scrub: true } });
    });
    gsap.fromTo("#bigword", { xPercent: 0 }, { xPercent: -35, ease: "none",
      scrollTrigger: { trigger: ".alley__big", start: "top bottom", end: "bottom top", scrub: true } });

    // CTA: scale up into place
    gsap.from(".cta", { scale: 0.92, borderRadius: 60, ease: "none",
      scrollTrigger: { trigger: ".cta", start: "top bottom", end: "top 50%", scrub: true } });
  }
})();
