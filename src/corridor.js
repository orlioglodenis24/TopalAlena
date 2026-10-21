// Процедурный хоррор-коридор: больничные стены, мерцающие лампы,
// фонарик за курсором, силуэт в тумане и VHS-постобработка.
import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'

const L = 150 // длина коридора
const W = 4.2 // ширина
const H = 3.2 // высота
const Z0 = 8 // начало (за спиной камеры)
const LAMP_STEP = 8.5
const LIGHTS = 5 // реальных источников света, переезжают к ближайшим лампам

const rnd = (a, b) => a + Math.random() * (b - a)

// ── процедурные текстуры ─────────────────────────────────────
function canvasTex(w, h, draw, repeat) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  draw(c.getContext('2d'), w, h)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.anisotropy = 4
  if (repeat) t.repeat.set(...repeat)
  return t
}

function grime(ctx, w, h, count, color, rMin, rMax) {
  for (let i = 0; i < count; i++) {
    const x = Math.random() * w
    const y = Math.random() * h
    const r = rnd(rMin, rMax)
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, color)
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(x - r, y - r, r * 2, r * 2)
  }
}

function noise(ctx, w, h, amount) {
  const img = ctx.getImageData(0, 0, w, h)
  const d = img.data
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * amount
    d[i] += n
    d[i + 1] += n
    d[i + 2] += n
  }
  ctx.putImageData(img, 0, 0)
}

function makeWallTex() {
  return canvasTex(
    512,
    512,
    (ctx, w, h) => {
      const split = h * 0.58
      // верх — облупленная краска
      ctx.fillStyle = '#3b4038'
      ctx.fillRect(0, 0, w, split)
      // низ — кафель
      ctx.fillStyle = '#5d6458'
      ctx.fillRect(0, split, w, h - split)
      const t = 32
      ctx.strokeStyle = 'rgba(15,15,12,0.55)'
      ctx.lineWidth = 2
      for (let y = split; y <= h; y += t) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }
      for (let x = 0; x <= w; x += t) {
        ctx.beginPath()
        ctx.moveTo(x, split)
        ctx.lineTo(x, h)
        ctx.stroke()
      }
      // разбитые плитки
      for (let i = 0; i < 14; i++) {
        ctx.fillStyle = `rgba(20,18,14,${rnd(0.3, 0.8)})`
        ctx.fillRect(Math.floor(rnd(0, w / t)) * t, split + Math.floor(rnd(0, (h - split) / t)) * t, t, t)
      }
      // бордюр
      ctx.fillStyle = '#23261f'
      ctx.fillRect(0, split - 8, w, 10)
      // грязь, подтёки
      grime(ctx, w, h, 40, 'rgba(30,22,12,0.35)', 20, 90)
      grime(ctx, w, h, 6, 'rgba(70,8,8,0.35)', 10, 40)
      for (let i = 0; i < 26; i++) {
        const x = rnd(0, w)
        const y = rnd(0, split)
        const len = rnd(40, 220)
        const g = ctx.createLinearGradient(x, y, x, y + len)
        g.addColorStop(0, 'rgba(25,18,10,0.45)')
        g.addColorStop(1, 'rgba(25,18,10,0)')
        ctx.fillStyle = g
        ctx.fillRect(x, y, rnd(1, 4), len)
      }
      noise(ctx, w, h, 26)
    },
    [L / 4, 1]
  )
}

function makeFloorTex() {
  return canvasTex(
    512,
    512,
    (ctx, w, h) => {
      const n = 8
      const s = w / n
      for (let y = 0; y < n; y++)
        for (let x = 0; x < n; x++) {
          ctx.fillStyle = (x + y) % 2 ? '#2e2a26' : '#141211'
          ctx.fillRect(x * s, y * s, s, s)
        }
      grime(ctx, w, h, 50, 'rgba(0,0,0,0.5)', 20, 80)
      grime(ctx, w, h, 4, 'rgba(60,4,4,0.55)', 14, 50)
      noise(ctx, w, h, 22)
    },
    [W / 2, L / 2]
  )
}

function makeCeilTex() {
  return canvasTex(
    256,
    256,
    (ctx, w, h) => {
      ctx.fillStyle = '#2a2a26'
      ctx.fillRect(0, 0, w, h)
      ctx.strokeStyle = 'rgba(0,0,0,0.6)'
      ctx.lineWidth = 3
      ctx.strokeRect(0, 0, w, h)
      ctx.beginPath()
      ctx.moveTo(w / 2, 0)
      ctx.lineTo(w / 2, h)
      ctx.stroke()
      grime(ctx, w, h, 16, 'rgba(20,14,8,0.5)', 10, 60)
      noise(ctx, w, h, 20)
    },
    [2, L / 2]
  )
}

function makeDoorTex() {
  return canvasTex(128, 256, (ctx, w, h) => {
    ctx.fillStyle = '#3a2e26'
    ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = 'rgba(0,0,0,0.5)'
    ctx.lineWidth = 3
    ctx.strokeRect(14, 18, w - 28, h * 0.36)
    ctx.strokeRect(14, h * 0.48, w - 28, h * 0.44)
    ctx.fillStyle = '#12100e'
    ctx.fillRect(w * 0.3, h * 0.12, w * 0.4, h * 0.16) // окошко
    ctx.fillStyle = '#9a9184'
    ctx.fillRect(w - 26, h * 0.52, 8, 16) // ручка
    grime(ctx, w, h, 12, 'rgba(0,0,0,0.5)', 10, 40)
    noise(ctx, w, h, 30)
  })
}

function makeSilhouetteTex() {
  return canvasTex(256, 512, (ctx, w, h) => {
    ctx.filter = 'blur(3px)'
    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.ellipse(w / 2, 70, 26, 34, 0, 0, Math.PI * 2) // голова
    ctx.fill()
    // волосы
    ctx.beginPath()
    ctx.moveTo(w / 2 - 30, 60)
    ctx.quadraticCurveTo(w / 2 - 38, 180, w / 2 - 22, 230)
    ctx.lineTo(w / 2 + 22, 230)
    ctx.quadraticCurveTo(w / 2 + 38, 180, w / 2 + 30, 60)
    ctx.fill()
    // тело — длинная рубаха
    ctx.beginPath()
    ctx.moveTo(w / 2 - 22, 110)
    ctx.quadraticCurveTo(w / 2 - 62, 130, w / 2 - 58, 200)
    ctx.lineTo(w / 2 - 64, 500)
    ctx.lineTo(w / 2 + 64, 500)
    ctx.lineTo(w / 2 + 58, 200)
    ctx.quadraticCurveTo(w / 2 + 62, 130, w / 2 + 22, 110)
    ctx.fill()
    // длинные руки
    ctx.lineCap = 'round'
    ctx.lineWidth = 16
    ctx.strokeStyle = '#000'
    ctx.beginPath()
    ctx.moveTo(w / 2 - 54, 150)
    ctx.quadraticCurveTo(w / 2 - 80, 300, w / 2 - 74, 410)
    ctx.moveTo(w / 2 + 54, 150)
    ctx.quadraticCurveTo(w / 2 + 80, 300, w / 2 + 74, 410)
    ctx.stroke()
  })
}

// ── VHS post-processing ──────────────────────────────────────
const FXShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uAberr: { value: 0.006 },
    uRed: { value: 0 },
    uFade: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime, uAberr, uRed, uFade;
    uniform vec2 uRes;
    varying vec2 vUv;
    float rand(vec2 c){ return fract(sin(dot(c, vec2(12.9898,78.233))) * 43758.5453); }
    void main(){
      vec2 c = vUv - 0.5;
      float r2 = dot(c, c);
      vec2 uv = 0.5 + c * (1.0 + 0.09 * r2);
      // VHS: редкие рывки строк
      float band = step(0.992, rand(vec2(floor(uv.y * 180.0), floor(uTime * 14.0))));
      uv.x += band * 0.012 * (rand(vec2(uTime, uv.y)) - 0.5);
      // медленная полоса трекинга
      float track = smoothstep(0.0, 0.02, abs(fract(uv.y * 0.6 - uTime * 0.05) - 0.5) - 0.48);
      uv.x += (1.0 - track) * 0.004;
      vec2 dir = c * uAberr * (0.6 + r2 * 3.0);
      vec3 col;
      col.r = texture2D(tDiffuse, uv + dir).r;
      col.g = texture2D(tDiffuse, uv).g;
      col.b = texture2D(tDiffuse, uv - dir).b;
      col += (1.0 - track) * 0.015;
      float g = rand(uv * uRes + fract(uTime * 7.0) * 100.0) - 0.5;
      col += g * 0.045;
      col = mix(col, col * vec3(1.5, 0.3, 0.25) + vec3(0.04, 0.0, 0.0), uRed);
      col *= smoothstep(0.95, 0.2, length(c) * 1.2);
      if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) col = vec3(0.0);
      col *= 1.0 - uFade;
      gl_FragColor = vec4(col, 1.0);
    }
  `,
}

export class Corridor {
  constructor(canvas, { mobile = false } = {}) {
    this.canvas = canvas
    this.mobile = mobile
    this.active = true
    this.progress = 0
    this.z = Z0 - 2
    this.targetZ = this.z
    this.mouse = new THREE.Vector2()
    this.look = new THREE.Vector2()
    this.power = 0 // 0..1 — лампы «включаются» после лоадера
    this.clock = new THREE.Clock()
    this.figureTimer = 3
    this.blackout = 0

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1 : 1.5))
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.6
    this.renderer.setClearColor(0x050404)

    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.FogExp2(0x050404, 0.07)
    this.camera = new THREE.PerspectiveCamera(62, 1, 0.05, 80)
    this.camera.position.set(0, 1.6, this.z)
    this.scene.add(this.camera)

    this.build()

    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    this.fx = new ShaderPass(FXShader)
    this.composer.addPass(this.fx)
    this.composer.addPass(new OutputPass())

    this.onResize = this.onResize.bind(this)
    this.onMouse = this.onMouse.bind(this)
    window.addEventListener('resize', this.onResize)
    window.addEventListener('pointermove', this.onMouse)
    this.onResize()

    this.tick = this.tick.bind(this)
    this.renderer.setAnimationLoop(this.tick)
  }

  build() {
    const s = this.scene
    const len = L
    const cz = Z0 - len / 2

    const wallMat = new THREE.MeshStandardMaterial({ map: makeWallTex(), roughness: 0.82, metalness: 0 })
    const floorMat = new THREE.MeshStandardMaterial({ map: makeFloorTex(), roughness: 0.32, metalness: 0.15 })
    const ceilMat = new THREE.MeshStandardMaterial({ map: makeCeilTex(), roughness: 0.95 })

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, len), floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.position.set(0, 0, cz)
    s.add(floor)

    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, len), ceilMat)
    ceil.rotation.x = Math.PI / 2
    ceil.position.set(0, H, cz)
    s.add(ceil)

    const wallGeo = new THREE.PlaneGeometry(len, H)
    const left = new THREE.Mesh(wallGeo, wallMat)
    left.rotation.y = Math.PI / 2
    left.position.set(-W / 2, H / 2, cz)
    s.add(left)
    const right = new THREE.Mesh(wallGeo, wallMat)
    right.rotation.y = -Math.PI / 2
    right.position.set(W / 2, H / 2, cz)
    s.add(right)

    // торцевая стена с красной дверью
    const endZ = Z0 - len
    const end = new THREE.Mesh(new THREE.PlaneGeometry(W, H), wallMat)
    end.position.set(0, H / 2, endZ)
    s.add(end)
    const endGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.1, 2.2),
      new THREE.MeshBasicMaterial({ color: 0xff1a1a, fog: false })
    )
    endGlow.position.set(0, 1.1, endZ + 0.02)
    s.add(endGlow)
    const endLight = new THREE.PointLight(0xff1010, 18, 22, 1.6)
    endLight.position.set(0, 1.4, endZ + 1.5)
    s.add(endLight)
    this.endLight = endLight

    // двери
    const doorTex = makeDoorTex()
    const doorMat = new THREE.MeshStandardMaterial({ map: doorTex, roughness: 0.7 })
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1a1816, roughness: 0.6 })
    const redMat = new THREE.MeshBasicMaterial({ color: 0xff2020 })
    const doorGeo = new THREE.BoxGeometry(0.06, 2.2, 1.05)
    const frameGeo = new THREE.BoxGeometry(0.1, 2.36, 1.25)
    for (let z = Z0 - 6, i = 0; z > endZ + 6; z -= rnd(5, 8), i++) {
      const side = i % 2 ? 1 : -1
      const x = side * (W / 2 - 0.02)
      const frame = new THREE.Mesh(frameGeo, frameMat)
      frame.position.set(x, 1.18, z)
      s.add(frame)
      const pivot = new THREE.Group()
      pivot.position.set(x - side * 0.04, 1.1, z + 0.52)
      const door = new THREE.Mesh(doorGeo, doorMat)
      door.position.z = -0.52
      pivot.add(door)
      const ajar = Math.random() < 0.3
      if (ajar) {
        pivot.rotation.y = side * rnd(0.25, 0.6)
        const gap = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 2.15), Math.random() < 0.6 ? redMat : new THREE.MeshBasicMaterial({ color: 0x050505 }))
        gap.rotation.y = -side * (Math.PI / 2)
        gap.position.set(x + side * 0.03, 1.1, z)
        s.add(gap)
      }
      s.add(pivot)
    }

    // лампы
    this.lamps = []
    const lampGeo = new THREE.BoxGeometry(0.28, 0.05, 1.2)
    for (let z = Z0 - 3, i = 0; z > endZ + 4; z -= LAMP_STEP, i++) {
      const emergency = i % 5 === 3
      const mat = new THREE.MeshBasicMaterial({ color: emergency ? 0xff2a1a : 0xdfe8d6 })
      const m = new THREE.Mesh(lampGeo, mat)
      m.position.set(0, H - 0.03, z)
      s.add(m)
      this.lamps.push({
        mesh: m,
        mat,
        z,
        emergency,
        base: emergency ? 0.55 : rnd(0.65, 1),
        dead: !emergency && Math.random() < 0.18,
        flicky: Math.random() < 0.45,
        level: 0,
        color: new THREE.Color(emergency ? 0xff2216 : 0xd8e4cc),
      })
    }
    this.lights = []
    for (let i = 0; i < LIGHTS; i++) {
      const l = new THREE.PointLight(0xd8e4cc, 0, 14, 1.6)
      s.add(l)
      this.lights.push(l)
    }

    // фонарик
    this.flash = new THREE.SpotLight(0xfff1dc, 0, 26, 0.36, 0.7, 1.4)
    this.flash.position.set(0.25, -0.2, 0)
    this.camera.add(this.flash)
    this.flashTarget = new THREE.Object3D()
    this.camera.add(this.flashTarget)
    this.flash.target = this.flashTarget
    this.flashTarget.position.set(0, 0, -5)
    this.scene.add(new THREE.AmbientLight(0x2a2c33, 1.4))

    // пыль
    const count = this.mobile ? 260 : 650
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = rnd(-W / 2, W / 2)
      pos[i * 3 + 1] = rnd(0, H)
      pos[i * 3 + 2] = rnd(-24, 4)
    }
    const dg = new THREE.BufferGeometry()
    dg.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    this.dust = new THREE.Points(
      dg,
      new THREE.PointsMaterial({ color: 0xbfb6a6, size: 0.018, transparent: true, opacity: 0.55, depthWrite: false })
    )
    s.add(this.dust)

    // силуэт
    this.figure = new THREE.Mesh(
      new THREE.PlaneGeometry(1.0, 2.0),
      new THREE.MeshBasicMaterial({ map: makeSilhouetteTex(), transparent: true, depthWrite: false, color: 0x000000 })
    )
    this.figure.visible = false
    s.add(this.figure)
  }

  onResize() {
    const w = window.innerWidth
    const h = window.innerHeight
    this.camera.aspect = w / h
    this.camera.fov = w < h ? 78 : 62
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h, false)
    this.composer.setSize(w, h)
    this.fx.uniforms.uRes.value.set(w, h)
  }

  onMouse(e) {
    this.mouse.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
  }

  // p: 0..1 — путь по коридору
  setProgress(p) {
    this.progress = p
    this.targetZ = Z0 - 2 - p * (L - 26)
  }

  setRed(v) {
    this.fx.uniforms.uRed.value = v
  }

  setActive(v) {
    if (v === this.active) return
    this.active = v
    if (v) this.clock.getDelta()
  }

  // включение света после лоадера
  boot() {
    this.booting = 0.0001
  }

  // резкое отключение света (пасхалка / скример)
  scare() {
    this.blackout = 0.9
    this.figure.visible = true
    this.placeFigure(5.5)
  }

  placeFigure(dist) {
    // ставим силуэт между лампами, чтобы он был в контровом свете
    const z = this.camera.position.z - dist
    const lampZ = Math.round((z - (Z0 - 3)) / LAMP_STEP) * LAMP_STEP + (Z0 - 3)
    this.figure.position.set(rnd(-0.7, 0.7), 1.0, lampZ + LAMP_STEP * 0.5)
  }

  tick() {
    if (!this.active) return
    const dt = Math.min(this.clock.getDelta(), 0.05)
    const t = this.clock.elapsedTime
    this.fx.uniforms.uTime.value = t

    if (this.booting) {
      this.booting += dt * 0.55
      this.power = Math.min(1, this.booting)
      if (this.booting >= 1) this.booting = 0
    }

    // движение камеры
    const prevZ = this.z
    this.z += (this.targetZ - this.z) * Math.min(1, dt * 3)
    const speed = Math.abs(this.z - prevZ) / Math.max(dt, 0.001)
    const walk = Math.min(speed / 3, 1)
    const cam = this.camera
    cam.position.z = this.z
    cam.position.y = 1.6 + Math.sin(t * 1.3) * 0.015 + Math.abs(Math.sin(this.z * 1.6)) * 0.05 * walk
    cam.position.x = Math.sin(t * 0.4) * 0.06 + Math.sin(this.z * 0.8) * 0.04 * walk
    this.look.lerp(this.mouse, Math.min(1, dt * 2.5))
    cam.rotation.y = -this.look.x * 0.18 + Math.sin(t * 0.3) * 0.015
    cam.rotation.x = this.look.y * 0.09 + Math.sin(t * 0.7) * 0.006
    cam.rotation.z = Math.sin(t * 0.5) * 0.006

    // фонарик следует за курсором
    this.flashTarget.position.set(this.look.x * 2.4, this.look.y * 1.6, -5)
    const flashFlicker = Math.random() < 0.01 ? 0.3 : 1
    this.flash.intensity = 70 * this.power * flashFlicker * (this.blackout > 0 ? 0.05 : 1)

    // лампы
    if (this.blackout > 0) this.blackout -= dt
    const camZ = cam.position.z
    for (const lamp of this.lamps) {
      let target = lamp.dead ? 0 : lamp.base
      if (lamp.emergency) target = lamp.base * (0.6 + 0.4 * Math.sin(t * 3 + lamp.z))
      else if (lamp.flicky && Math.random() < 0.05) target *= Math.random() < 0.5 ? 0.05 : 0.5
      if (lamp.dead && Math.random() < 0.004) target = 0.8
      // «включение» волной от камеры вглубь
      const bootReach = (Z0 - lamp.z) / (L * 0.5)
      if (this.power < 1 && bootReach > this.power * 1.4) target = Math.random() < 0.03 ? 0.6 : 0
      if (this.blackout > 0) target = lamp.emergency ? 0.2 : 0
      lamp.level += (target - lamp.level) * (lamp.flicky ? 0.6 : 0.25)
      lamp.mat.color.copy(lamp.color).multiplyScalar(0.25 + lamp.level * 1.6)
    }
    // 5 реальных источников — у ближайших ламп впереди
    const ahead = this.lamps
      .filter((l) => l.z < camZ + 3)
      .sort((a, b) => b.z - a.z)
      .slice(0, LIGHTS)
    this.lights.forEach((light, i) => {
      const lamp = ahead[i]
      if (!lamp) {
        light.intensity = 0
        return
      }
      light.position.set(0, H - 0.35, lamp.z)
      light.color.copy(lamp.color)
      light.intensity = lamp.level * (lamp.emergency ? 16 : 24)
    })
    this.endLight.intensity = (14 + Math.sin(t * 2) * 4) * this.power

    // пыль вокруг камеры
    const arr = this.dust.geometry.attributes.position.array
    for (let i = 0; i < arr.length; i += 3) {
      arr[i + 1] += Math.sin(t + i) * 0.0008
      arr[i] += Math.cos(t * 0.5 + i) * 0.0006
      if (arr[i + 2] > camZ + 4) arr[i + 2] -= 28
      else if (arr[i + 2] < camZ - 24) arr[i + 2] += 28
    }
    this.dust.geometry.attributes.position.needsUpdate = true

    // силуэт: появляется при перебоях света, исчезает, если подойти
    this.figureTimer -= dt
    if (this.figureTimer <= 0 && this.power >= 1) {
      this.figure.visible = !this.figure.visible
      if (this.figure.visible) this.placeFigure(rnd(14, 22))
      this.figureTimer = this.figure.visible ? rnd(2.5, 5) : rnd(4, 9)
    }
    if (this.figure.visible) {
      const d = camZ - this.figure.position.z
      this.figure.lookAt(cam.position.x, 1.0, camZ)
      this.figure.position.x += Math.sin(t * 7) * 0.0015
      if (d < 4.5 || d < 0) {
        this.figure.visible = false
        this.figureTimer = rnd(3, 6)
      }
    }

    this.fx.uniforms.uAberr.value = 0.006 + walk * 0.006 + (this.blackout > 0 ? 0.03 : 0)
    this.composer.render(dt)
  }
}
