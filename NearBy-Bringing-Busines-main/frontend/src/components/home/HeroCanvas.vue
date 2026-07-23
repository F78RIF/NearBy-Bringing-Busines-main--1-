<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef } from 'vue'
import * as THREE from 'three'

const canvasEl = shallowRef<HTMLCanvasElement | null>(null)

let renderer: THREE.WebGLRenderer | null = null
let animationFrame = 0
let resizeObserver: ResizeObserver | null = null
let parentEl: HTMLElement | null = null
let onPointerMove: ((e: PointerEvent) => void) | null = null
let disposables: { dispose: () => void }[] = []

onMounted(() => {
  const canvas = canvasEl.value
  parentEl = canvas?.parentElement ?? null
  if (!canvas || !parentEl) return

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x16324b, 0.055)

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100)
  camera.position.set(0, 0, 13)

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // Particle field standing in for "UMKM terdekat" pins scattered around the user
  const COUNT = 140
  const positions = new Float32Array(COUNT * 3)
  const colors = new Float32Array(COUNT * 3)
  const palette = [
    new THREE.Color('#f0b857'),
    new THREE.Color('#3e8e82'),
    new THREE.Color('#9fb4d0'),
    new THREE.Color('#ffffff'),
  ]

  const spread = 9
  for (let i = 0; i < COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * spread * 2
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 1.15
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread

    const c = palette[Math.floor(Math.random() * palette.length)]
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
  }

  const particleGeo = new THREE.BufferGeometry()
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const particleMat = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })

  const points = new THREE.Points(particleGeo, particleMat)

  // Connect nearby pins so the field reads as a map/network rather than noise
  const linePositions: number[] = []
  const maxDistSq = 3.1 * 3.1
  for (let i = 0; i < COUNT; i++) {
    let links = 0
    for (let j = i + 1; j < COUNT && links < 2; j++) {
      const dx = positions[i * 3] - positions[j * 3]
      const dy = positions[i * 3 + 1] - positions[j * 3 + 1]
      const dz = positions[i * 3 + 2] - positions[j * 3 + 2]
      const distSq = dx * dx + dy * dy + dz * dz
      if (distSq < maxDistSq) {
        linePositions.push(
          positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
          positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2],
        )
        links++
      }
    }
  }
  const lineGeo = new THREE.BufferGeometry()
  lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3))
  const lineMat = new THREE.LineBasicMaterial({ color: 0x6f93c2, transparent: true, opacity: 0.18 })
  const lines = new THREE.LineSegments(lineGeo, lineMat)

  const group = new THREE.Group()
  group.add(points, lines)
  scene.add(group)

  disposables = [particleGeo, particleMat, lineGeo, lineMat]

  let pointerX = 0
  let pointerY = 0
  onPointerMove = (e: PointerEvent) => {
    const rect = parentEl!.getBoundingClientRect()
    pointerX = Math.min(Math.max(((e.clientX - rect.left) / rect.width) * 2 - 1, -1.5), 1.5)
    pointerY = Math.min(Math.max(((e.clientY - rect.top) / rect.height) * 2 - 1, -1.5), 1.5)
  }
  // Listen on window: the canvas wrapper is pointer-events-none so it never
  // receives events itself, and hero content sits in a sibling layer.
  window.addEventListener('pointermove', onPointerMove)

  function resize() {
    const rect = parentEl!.getBoundingClientRect()
    const width = Math.max(rect.width, 1)
    const height = Math.max(rect.height, 1)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer!.setSize(width, height, false)
  }
  resize()
  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(parentEl)

  const clock = new THREE.Clock()
  function tick() {
    const t = clock.getElapsedTime()
    group.rotation.y = t * 0.045 + pointerX * 0.25
    group.rotation.x = pointerY * 0.12
    renderer!.render(scene, camera)
    animationFrame = requestAnimationFrame(tick)
  }

  if (prefersReducedMotion) {
    renderer.render(scene, camera)
  } else {
    tick()
  }
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrame)
  if (onPointerMove) window.removeEventListener('pointermove', onPointerMove)
  resizeObserver?.disconnect()
  disposables.forEach((d) => d.dispose())
  renderer?.dispose()
})
</script>

<template>
  <canvas ref="canvasEl" class="absolute inset-0 h-full w-full" aria-hidden="true" />
</template>
