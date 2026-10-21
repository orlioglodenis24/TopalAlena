import '@fontsource/unbounded/400.css'
import '@fontsource/unbounded/600.css'
import '@fontsource/unbounded/700.css'
import '@fontsource/cormorant-garamond/500-italic.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import './style.css'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { site } from './content.js'
import { Space } from './space.js'
import { Ambience } from './audio.js'

gsap.registerPlugin(ScrollTrigger)

const $ = (s, r = document) => r.querySelector(s)
const $$ = (s, r = document) => [...r.querySelectorAll(s)]
const get = (path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), site)
const pad = (n, l = 2) => String(n).padStart(l, '0')

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const isMobile = matchMedia('(max-width: 768px)').matches
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches

const audio = new Ambience()

// ═══════════════════════════════════════════════════════════
//  КОНТЕНТ
// ═══════════════════════════════════════════════════════════
function bindContent() {
  document.title = site.meta.title
  $('meta[name="description"]').content = site.meta.description

  $$('[data-c]').forEach((el) => {
    const v = get(el.dataset.c)
    if (v == null) return
    el.textContent = v
    if (el.classList.contains('glitch')) el.dataset.text = String(v).toUpperCase()
  })
  $$('[data-href]').forEach((el) => {
    const raw = el.dataset.href
    el.href = raw.startsWith('mailto:') ? `mailto:${get(raw.slice(7))}` : get(raw)
  })
  $$('[data-src]').forEach((el) => (el.src = get(el.dataset.src)))

  const socialItem = (s) => `
    <li><a href="${s.url}" target="_blank" rel="noopener" data-social="${s.name}">
      <span class="name">${s.name}</span><span class="border"></span>
      <span class="status">Открыть</span>
    </a></li>`

  const renderers = {
    socials: () => site.socials.map(socialItem).join(''),
    'socials-plain': () => site.socials.map((s) => `<a href="${s.url}" target="_blank" rel="noopener">${s.name}</a>`).join(''),
    about: () => site.about.map((p) => `<p>${p}</p>`).join(''),
    facts: () => site.facts.map((f) => `<div><dt>${f.label}</dt><dd>${f.value}</dd></div>`).join(''),
    tools: () => site.tools.map((t) => `<li>${t}</li>`).join(''),
    skills: () => site.skills.map((t) => `<li>${t}</li>`).join(''),
    filters: () =>
      ['Все', ...new Set(site.projects.map((p) => p.type).filter(Boolean))]
        .map((t, i) => `<button type="button" role="tab" class="${i ? '' : 'is-active'}" data-filter="${i ? t : ''}">${t}</button>`)
        .join(''),
    projects: () =>
      site.projects
        .map(
          (p, i) => `
        <button class="card" type="button" data-case="${i}" data-type="${p.type || ''}" data-cursor="Открыть">
          <div class="card-media">
            <span class="card-num">№${pad(i + 1)}</span>
            <span class="card-shots">${(p.gallery || []).length || 1} кадр.</span>
            <img src="${p.cover}" alt="${p.title}" loading="lazy" />
          </div>
          <div class="card-meta">
            <h3 class="card-title">${p.title}</h3>
            <span class="card-year">${p.year}</span>
            <span class="card-cat">${p.category}</span>
          </div>
        </button>`
        )
        .join(''),
    services: () =>
      site.services
        .map(
          (s, i) => `
        <article class="stack-card" style="--i:${i}">
          <span class="stack-bg" aria-hidden="true">${pad(i + 1)}</span>
          <div class="stack-head">
            <span class="stack-num">[ Направление ${pad(i + 1)} / ${pad(site.services.length)} ]</span>
            <div>
              <h3 class="stack-title">${s.title}</h3>
              <p class="stack-sub">${s.subtitle}</p>
            </div>
            <ul class="stack-deco"><li></li><li></li><li></li><li></li><li></li></ul>
          </div>
          <div class="stack-body">
            <p class="stack-text">${s.text}</p>
            <ul class="stack-list">${s.list.map((l) => `<li>${l}</li>`).join('')}</ul>
          </div>
        </article>`
        )
        .join(''),
    process: () =>
      site.process
        .map(
          (p, i) => `
        <li class="process-item">
          <div class="process-n">${pad(i + 1)}</div>
          <h3 class="process-t">${p.title}</h3>
          <p class="process-x">${p.text}</p>
        </li>`
        )
        .join(''),
  }
  $$('[data-render]').forEach((el) => {
    const fn = renderers[el.dataset.render]
    if (fn) el.innerHTML = fn()
  })
  $('.works-count').textContent = pad(site.projects.length)
  $('.year').textContent = new Date().getFullYear()
}

// разбивка на буквы / слова
// breakWords — переносить строку на пробелах (имя в hero в две строки)
function splitChars(el, { breakWords = false } = {}) {
  const text = el.textContent
  el.setAttribute('aria-label', text)
  el.innerHTML = [...text]
    .map((c) => (c === ' ' && breakWords ? '<br />' : `<span class="ch" aria-hidden="true">${c === ' ' ? '&nbsp;' : c}</span>`))
    .join('')
  return $$('.ch', el)
}

function splitWords(el) {
  const out = []
  ;[...el.childNodes].forEach((node) => {
    if (node.nodeType === 3) {
      node.textContent.split(' ').forEach((word, i, arr) => {
        if (word) {
          const s = document.createElement('span')
          s.className = 'w'
          s.textContent = word
          el.insertBefore(s, node)
          out.push(s)
        }
        if (i < arr.length - 1) el.insertBefore(document.createTextNode(' '), node)
      })
      node.remove()
    } else {
      node.classList.add('w')
      out.push(node)
    }
  })
  return out
}

// ═══════════════════════════════════════════════════════════
//  SMOOTH SCROLL
// ═══════════════════════════════════════════════════════════
let lenis
function initScroll() {
  lenis = new Lenis({ lerp: reduced ? 1 : 0.09, smoothWheel: !reduced })
  lenis.stop()
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)

  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-scroll-to]')
    if (!a) return
    e.preventDefault()
    const target = a.getAttribute('href')
    const go = () => lenis.scrollTo(target === '#top' ? 0 : target, { duration: 1.6 })
    if (menuOpen) closeMenu().then(go)
    else go()
  })
}

// ═══════════════════════════════════════════════════════════
//  WEBGL SPACE
// ═══════════════════════════════════════════════════════════
let space = null
function initSpace() {
  try {
    space = new Space($('#gl'), { mobile: isMobile })
  } catch (err) {
    console.warn('WebGL недоступен, включён фолбэк', err)
    document.body.classList.add('no-webgl')
  }
}

// ═══════════════════════════════════════════════════════════
//  LOADER
// ═══════════════════════════════════════════════════════════
function runLoader() {
  return new Promise((resolve) => {
    const loader = $('#loader')
    const num = $('.loader-num')
    const time = $('.loader-time')
    const cnv = $('.loader-noise')
    const ctx = cnv.getContext('2d')
    cnv.width = 160
    cnv.height = 90
    const img = ctx.createImageData(160, 90)
    let raf
    const noise = () => {
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 255
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v
        img.data[i + 3] = 255
      }
      ctx.putImageData(img, 0, 0)
      raf = requestAnimationFrame(noise)
    }
    noise()

    const assets = [site.photo, site.reel.poster, ...site.projects.map((p) => p.cover)]
    let loaded = 0
    const loads = assets.map(
      (src) =>
        new Promise((r) => {
          const im = new Image()
          im.onload = im.onerror = () => {
            loaded++
            r()
          }
          im.src = src
        })
    )
    const ready = Promise.all([...loads, document.fonts.ready])

    const state = { p: 0 }
    const start = performance.now()
    const minTime = reduced ? 300 : 2400
    let done = false
    ready.then(() => (done = true))

    const step = () => {
      const elapsed = performance.now() - start
      const assetP = loaded / assets.length
      const timeP = Math.min(elapsed / minTime, 1)
      const target = Math.min(assetP, timeP) * (done ? 1 : 0.96)
      state.p += (target - state.p) * 0.12
      if (done && timeP >= 1 && state.p > 0.995) state.p = 1
      num.textContent = pad(Math.round(state.p * 100), 3)
      const s = Math.floor(elapsed / 1000)
      time.textContent = `00:${pad(Math.floor(s / 60))}:${pad(s % 60)}`
      if (state.p < 1) return requestAnimationFrame(step)

      // выключение «телевизора»
      const tl = gsap.timeline({
        onComplete: () => {
          cancelAnimationFrame(raf)
          loader.remove()
          resolve()
        },
      })
      tl.to('.loader-screen', { duration: 0.12, x: 14, skewX: 12, repeat: 3, yoyo: true, ease: 'steps(1)' })
        .set('.loader-screen', { x: 0, skewX: 0 })
        .to(loader, { duration: 0.32, scaleY: 0.004, ease: 'power3.in', backgroundColor: '#d8f1fd' }, '+=0.05')
        .to(loader, { duration: 0.26, scaleX: 0, ease: 'power3.in' })
    }
    step()
  })
}

// ═══════════════════════════════════════════════════════════
//  HEADER / HERO INTRO
// ═══════════════════════════════════════════════════════════
function heroIntro() {
  const logoChars = splitChars($('.logo-name'))
  const nameChars = splitChars($('.hero-name'), { breakWords: true })

  space?.boot()

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
  tl.from('.viewfinder', { opacity: 0, duration: 0.6, ease: 'steps(4)' })
    .from('.vf-c', { scale: 2.2, opacity: 0, duration: 1, stagger: 0.06 }, '<')
    .from(nameChars, { yPercent: 115, duration: 1.4, stagger: 0.07 }, '-=0.6')
    .from(nameChars, { opacity: 0, duration: 0.06, repeat: 4, yoyo: true, ease: 'steps(1)', stagger: 0.07 }, '<')
    .from('.hero-kicker', { y: 20, opacity: 0, duration: 1 }, '-=1')
    .from('.hero-sub .serif', { y: 40, opacity: 0, duration: 1.2, stagger: 0.12 }, '-=0.9')
    .from('.hero-scroll', { opacity: 0, duration: 1 }, '-=0.8')
    .from(logoChars, { opacity: 0, duration: 0.04, stagger: { each: 0.06, from: 'random' }, repeat: 2, yoyo: true, ease: 'steps(1)' }, 0.4)
    .from('.logo-sub, .header-right', { opacity: 0, y: -10, duration: 0.8 }, 0.8)
  return tl
}

function liveUI() {
  const t0 = performance.now()
  const tcs = $$('.timecode')
  const fc = $('.frame-count')
  let frame = 46
  setInterval(() => {
    const ms = performance.now() - t0
    const s = Math.floor(ms / 1000)
    const ff = Math.floor((ms % 1000) / (1000 / 24))
    const tc = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(ff)}`
    tcs.forEach((el) => (el.textContent = tc))
  }, 1000 / 24)
  setInterval(() => {
    frame = frame >= 279 ? 1 : frame + 1
    if (fc) fc.textContent = `${frame}/279`
  }, 2400)

  // случайный глитч заголовков
  const glitches = $$('.glitch')
  const fire = () => {
    const el = glitches[Math.floor(Math.random() * glitches.length)]
    el.classList.add('is-glitch')
    setTimeout(() => el.classList.remove('is-glitch'), 450)
    setTimeout(fire, 2500 + Math.random() * 4500)
  }
  if (!reduced) setTimeout(fire, 3000)

  // местное время
  const lt = $('.local-time')
  const clock = () =>
    (lt.textContent = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: site.timeZone }))
  clock()
  setInterval(clock, 20000)
}

// ═══════════════════════════════════════════════════════════
//  SCROLL ANIMATIONS
// ═══════════════════════════════════════════════════════════
function initAnimations() {
  // — видимость WebGL: рендерим, только когда сцена на экране
  const vis = { hero: true, descent: false }
  const syncGL = () => {
    const on = vis.hero || vis.descent
    space?.setActive(on)
    $('#gl').style.visibility = on ? 'visible' : 'hidden'
  }
  ScrollTrigger.create({ trigger: '#hero', start: 'top bottom', end: 'bottom top', onToggle: (s) => ((vis.hero = s.isActive), syncGL()) })
  ScrollTrigger.create({ trigger: '#descent', start: 'top bottom', end: 'bottom top', onToggle: (s) => ((vis.descent = s.isActive), syncGL()) })

  // — hero уезжает, камера делает первые шаги
  gsap.to('.hero-content', {
    yPercent: -35,
    opacity: 0,
    ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
  })
  gsap.to('.viewfinder, .hero-scroll', {
    opacity: 0,
    ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: '60% top', scrub: true },
  })
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    onUpdate: (s) => space?.setProgress(s.progress * 0.05),
  })

  // — манифест: слова «загораются» по мере чтения
  const words = splitWords($('.manifesto'))
  if (!reduced) {
    gsap.to(words, {
      color: '#d8f1fd',
      stagger: 0.1,
      ease: 'none',
      scrollTrigger: { trigger: '.manifesto', start: 'top 80%', end: 'bottom 45%', scrub: true },
    })
    gsap.to(words.filter((w) => w.classList.contains('accent')), {
      color: '#bad3f7',
      scrollTrigger: { trigger: '.manifesto', start: 'bottom 50%', toggleActions: 'play none none reverse' },
    })
  }

  // — строки заголовков выезжают из маски
  $$('.reveal-line > span').forEach((el) => {
    gsap.from(el, {
      yPercent: 110,
      rotate: 3,
      duration: 1.3,
      ease: 'power4.out',
      scrollTrigger: { trigger: el.parentElement, start: 'top 88%' },
    })
  })

  // — section tags «печатаются»
  $$('.section-tag').forEach((el) => {
    gsap.from(el, { opacity: 0, x: -20, duration: 0.8, scrollTrigger: { trigger: el, start: 'top 90%' } })
  })

  gsap.from('.intro-col', {
    y: 60,
    opacity: 0,
    duration: 1.2,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.intro-cols', start: 'top 80%' },
  })

  // — about
  gsap.fromTo(
    '.about-photo-frame img',
    { yPercent: -4 },
    { yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.about-photo', start: 'top bottom', end: 'bottom top', scrub: true } }
  )
  gsap.from('.about-photo-frame', {
    clipPath: 'inset(50% 0 50% 0)',
    duration: 1.4,
    ease: 'power4.inOut',
    scrollTrigger: { trigger: '.about-photo', start: 'top 75%' },
  })
  gsap.from('.facts > div, .tools li', {
    y: 24,
    opacity: 0,
    duration: 0.8,
    stagger: 0.05,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.facts', start: 'top 85%' },
  })

  // — пролёт сквозь сцену
  const depth = $('.descent-depth')
  ScrollTrigger.create({
    trigger: '#descent',
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate: (s) => {
      const p = s.progress
      space?.setProgress(0.05 + p * 0.95)
      space?.setGlow(gsap.utils.clamp(0, 1, (p - 0.8) / 0.2) * 0.8)
      depth.textContent = pad(Math.round(p * 240), 3)
      audio.setTension(p)
    },
  })
  gsap.to('.descent-text', {
    opacity: 0,
    y: -80,
    filter: 'blur(8px)',
    ease: 'power1.in',
    scrollTrigger: { trigger: '#descent', start: '18% top', end: '40% top', scrub: true },
  })

  // — бегущая строка: скорость и направление зависят от скролла
  const track = $('.marquee-track')
  const loop = gsap.to(track, { xPercent: -50, duration: 22, ease: 'none', repeat: -1 })
  let dir = 1
  lenis.on('scroll', ({ velocity }) => {
    if (Math.abs(velocity) > 0.5) dir = velocity > 0 ? 1 : -1
    gsap.to(loop, { timeScale: dir * (1 + Math.min(Math.abs(velocity) * 0.25, 5)), duration: 0.3, overwrite: true })
  })
  gsap.from('.notice-body > *', {
    y: 30,
    opacity: 0,
    stagger: 0.1,
    duration: 1,
    scrollTrigger: { trigger: '.notice', start: 'top 80%' },
  })

  // — работы: карточки сетки проявляются по рядам
  ScrollTrigger.batch('.card', {
    start: 'top 90%',
    once: true,
    onEnter: (batch) => gsap.from(batch, { y: 60, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out' }),
  })
  gsap.from('.works-title', {
    yPercent: 40,
    opacity: 0,
    duration: 1.2,
    ease: 'power4.out',
    scrollTrigger: { trigger: '#works', start: 'top 70%' },
  })

  // — направления: карточки складываются в стопку
  const cards = $$('.stack-card')
  cards.forEach((card, i) => {
    const next = cards[i + 1]
    if (!next) return
    gsap.fromTo(
      card,
      { scale: 1, filter: 'brightness(1)' },
      {
        scale: 0.92,
        filter: 'brightness(0.45)',
        ease: 'none',
        scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 15%', scrub: true },
      }
    )
  })
  cards.forEach((card) => {
    gsap.from(card.querySelectorAll('.stack-list li'), {
      x: 40,
      opacity: 0,
      stagger: 0.08,
      duration: 0.8,
      scrollTrigger: { trigger: card, start: 'top 60%' },
    })
  })

  // — шоурил раскрывается на весь экран
  const reelTl = gsap.timeline({
    scrollTrigger: { trigger: '#reel', start: 'top top', end: 'bottom bottom', scrub: true },
  })
  reelTl
    .to('.reel-frame', { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.inOut' })
    .to('.reel-frame img', { scale: 1, ease: 'power2.inOut' }, 0)
    .from('.reel-title', { yPercent: 60, opacity: 0, ease: 'power2.out' }, 0.3)

  // — процесс
  $$('.process-item').forEach((item, i) => {
    gsap.to(item, {
      '--p': 1,
      duration: 1.2,
      delay: i * 0.12,
      ease: 'power3.inOut',
      scrollTrigger: { trigger: '.process-list', start: 'top 80%' },
    })
    gsap.from(item.children, {
      y: 40,
      opacity: 0,
      duration: 1,
      delay: i * 0.12,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.process-list', start: 'top 80%' },
    })
  })

  // — контакты и футер
  gsap.from('.contact-main > *, .social-list--big li', {
    y: 40,
    opacity: 0,
    duration: 1,
    stagger: 0.07,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.contact-grid', start: 'top 80%' },
  })
  const bigChars = splitChars($('.footer-big span'))
  gsap.from(bigChars, {
    yPercent: 100,
    opacity: 0,
    stagger: 0.06,
    duration: 1.4,
    ease: 'power4.out',
    scrollTrigger: { trigger: '.footer-big', start: 'top 95%' },
  })
}

// ═══════════════════════════════════════════════════════════
//  ФОНАРИК НА ФОТО
// ═══════════════════════════════════════════════════════════
function initFlashlight() {
  const frame = $('.about-photo-frame')
  const set = (x, y) => {
    frame.style.setProperty('--x', `${x}px`)
    frame.style.setProperty('--y', `${y}px`)
  }
  if (finePointer) {
    frame.addEventListener('pointerenter', () => gsap.to(frame, { '--r': '190px', duration: 0.6, ease: 'power3.out' }))
    frame.addEventListener('pointerleave', () => gsap.to(frame, { '--r': '0px', duration: 0.5 }))
    frame.addEventListener('pointermove', (e) => {
      const r = frame.getBoundingClientRect()
      set(e.clientX - r.left, e.clientY - r.top)
    })
  } else {
    // на тач-устройствах фонарик бродит сам
    frame.style.setProperty('--r', '140px')
    const o = { a: 0 }
    gsap.to(o, {
      a: Math.PI * 2,
      duration: 9,
      repeat: -1,
      ease: 'none',
      onUpdate: () => {
        const w = frame.offsetWidth
        const h = frame.offsetHeight
        set(w * (0.5 + Math.cos(o.a) * 0.22), h * (0.45 + Math.sin(o.a * 2) * 0.18))
      },
    })
  }
}

// ═══════════════════════════════════════════════════════════
//  MENU
// ═══════════════════════════════════════════════════════════
let menuOpen = false
let menuTl
function initMenu() {
  const menu = $('#menu')
  const btn = $('.menu-btn')
  menuTl = gsap
    .timeline({ paused: true })
    .set(menu, { visibility: 'visible' })
    .to(menu, { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'power4.inOut' })
    .from('.menu-label, .menu-info-tab', { opacity: 0, duration: 0.05, repeat: 4, yoyo: true, ease: 'steps(1)' }, '-=0.2')
    .from('.menu-deco li', { opacity: 0, stagger: 0.05, duration: 0.01 }, '<')
    .from('.menu-link', { yPercent: 100, opacity: 0, stagger: 0.05, duration: 0.7, ease: 'power3.out' }, '-=0.3')
    .from('.menu-info', { scaleY: 0, transformOrigin: 'top', duration: 0.6, ease: 'power3.inOut' }, '<0.1')
    .from('.menu-foot > *', { opacity: 0, duration: 0.5 }, '-=0.3')

  btn.addEventListener('click', () => (menuOpen ? closeMenu() : openMenu()))
  document.addEventListener('keydown', (e) => e.key === 'Escape' && menuOpen && closeMenu())

  $$('.menu-link').forEach((l) => l.addEventListener('pointerenter', () => audio.blip(1200)))
}
function openMenu() {
  menuOpen = true
  lenis.stop()
  $('#menu').classList.add('is-open')
  $('#menu').setAttribute('aria-hidden', 'false')
  $('.menu-btn').setAttribute('aria-expanded', 'true')
  $('.menu-btn-text').textContent = '[ Закрыть ]'
  // отмечаем текущий раздел
  const ids = ['top', 'about', 'works', 'services', 'reel', 'contact']
  let current = 'top'
  ids.forEach((id) => {
    const el = document.getElementById(id)
    if (el && el.getBoundingClientRect().top < window.innerHeight * 0.5) current = id
  })
  $$('.menu-link').forEach((l) => (l.querySelector('em').textContent = l.getAttribute('href') === `#${current}` ? 'Вы здесь' : ''))
  audio.blip(440)
  return menuTl.timeScale(1).play()
}
function closeMenu() {
  menuOpen = false
  $('.menu-btn').setAttribute('aria-expanded', 'false')
  $('#menu').setAttribute('aria-hidden', 'true')
  $('.menu-btn-text').textContent = '[ Меню ]'
  audio.blip(330)
  return menuTl
    .timeScale(1.8)
    .reverse()
    .then(() => {
      $('#menu').classList.remove('is-open')
      lenis.start()
    })
}

// ═══════════════════════════════════════════════════════════
//  CASE MODAL
// ═══════════════════════════════════════════════════════════
function embed(url) {
  if (!url) return ''
  const yt = url.match(/(?:youtu\.be\/|v=|shorts\/)([\w-]{11})/)
  if (yt) return `<iframe src="https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0" allow="autoplay; fullscreen" allowfullscreen></iframe>`
  const vm = url.match(/vimeo\.com\/(\d+)/)
  if (vm) return `<iframe src="https://player.vimeo.com/video/${vm[1]}?autoplay=1" allow="autoplay; fullscreen" allowfullscreen></iframe>`
  return `<video src="${url}" controls autoplay playsinline></video>`
}

const isVideo = (src) => /\.(mp4|webm|mov)$/i.test(src)
function media(src, attrs = '') {
  return isVideo(src) ? `<video src="${src}" muted loop playsinline autoplay preload="metadata"></video>` : `<img src="${src}" alt="" ${attrs} />`
}

// ═══════════════════════════════════════════════════════════
//  ПРОСМОТР КАДРОВ (на весь экран)
// ═══════════════════════════════════════════════════════════
const viewer = {
  isOpen: false,
  list: [],
  i: 0,
  init() {
    this.el = $('.viewer')
    this.stage = $('.viewer-stage')
    this.count = $('.viewer-count')
    $('.viewer-close').addEventListener('click', () => this.close())
    $('.viewer-prev').addEventListener('click', () => this.show(this.i - 1))
    $('.viewer-next').addEventListener('click', () => this.show(this.i + 1))
    this.stage.addEventListener('click', (e) => e.target === this.stage && this.close())
    document.addEventListener('keydown', (e) => {
      if (!this.isOpen) return
      if (e.key === 'Escape') this.close()
      if (e.key === 'ArrowRight') this.show(this.i + 1)
      if (e.key === 'ArrowLeft') this.show(this.i - 1)
    })
    // свайп на тач-экранах
    let x0 = null
    this.stage.addEventListener('pointerdown', (e) => (x0 = e.clientX))
    this.stage.addEventListener('pointerup', (e) => {
      if (x0 == null) return
      const dx = e.clientX - x0
      x0 = null
      if (Math.abs(dx) > 50) this.show(this.i + (dx < 0 ? 1 : -1))
    })
  },
  open(list, i) {
    if (!list?.length) return
    this.list = list
    this.isOpen = true
    this.el.classList.add('is-open')
    this.el.setAttribute('aria-hidden', 'false')
    this.el.classList.toggle('is-single', list.length < 2)
    this.show(i)
    gsap.fromTo(this.el, { opacity: 0 }, { opacity: 1, duration: 0.35 })
  },
  show(i) {
    const n = this.list.length
    this.i = (i + n) % n
    const src = this.list[this.i]
    this.stage.innerHTML = isVideo(src) ? `<video src="${src}" controls autoplay playsinline></video>` : `<img src="${src}" alt="" />`
    this.count.textContent = `${pad(this.i + 1)} / ${pad(n)}`
    gsap.from(this.stage.firstElementChild, { opacity: 0, scale: 0.97, duration: 0.45, ease: 'power3.out' })
  },
  close() {
    this.isOpen = false
    gsap.to(this.el, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        this.el.classList.remove('is-open')
        this.el.setAttribute('aria-hidden', 'true')
        this.stage.innerHTML = ''
      },
    })
  },
}

// ═══════════════════════════════════════════════════════════
//  ФИЛЬТР РАБОТ
// ═══════════════════════════════════════════════════════════
function initFilter() {
  const btns = $$('[data-filter]')
  btns.forEach((b) =>
    b.addEventListener('click', () => {
      btns.forEach((x) => x.classList.toggle('is-active', x === b))
      const type = b.dataset.filter
      const cards = $$('.card')
      const show = cards.filter((c) => !type || c.dataset.type === type)
      cards.forEach((c) => c.classList.toggle('is-hidden', !show.includes(c)))
      $('.works-count').textContent = pad(show.length)
      gsap.fromTo(show, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: 'power3.out', overwrite: true })
      ScrollTrigger.refresh()
      audio.blip(660)
    })
  )
}

let modalOpen = false
function initModal() {
  const modal = $('#case')
  const content = $('.modal-content', modal)
  const body = $('.modal-body', modal)

  let current = 0
  const fill = (i) => {
    current = i
    const p = site.projects[i]
    const n = site.projects.length
    const prev = site.projects[(i - 1 + n) % n]
    const next = site.projects[(i + 1) % n]
    content.innerHTML = `
      <div class="case-hero ${p.video ? 'has-video' : ''}">${p.video ? embed(p.video) : `<img src="${p.cover}" alt="${p.title}" />`}</div>
      <div class="case-inner">
        <p class="case-num">Проект №${pad(i + 1)} / ${pad(n)}</p>
        <h2 class="case-title" id="case-title">${p.title}</h2>
        <dl class="case-meta">
          <div><dt>Тип</dt><dd>${p.category}</dd></div>
          <div><dt>Год</dt><dd>${p.year}</dd></div>
          <div><dt>Роль</dt><dd>${p.role}</dd></div>
          <div><dt>Инструменты</dt><dd>${p.tools.join(', ')}</dd></div>
        </dl>
        <p class="case-desc">${p.description}</p>
        ${p.link ? `<p style="margin-bottom:40px"><a class="btn" href="${p.link}" target="_blank" rel="noopener"><span>Смотреть проект</span></a></p>` : ''}
        <div class="case-gallery">${(p.gallery || [])
          .map((g, k) => `<button type="button" class="case-shot" data-shot="${k}" data-cursor="Смотреть">${media(g, 'loading="lazy"')}</button>`)
          .join('')}</div>
        <nav class="case-nav">
          <button type="button" data-go="${(i - 1 + n) % n}">← Предыдущее<strong>${prev.title}</strong></button>
          <button type="button" data-go="${(i + 1) % n}">Следующее →<strong>${next.title}</strong></button>
        </nav>
      </div>`
    body.scrollTop = 0
    gsap.from(content.children, { opacity: 0, y: 30, duration: 0.7, stagger: 0.08, ease: 'power3.out' })
  }

  const open = (html) => {
    modalOpen = true
    lenis.stop()
    modal.classList.add('is-open')
    modal.setAttribute('aria-hidden', 'false')
    html()
    gsap.to('.modal-bg', { opacity: 1, duration: 0.5 })
    // x: 0 — иначе GSAP прибавит к анимации сдвиг из CSS (translateX(100%) в пикселях)
    gsap.fromTo(body, { x: 0, xPercent: 100 }, { xPercent: 0, duration: 0.9, ease: 'power4.out' })
    audio.blip(520)
  }
  const close = () => {
    if (!modalOpen) return
    modalOpen = false
    gsap.to('.modal-bg', { opacity: 0, duration: 0.4 })
    gsap.to(body, {
      xPercent: 100,
      duration: 0.6,
      ease: 'power3.in',
      onComplete: () => {
        modal.classList.remove('is-open')
        modal.setAttribute('aria-hidden', 'true')
        content.innerHTML = ''
        lenis.start()
      },
    })
  }

  document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-case]')
    if (card) return open(() => fill(+card.dataset.case))
    const go = e.target.closest('[data-go]')
    if (go) return fill(+go.dataset.go)
    const shot = e.target.closest('[data-shot]')
    if (shot) return viewer.open(site.projects[current].gallery, +shot.dataset.shot)
    if (e.target.closest('[data-close]')) close()
  })
  document.addEventListener('keydown', (e) => {
    if (!modalOpen || viewer.isOpen) return
    const n = site.projects.length
    if (e.key === 'Escape') close()
    // стрелки — листать проекты, пока открыта карточка
    if (e.key === 'ArrowRight' && content.querySelector('.case-nav')) fill((current + 1) % n)
    if (e.key === 'ArrowLeft' && content.querySelector('.case-nav')) fill((current - 1 + n) % n)
  })

  // шоурил
  $('.reel-frame').addEventListener('click', () =>
    open(() => {
      content.innerHTML = site.reel.url
        ? `<div class="case-hero has-video">${embed(site.reel.url)}</div><div class="case-inner"><p class="case-num">Showreel</p><h2 class="case-title" id="case-title">Шоурил</h2></div>`
        : `<div class="case-hero"><img src="${site.reel.poster}" alt="" /></div>
           <div class="case-inner"><p class="case-num"><span class="rec-dot"></span> Рендер ещё идёт</p>
           <h2 class="case-title" id="case-title">Шоурил скоро</h2>
           <p class="case-desc">Здесь появится свежий шоурил. А пока — загляни в работы или напиши напрямую.</p></div>`
    })
  )
}

// ═══════════════════════════════════════════════════════════
//  CURSOR
// ═══════════════════════════════════════════════════════════
function initCursor() {
  if (!finePointer) return
  const cur = $('.cursor')
  const dot = $('.cursor-dot')
  const ring = $('.cursor-ring')
  const label = $('.cursor-label')
  const dx = gsap.quickTo(dot, 'x', { duration: 0.08 })
  const dy = gsap.quickTo(dot, 'y', { duration: 0.08 })
  const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' })
  const ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' })
  gsap.set(cur, { opacity: 0 })
  window.addEventListener('pointermove', (e) => {
    if (!cur.dataset.ready) (cur.dataset.ready = 1), gsap.to(cur, { opacity: 1, duration: 0.3 })
    dx(e.clientX)
    dy(e.clientY)
    rx(e.clientX)
    ry(e.clientY)
  })
  document.addEventListener('pointerover', (e) => {
    const t = e.target.closest('[data-cursor]')
    const link = e.target.closest('a, button')
    cur.classList.toggle('is-hover', !!t)
    cur.classList.toggle('is-link', !t && !!link)
    label.textContent = t ? t.dataset.cursor : ''
  })
  document.addEventListener('pointerleave', () => gsap.to(cur, { opacity: 0 }))
  document.addEventListener('pointerenter', () => gsap.to(cur, { opacity: 1 }))
}

// ═══════════════════════════════════════════════════════════
//  MISC
// ═══════════════════════════════════════════════════════════
function initMisc() {
  // звук
  const sb = $('.sound-btn')
  sb.addEventListener('click', () => {
    const on = audio.toggle()
    sb.setAttribute('aria-pressed', on)
    $('.sound-label').textContent = on ? 'Звук: вкл' : 'Звук: выкл'
  })

  // соцсети: «посещено»
  const visited = JSON.parse(localStorage.getItem('visited') || '[]')
  const mark = () =>
    $$('[data-social]').forEach((a) => {
      const v = visited.includes(a.dataset.social)
      a.classList.toggle('is-visited', v)
      a.querySelector('.status').textContent = v ? 'Посещено ✓' : 'Открыть'
    })
  mark()
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-social]')
    if (!a || visited.includes(a.dataset.social)) return
    visited.push(a.dataset.social)
    localStorage.setItem('visited', JSON.stringify(visited))
    mark()
  })

  // копирование почты
  $('[data-copy]').addEventListener('click', async (e) => {
    const em = e.currentTarget.querySelector('em')
    try {
      await navigator.clipboard.writeText(site.email)
      em.textContent = 'скопировано ✓'
    } catch {
      window.location.href = `mailto:${site.email}`
    }
    setTimeout(() => (em.textContent = 'скопировать'), 2000)
  })
}

// ═══════════════════════════════════════════════════════════
//  BOOT
// ═══════════════════════════════════════════════════════════
history.scrollRestoration = 'manual'
window.scrollTo(0, 0)

bindContent()
initScroll()
initSpace()
initMenu()
initModal()
viewer.init()
initFilter()
initCursor()
initFlashlight()
initMisc()
liveUI()

runLoader().then(() => {
  document.body.classList.remove('is-loading')
  heroIntro()
  initAnimations()
  lenis.start()
  requestAnimationFrame(() => ScrollTrigger.refresh())
})
