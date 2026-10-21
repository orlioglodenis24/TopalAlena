// Процедурное «виртуальное пространство»: зеркальный пол в сетке,
// светящиеся рамки-кадры, парящие примитивы (часть — каркасом, как во вьюпорте),
// портал в конце пути и мягкая плёночная постобработка.
import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'

const L = 150 // длина пути
const Z0 = 8 // начало (за спиной камеры)
const FRAME_STEP = 11
const LIGHTS = 5 // реальных источников света, переезжают к ближайшим рамкам

// палитра сайта
const C = {
  bg: 0x040916,
  navy: 0x182130,
  deep: 0x23375a,
  blue: 0x546f9e,
  sky: 0xbad3f7,
  ice: 0xd8f1fd,
  slate: 0x353b55,
  steel: 0x60717e,
}

const rnd = (a, b) => a + Math.random() * (b - a)
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

// ── процедурные текстуры ─────────────────────────────────────
function canvasTex(w, h, draw, repeat) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  draw(c.getContext('2d'), w, h)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.anisotropy = 8
  if (repeat) t.repeat.set(...repeat)
  return t
}

function makeGridTex() {
  return canvasTex(
    256,
    256,
    (ctx, w, h) => {
      ctx.fillStyle = '#070d1c'
      ctx.fillRect(0, 0, w, h)
      // мелкая сетка
      ctx.strokeStyle = 'rgba(84,111,158,0.22)'
      ctx.lineWidth = 1
      for (let i = 0; i <= 4; i++) {
        const p = (i * w) / 4 + 0.5
        ctx.beginPath()
        ctx.moveTo(p, 0)
        ctx.lineTo(p, h)
        ctx.moveTo(0, p)
        ctx.lineTo(w, p)
        ctx.stroke()
      }
      // основные линии
      ctx.strokeStyle = 'rgba(186,211,247,0.42)'
      ctx.lineWidth = 2
      ctx.strokeRect(1, 1, w - 2, h - 2)
    },
    [30, L / 4]
  )
}

function makeGlowTex() {
  return canvasTex(256, 256, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2)
    g.addColorStop(0, 'rgba(216,241,253,1)')
    g.addColorStop(0.25, 'rgba(186,211,247,0.55)')
    g.addColorStop(0.6, 'rgba(84,111,158,0.15)')
    g.addColorStop(1, 'rgba(4,9,22,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
  })
}

// ── post-processing: лёгкая оптика камеры ────────────────────
const FXShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uAberr: { value: 0.003 },
    uGlow: { value: 0 },
    uFade: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime, uAberr, uGlow, uFade;
    uniform vec2 uRes;
    varying vec2 vUv;
    float rand(vec2 c){ return fract(sin(dot(c, vec2(12.9898,78.233))) * 43758.5453); }
    void main(){
      vec2 c = vUv - 0.5;
      float r2 = dot(c, c);
      vec2 uv = 0.5 + c * (1.0 + 0.04 * r2);
      vec2 dir = c * uAberr * (0.6 + r2 * 3.0);
      vec3 col;
      col.r = texture2D(tDiffuse, uv + dir).r;
      col.g = texture2D(tDiffuse, uv).g;
      col.b = texture2D(tDiffuse, uv - dir).b;
      float g = rand(uv * uRes + fract(uTime * 7.0) * 100.0) - 0.5;
      col += g * 0.03;
      // к концу пути кадр «засвечивается» холодным светом портала
      col = mix(col, col * vec3(0.9, 1.05, 1.25) + vec3(0.05, 0.08, 0.12), uGlow);
      col *= smoothstep(0.95, 0.25, length(c) * 1.15);
      col *= 1.0 - uFade;
      gl_FragColor = vec4(col, 1.0);
    }
  `,
}

export class Space {
  constructor(canvas, { mobile = false } = {}) {
    this.canvas = canvas
    this.mobile = mobile
    this.active = true
    this.progress = 0
    this.z = Z0 - 2
    this.targetZ = this.z
    this.mouse = new THREE.Vector2()
    this.look = new THREE.Vector2()
    this.power = 0 // 0..1 — рамки «зажигаются» после лоадера
    this.clock = new THREE.Clock()

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1 : 1.5))
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.25
    this.renderer.setClearColor(C.bg)

    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.FogExp2(C.bg, 0.045)
    this.camera = new THREE.PerspectiveCamera(58, 1, 0.05, 90)
    this.camera.position.set(0, 1.7, this.z)
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
    const endZ = Z0 - L

    // пол: тёмный глянец с сеткой, отражает свет рамок
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(120, L + 40),
      new THREE.MeshStandardMaterial({ map: makeGridTex(), roughness: 0.28, metalness: 0.65 })
    )
    floor.rotation.x = -Math.PI / 2
    floor.position.set(0, 0, Z0 - L / 2)
    s.add(floor)

    s.add(new THREE.HemisphereLight(C.blue, C.bg, 1.1))
    const key = new THREE.DirectionalLight(C.sky, 0.9)
    key.position.set(-6, 10, 4)
    s.add(key)

    // рамки-кадры, сквозь которые летит камера
    this.frames = []
    const barH = new THREE.BoxGeometry(1, 0.045, 0.045)
    const barV = new THREE.BoxGeometry(0.045, 1, 0.045)
    const tones = [C.ice, C.sky, C.blue]
    for (let z = Z0 - 6, i = 0; z > endZ + 8; z -= FRAME_STEP, i++) {
      const w = rnd(4.6, 6.2)
      const h = w * 0.62
      const mat = new THREE.MeshBasicMaterial({ color: tones[i % tones.length] })
      const g = new THREE.Group()
      const top = new THREE.Mesh(barH, mat)
      top.scale.x = w
      top.position.y = h
      const bottom = new THREE.Mesh(barH, mat)
      bottom.scale.x = w
      const left = new THREE.Mesh(barV, mat)
      left.scale.y = h
      left.position.set(-w / 2, h / 2, 0)
      const right = left.clone()
      right.position.x = w / 2
      g.add(top, bottom, left, right)
      // уголки-метки, как у кадра в видоискателе
      const tick = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.02), new THREE.MeshBasicMaterial({ color: C.ice, wireframe: true }))
      tick.position.set(w / 2 - 0.3, h - 0.3, 0)
      g.add(tick)
      g.position.set(rnd(-0.4, 0.4), 0.05, z)
      g.rotation.z = rnd(-0.06, 0.06)
      g.rotation.y = rnd(-0.12, 0.12)
      s.add(g)
      this.frames.push({ group: g, mat, z, color: new THREE.Color(tones[i % tones.length]), level: 0, phase: rnd(0, 6) })
    }
    this.lights = []
    for (let i = 0; i < LIGHTS; i++) {
      const l = new THREE.PointLight(C.sky, 0, 16, 1.5)
      s.add(l)
      this.lights.push(l)
    }

    // парящие объекты — «ассеты» сцены
    const geos = [
      new THREE.IcosahedronGeometry(0.7, 0),
      new THREE.TorusGeometry(0.55, 0.2, 24, 72),
      new THREE.BoxGeometry(0.9, 0.9, 0.9),
      new THREE.TorusKnotGeometry(0.45, 0.15, 160, 18),
      new THREE.SphereGeometry(0.6, 40, 20),
      new THREE.OctahedronGeometry(0.75, 0),
      new THREE.CylinderGeometry(0.45, 0.45, 1.1, 32),
      new THREE.ConeGeometry(0.55, 1.1, 4),
    ]
    const solids = [C.blue, C.deep, C.sky, C.steel, C.slate, C.ice]
    this.props = []
    const count = this.mobile ? 34 : 60
    for (let i = 0; i < count; i++) {
      const geo = pick(geos)
      const side = i % 2 ? 1 : -1
      const z = Z0 - 4 - (i / count) * (L - 16) + rnd(-3, 3)
      const group = new THREE.Group()
      const mode = Math.random()
      if (mode < 0.62) {
        const m = new THREE.Mesh(
          geo,
          new THREE.MeshStandardMaterial({
            color: pick(solids),
            roughness: rnd(0.15, 0.55),
            metalness: rnd(0.2, 0.8),
            flatShading: geo.type !== 'SphereGeometry' && geo.type !== 'TorusGeometry' && geo.type !== 'TorusKnotGeometry',
          })
        )
        group.add(m)
        // каркас поверх части объектов — «топология во вьюпорте»
        if (Math.random() < 0.35) {
          const wf = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: C.ice, wireframe: true, transparent: true, opacity: 0.35 }))
          wf.scale.setScalar(1.01)
          group.add(wf)
        }
      } else {
        group.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: pick([C.sky, C.blue, C.ice]), wireframe: true, transparent: true, opacity: 0.55 })))
      }
      const scale = rnd(0.6, 1.8)
      group.scale.setScalar(scale)
      group.position.set(side * rnd(2.6, 9), rnd(0.7, 5.2), z)
      group.rotation.set(rnd(0, 6), rnd(0, 6), rnd(0, 6))
      s.add(group)
      this.props.push({ group, y: group.position.y, spin: new THREE.Vector3(rnd(-0.3, 0.3), rnd(-0.4, 0.4), rnd(-0.2, 0.2)), phase: rnd(0, 6) })
    }

    // портал в конце пути
    const portal = new THREE.Group()
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.05, 16, 128), new THREE.MeshBasicMaterial({ color: C.ice }))
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.9, 0.015, 8, 128), new THREE.MeshBasicMaterial({ color: C.sky, transparent: true, opacity: 0.6 }))
    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshBasicMaterial({ map: makeGlowTex(), transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending })
    )
    glow.position.z = -0.1
    portal.add(glow, ring, ring2)
    portal.position.set(0, 2.6, endZ + 2)
    s.add(portal)
    this.portal = { group: portal, ring, ring2 }
    const portalLight = new THREE.PointLight(C.ice, 0, 30, 1.4)
    portalLight.position.set(0, 2.6, endZ + 4)
    s.add(portalLight)
    this.portalLight = portalLight

    // мелкие частицы в воздухе
    const pc = this.mobile ? 300 : 800
    const pos = new Float32Array(pc * 3)
    for (let i = 0; i < pc; i++) {
      pos[i * 3] = rnd(-12, 12)
      pos[i * 3 + 1] = rnd(0, 8)
      pos[i * 3 + 2] = rnd(-28, 4)
    }
    const dg = new THREE.BufferGeometry()
    dg.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    this.dust = new THREE.Points(dg, new THREE.PointsMaterial({ color: C.sky, size: 0.03, transparent: true, opacity: 0.7, depthWrite: false }))
    s.add(this.dust)
  }

  onResize() {
    const w = window.innerWidth
    const h = window.innerHeight
    this.camera.aspect = w / h
    this.camera.fov = w < h ? 76 : 58
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h, false)
    this.composer.setSize(w, h)
    this.fx.uniforms.uRes.value.set(w, h)
  }

  onMouse(e) {
    this.mouse.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
  }

  // p: 0..1 — путь сквозь сцену
  setProgress(p) {
    this.progress = p
    this.targetZ = Z0 - 2 - p * (L - 18)
  }

  // засветка кадра у портала
  setGlow(v) {
    this.fx.uniforms.uGlow.value = v
  }

  setActive(v) {
    if (v === this.active) return
    this.active = v
    if (v) this.clock.getDelta()
  }

  // «включение» сцены после лоадера
  boot() {
    this.booting = 0.0001
  }

  tick() {
    if (!this.active) return
    const dt = Math.min(this.clock.getDelta(), 0.05)
    const t = this.clock.elapsedTime
    this.fx.uniforms.uTime.value = t

    if (this.booting) {
      this.booting += dt * 0.5
      this.power = Math.min(1, this.booting)
      if (this.booting >= 1) this.booting = 0
    }

    // плавный пролёт камеры, как на кране
    const prevZ = this.z
    this.z += (this.targetZ - this.z) * Math.min(1, dt * 2.6)
    const speed = Math.abs(this.z - prevZ) / Math.max(dt, 0.001)
    const fly = Math.min(speed / 4, 1)
    const cam = this.camera
    cam.position.z = this.z
    cam.position.y = 1.7 + Math.sin(t * 0.6) * 0.06
    cam.position.x = Math.sin(t * 0.25) * 0.18
    this.look.lerp(this.mouse, Math.min(1, dt * 2.2))
    cam.rotation.y = -this.look.x * 0.2 + Math.sin(t * 0.2) * 0.02
    cam.rotation.x = this.look.y * 0.1 + 0.02
    cam.rotation.z = -this.look.x * 0.025 + Math.sin(t * 0.3) * 0.004

    // рамки зажигаются волной от камеры вглубь и мягко «дышат»
    const camZ = cam.position.z
    for (const f of this.frames) {
      const reach = (Z0 - f.z) / (L * 0.5)
      let target = 0.75 + 0.25 * Math.sin(t * 1.2 + f.phase)
      if (this.power < 1 && reach > this.power * 1.4) target = 0
      f.level += (target - f.level) * 0.08
      f.mat.color.copy(f.color).multiplyScalar(0.15 + f.level * 1.1)
    }
    const ahead = this.frames
      .filter((f) => f.z < camZ + 3)
      .sort((a, b) => b.z - a.z)
      .slice(0, LIGHTS)
    this.lights.forEach((light, i) => {
      const f = ahead[i]
      if (!f) {
        light.intensity = 0
        return
      }
      light.position.set(f.group.position.x, 2.2, f.z)
      light.color.copy(f.color)
      light.intensity = f.level * 18
    })

    // объекты парят и вращаются
    for (const p of this.props) {
      p.group.rotation.x += p.spin.x * dt
      p.group.rotation.y += p.spin.y * dt
      p.group.rotation.z += p.spin.z * dt
      p.group.position.y = p.y + Math.sin(t * 0.8 + p.phase) * 0.18
    }

    // портал
    this.portal.ring.rotation.z = t * 0.2
    this.portal.ring2.rotation.z = -t * 0.12
    this.portal.ring2.rotation.x = Math.sin(t * 0.4) * 0.3
    this.portalLight.intensity = (20 + Math.sin(t * 1.5) * 4) * this.power

    // частицы вокруг камеры
    const arr = this.dust.geometry.attributes.position.array
    for (let i = 0; i < arr.length; i += 3) {
      arr[i + 1] += Math.sin(t + i) * 0.0009
      if (arr[i + 2] > camZ + 4) arr[i + 2] -= 32
      else if (arr[i + 2] < camZ - 28) arr[i + 2] += 32
    }
    this.dust.geometry.attributes.position.needsUpdate = true

    this.fx.uniforms.uAberr.value = 0.003 + fly * 0.006
    this.composer.render(dt)
  }
}
