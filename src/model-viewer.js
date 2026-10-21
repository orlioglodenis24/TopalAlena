// ═══════════════════════════════════════════════════════════
//  3D-МОДЕЛЬ В КАРТОЧКЕ ПРОЕКТА
//  Грузится отдельным чанком, только когда открыта карточка с полем model.
//  Модель — .glb (Draco), материалы задаём здесь по именам мешей.
// ═══════════════════════════════════════════════════════════
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader, DRACO_GLTF_CONFIG } from 'three/addons/loaders/DRACOLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

// имя меша (начало) → материал. Что не нашлось — получает 'default'
const MATERIALS = {
  head: { color: 0xead7c9, roughness: 0.55, sheen: 0.6, sheenColor: 0xffc9c2, sheenRoughness: 0.5 },
  eyes: { color: 0x050505, roughness: 0.05, clearcoat: 1 },
  horns: { color: 0x8a0f17, roughness: 0.32, clearcoat: 0.7, clearcoatRoughness: 0.2 },
  soska: { color: 0xd8121f, roughness: 0.28, clearcoat: 0.5 },
  pirsing: { color: 0xd9d6d0, metalness: 1, roughness: 0.18 },
  zamok: { color: 0xb9b4ab, metalness: 1, roughness: 0.25 },
  default: { color: 0xcfc7ba, roughness: 0.5 },
}

// декодер Vite кладёт в сборку сам; облегчённая версия — только для glTF
const draco = new DRACOLoader().setDecoderPath(DRACO_GLTF_CONFIG)
const loader = new GLTFLoader().setDRACOLoader(draco)

export class ModelViewer {
  constructor(host, url) {
    this.host = host
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.1
    this.renderer.domElement.className = 'case-model'
    host.appendChild(this.renderer.domElement)

    this.scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(this.renderer)
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    this.scene.environmentIntensity = 0.35
    pmrem.dispose()

    // тёплый ключ, холодная заливка и красный контровой — в тон сайту
    const key = new THREE.DirectionalLight(0xfff1dc, 2.6)
    key.position.set(2, 3, 4)
    const fill = new THREE.DirectionalLight(0x9fb4d8, 0.5)
    fill.position.set(-4, 1, 2)
    const rim = new THREE.DirectionalLight(0xff1a1a, 4)
    rim.position.set(-1, 2, -5)
    this.scene.add(key, fill, rim, new THREE.AmbientLight(0x2a2c33, 0.6))

    this.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.enablePan = false
    this.controls.enableZoom = false // колесо листает карточку
    this.controls.autoRotate = true
    this.controls.autoRotateSpeed = 1.2
    this.controls.minPolarAngle = Math.PI * 0.3
    this.controls.maxPolarAngle = Math.PI * 0.62
    // вертикальный свайп на телефоне — прокрутка карточки, горизонтальный — вращение
    this.renderer.domElement.style.touchAction = 'pan-y'

    this.ready = loader.loadAsync(url).then((gltf) => {
      if (this.destroyed) return
      this.model = gltf.scene
      this.model.traverse((o) => {
        if (!o.isMesh) return
        const name = o.name.toLowerCase()
        const key = Object.keys(MATERIALS).find((k) => name.startsWith(k)) || 'default'
        o.material = new THREE.MeshPhysicalMaterial(MATERIALS[key])
      })
      this.frame()
      this.scene.add(this.model)
      host.classList.add('is-loaded')
    })

    this.onResize = this.onResize.bind(this)
    this.ro = new ResizeObserver(this.onResize)
    this.ro.observe(host)
    this.onResize()

    this.renderer.setAnimationLoop(() => {
      this.controls.update()
      this.renderer.render(this.scene, this.camera)
    })
  }

  // ставим модель в центр и отодвигаем камеру так, чтобы она целиком влезла в кадр
  frame() {
    const box = new THREE.Box3().setFromObject(this.model)
    const center = box.getCenter(new THREE.Vector3())
    const radius = box.getBoundingSphere(new THREE.Sphere()).radius
    this.model.position.sub(center)
    const fov = THREE.MathUtils.degToRad(this.camera.fov)
    const dist = radius / Math.sin(Math.min(fov, fov * this.camera.aspect) / 2)
    this.camera.position.set(0, radius * 0.15, dist * 1.05)
    this.camera.near = dist / 20
    this.camera.far = dist * 4
    this.camera.updateProjectionMatrix()
    this.controls.target.set(0, 0, 0)
    this.controls.update()
  }

  onResize() {
    const { clientWidth: w, clientHeight: h } = this.host
    if (!w || !h) return
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  destroy() {
    this.destroyed = true
    this.renderer.setAnimationLoop(null)
    this.ro.disconnect()
    this.controls.dispose()
    this.scene.traverse((o) => {
      if (!o.isMesh) return
      o.geometry.dispose()
      o.material.dispose()
    })
    this.scene.environment?.dispose()
    this.renderer.dispose()
    this.renderer.domElement.remove()
  }
}
