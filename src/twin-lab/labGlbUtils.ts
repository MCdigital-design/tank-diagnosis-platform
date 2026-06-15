import { Box3, Vector3, type Object3D } from 'three'

export function fitSceneToTank(
  scene: Object3D,
  radius: number,
  height: number,
): Object3D {
  const clone = scene.clone(true)
  const box = new Box3().setFromObject(clone)
  const size = box.getSize(new Vector3())
  const center = box.getCenter(new Vector3())
  clone.position.sub(center)
  clone.position.y += size.y / 2

  const diameter = Math.max(size.x, size.z, 0.001)
  const scale = Math.min(height / Math.max(size.y, 0.001), (radius * 2) / diameter)
  clone.scale.setScalar(scale)
  return clone
}

export function estimateTriangles(root: Object3D): number {
  let count = 0
  root.traverse((child) => {
    const mesh = child as Object3D & { geometry?: { index?: { count: number } | null; attributes?: { position?: { count: number } } } }
    if (!mesh.geometry?.attributes?.position) return
    const pos = mesh.geometry.attributes.position.count
    const index = mesh.geometry.index?.count
    count += index ? index / 3 : pos / 3
  })
  return Math.round(count)
}
