import * as THREE from 'three'

export function shellMaterial(baseColor: string, selected: boolean, hovered: boolean) {
  const color = selected ? '#7eb8d8' : hovered ? '#8fa8bc' : baseColor
  return new THREE.MeshStandardMaterial({
    color,
    metalness: 0.55,
    roughness: 0.42,
    emissive: selected ? '#1a8cff' : hovered ? '#3d8fd4' : '#000000',
    emissiveIntensity: selected ? 0.28 : hovered ? 0.12 : 0,
  })
}

export function roofMaterial(selected: boolean, hovered: boolean) {
  return new THREE.MeshStandardMaterial({
    color: selected ? '#9ec8e0' : hovered ? '#a8bcc8' : '#b8c4d0',
    metalness: 0.62,
    roughness: 0.38,
    emissive: selected ? '#4488bb' : hovered ? '#336688' : '#000000',
    emissiveIntensity: selected ? 0.18 : hovered ? 0.08 : 0,
  })
}

export function detailMaterial(tint = '#8a9aaa') {
  return new THREE.MeshStandardMaterial({
    color: tint,
    metalness: 0.7,
    roughness: 0.35,
  })
}

export function railMaterial() {
  return new THREE.MeshStandardMaterial({
    color: '#f0c040',
    metalness: 0.75,
    roughness: 0.3,
  })
}
