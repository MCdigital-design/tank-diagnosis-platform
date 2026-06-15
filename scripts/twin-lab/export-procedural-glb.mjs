#!/usr/bin/env node
/**
 * Export DetailedTank-equivalent procedural geometry to GLB (Node + Three.js GLTFExporter).
 * Fallback when Blender/Unity/Unreal/Meshy are unavailable.
 *
 * Usage:
 *   node scripts/twin-lab/export-procedural-glb.mjs [variant]
 *   node scripts/twin-lab/export-procedural-glb.mjs all
 *
 * Variants: d (baseline), a (enhanced panels), b (meshy-style tint), e (HDRP warm), f (Lumen cool), all
 */

import { readFileSync, mkdirSync, writeFileSync, copyFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Blob } from 'node:buffer'

// GLTFExporter expects browser FileReader/Blob
if (typeof globalThis.Blob === 'undefined') globalThis.Blob = Blob
if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class FileReader {
    result = null
    onload = null
    onloadend = null
    onerror = null
    readAsArrayBuffer(blob) {
      blob
        .arrayBuffer()
        .then((buf) => {
          this.result = buf
          this.onload?.({ target: this })
          this.onloadend?.({ target: this })
        })
        .catch((err) => this.onerror?.(err))
    }
  }
}

import * as THREE from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '../..')
const SPEC_PATH = join(ROOT, 'scripts/blender/hero_tank_spec.json')
const OUT_DIR = join(ROOT, 'public/models/variants')

const VARIANT_PRESETS = {
  d: {
    file: 'tank_d.glb',
    shell: [0.42, 0.52, 0.62],
    roof: [0.72, 0.77, 0.82],
    detail: [0.48, 0.55, 0.62],
    rail: [0.94, 0.75, 0.25],
    panelBoost: 1,
    label: 'Route D — procedural baseline',
  },
  a: {
    file: 'tank_a.glb',
    shell: [0.38, 0.5, 0.68],
    roof: [0.68, 0.74, 0.86],
    detail: [0.44, 0.54, 0.66],
    rail: [0.92, 0.78, 0.28],
    panelBoost: 1.35,
    label: 'Route A — enhanced procedural (Blender MCP stand-in)',
  },
  b: {
    file: 'tank_b.glb',
    shell: [0.5, 0.48, 0.55],
    roof: [0.78, 0.75, 0.8],
    detail: [0.55, 0.52, 0.58],
    rail: [0.88, 0.7, 0.32],
    panelBoost: 1.1,
    label: 'Route B — Meshy-style material variant (no API key)',
  },
  e: {
    file: 'tank_e.glb',
    shell: [0.55, 0.58, 0.62],
    roof: [0.82, 0.84, 0.88],
    detail: [0.6, 0.62, 0.66],
    rail: [0.96, 0.82, 0.35],
    panelBoost: 1.2,
    label: 'Route E — HDRP warm procedural stand-in',
  },
  f: {
    file: 'tank_f.glb',
    shell: [0.35, 0.48, 0.58],
    roof: [0.65, 0.72, 0.82],
    detail: [0.42, 0.52, 0.62],
    rail: [0.9, 0.74, 0.3],
    panelBoost: 1.15,
    label: 'Route F — Lumen cool procedural stand-in',
  },
}

function loadSpec() {
  return JSON.parse(readFileSync(SPEC_PATH, 'utf8'))
}

function makeMat(color, metallic, roughness) {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color[0], color[1], color[2]),
    metalness: metallic,
    roughness: roughness,
  })
}

function addCylinder(group, { radius, height, y, mat, segments = 64, name }) {
  const geo = new THREE.CylinderGeometry(radius, radius, height, segments)
  const mesh = new THREE.Mesh(geo, mat)
  mesh.position.y = y
  mesh.name = name
  group.add(mesh)
  return mesh
}

function addBox(group, { w, h, d, x, y, z, rotY = 0, mat, name }) {
  const geo = new THREE.BoxGeometry(w, h, d)
  const mesh = new THREE.Mesh(geo, mat)
  mesh.position.set(x, y, z)
  mesh.rotation.y = rotY
  mesh.name = name
  group.add(mesh)
  return mesh
}

function buildTankGroup(spec, preset) {
  const radius = spec.base.radius
  const height = spec.base.height
  const root = new THREE.Group()
  root.name = 'hero_tank'

  const shellMat = makeMat(preset.shell, 0.55, 0.42)
  const roofMat = makeMat(preset.roof, 0.62, 0.38)
  const detailMat = makeMat(preset.detail, 0.7, 0.35)
  const railMat = makeMat(preset.rail, 0.75, 0.3)
  const foundationMat = makeMat([0.29, 0.35, 0.41], 0.7, 0.35)
  const sealMat = makeMat([0.42, 0.47, 0.53], 0.65, 0.4)

  const foundation = spec.foundation
  addCylinder(root, {
    radius: radius * foundation.radiusRatio,
    height: height * foundation.heightRatio,
    y: (height * foundation.heightRatio) / 2,
    mat: foundationMat,
    name: 'foundation',
  })

  addCylinder(root, {
    radius,
    height: height * 0.97,
    y: height / 2,
    mat: shellMat,
    name: 'shell',
  })

  const panelArc = (Math.PI * 2) / spec.shellPanels
  const panelWidth = radius * 0.08 * preset.panelBoost
  const panelDepth = radius * 0.012 * preset.panelBoost
  for (let i = 0; i < spec.shellPanels; i++) {
    const a = i * panelArc
    const x = Math.cos(a) * (radius + panelDepth * 0.5)
    const z = Math.sin(a) * (radius + panelDepth * 0.5)
    addBox(root, {
      w: panelWidth,
      h: height * 0.92,
      d: panelDepth,
      x,
      y: height / 2,
      z,
      rotY: -a + Math.PI / 2,
      mat: shellMat,
      name: `panel_${i}`,
    })
  }

  const roofY = height * spec.roofHeightRatio
  const roofR = radius * spec.roofRadiusRatio
  addCylinder(root, {
    radius: roofR,
    height: height * 0.045,
    y: roofY,
    mat: roofMat,
    name: 'roof',
  })
  addCylinder(root, {
    radius: roofR * 0.88,
    height: height * 0.018,
    y: roofY + height * 0.02,
    mat: roofMat,
    name: 'roof_cap',
  })

  const seal = spec.seal
  addCylinder(root, {
    radius: (radius * (seal.radiusOutRatio + seal.radiusInRatio)) / 2,
    height: height * seal.heightRatio,
    y: height * 0.985,
    mat: sealMat,
    name: 'seal',
  })

  const walkway = spec.walkway
  const walkY = height + walkway.heightRatio * height * 0.5
  const outer = radius * walkway.radiusRatio
  const inner = radius * 0.98
  const ringGeo = new THREE.RingGeometry(inner, outer, 64)
  const ring = new THREE.Mesh(ringGeo, detailMat)
  ring.rotation.x = -Math.PI / 2
  ring.position.y = walkY
  ring.name = 'walkway'
  root.add(ring)

  const railH = height * walkway.railHeightRatio
  const posts = walkway.railPosts ?? 32
  for (let i = 0; i < posts; i++) {
    const a = (i / posts) * Math.PI * 2
    addBox(root, {
      w: 0.04,
      h: railH,
      d: 0.04,
      x: Math.cos(a) * outer,
      y: walkY + railH / 2,
      z: Math.sin(a) * outer,
      mat: railMat,
      name: `rail_${i}`,
    })
  }

  const ladder = spec.ladder
  const ladderW = radius * ladder.widthRatio
  const railOff = radius * ladder.railOffsetRatio
  const angle = ladder.angleRadians
  const lx = Math.cos(angle) * (radius + railOff)
  const lz = Math.sin(angle) * (radius + railOff)
  const ladderGroup = new THREE.Group()
  ladderGroup.position.set(lx, 0, lz)
  ladderGroup.rotation.y = -angle + Math.PI / 2
  ladderGroup.name = 'ladder'
  addBox(ladderGroup, {
    w: 0.04,
    h: height * 0.88,
    d: 0.04,
    x: -ladderW / 2,
    y: height / 2,
    z: 0,
    mat: detailMat,
    name: 'ladder_rail_l',
  })
  addBox(ladderGroup, {
    w: 0.04,
    h: height * 0.88,
    d: 0.04,
    x: ladderW / 2,
    y: height / 2,
    z: 0,
    mat: detailMat,
    name: 'ladder_rail_r',
  })
  for (let i = 0; i < ladder.cageRungs; i++) {
    const y = 0.35 + (i / (ladder.cageRungs - 1)) * (height * 0.82)
    addBox(ladderGroup, {
      w: ladderW,
      h: 0.035,
      d: 0.03,
      x: 0,
      y,
      z: 0,
      mat: detailMat,
      name: `rung_${i}`,
    })
  }
  root.add(ladderGroup)

  for (const pipe of spec.pipes) {
    const py = height * pipe.heightRatio
    const len = radius * pipe.lengthRatio
    const pr = radius * pipe.radiusRatio
    const px = Math.cos(pipe.angleRadians) * radius
    const pz = Math.sin(pipe.angleRadians) * radius
    const nx = Math.cos(pipe.angleRadians)
    const nz = Math.sin(pipe.angleRadians)
    const pipeGroup = new THREE.Group()
    pipeGroup.name = 'pipe'
    const cyl = new THREE.Mesh(
      new THREE.CylinderGeometry(pr, pr, len, 12),
      detailMat,
    )
    cyl.rotation.z = Math.PI / 2
    cyl.position.set(px + (nx * len) / 2, py, pz + (nz * len) / 2)
    pipeGroup.add(cyl)
    const flange = new THREE.Mesh(
      new THREE.CylinderGeometry(pr * 1.35, pr * 1.35, pr * 2, 12),
      detailMat,
    )
    flange.position.set(px + nx * (len + pr * 1.2), py, pz + nz * (len + pr * 1.2))
    pipeGroup.add(flange)
    root.add(pipeGroup)
  }

  const vent = spec.vent
  const ventX = Math.cos(vent.angleRadians) * roofR * 0.35
  const ventZ = Math.sin(vent.angleRadians) * roofR * 0.35
  addCylinder(root, {
    radius: radius * vent.radiusRatio,
    height: height * vent.heightRatio,
    y: roofY + (height * vent.heightRatio) / 2,
    mat: makeMat([0.56, 0.6, 0.66], 0.65, 0.38),
    name: 'vent',
  })
  root.children.at(-1).position.x = ventX
  root.children.at(-1).position.z = ventZ

  for (const [name, [nx, nz]] of Object.entries(spec.anchors)) {
    const anchor = new THREE.Object3D()
    anchor.name = name
    anchor.position.set(nx * radius, roofY + 0.08, nz * radius)
    root.add(anchor)
  }

  return root
}

async function exportGlb(scene, outPath) {
  const exporter = new GLTFExporter()
  const result = await exporter.parseAsync(scene, { binary: true })
  const buffer = result instanceof ArrayBuffer ? Buffer.from(result) : Buffer.from(result)
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, buffer)
  return buffer.length
}

async function exportVariant(key) {
  const preset = VARIANT_PRESETS[key]
  if (!preset) throw new Error(`Unknown variant: ${key}`)
  const spec = loadSpec()
  const scene = new THREE.Scene()
  scene.add(buildTankGroup(spec, preset))
  const outPath = join(OUT_DIR, preset.file)
  const bytes = await exportGlb(scene, outPath)
  const kb = (bytes / 1024).toFixed(1)
  console.log(`✓ ${preset.label}`)
  console.log(`  → ${outPath} (${kb} KB)`)
  return { key, outPath, bytes }
}

async function main() {
  const arg = (process.argv[2] ?? 'all').toLowerCase()
  const keys = arg === 'all' ? Object.keys(VARIANT_PRESETS) : [arg]
  const results = []
  for (const key of keys) {
    results.push(await exportVariant(key))
  }

  if (arg === 'all' || arg === 'd') {
    const heroPath = join(ROOT, 'public/models/tank_hero.glb')
    const dPath = join(OUT_DIR, 'tank_d.glb')
    copyFileSync(dPath, heroPath)
    console.log(`✓ tank_hero.glb ← tank_d.glb (interim winner)`)
  }

  console.log(`\nExported ${results.length} GLB(s). Open: npm run dev:lab`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
