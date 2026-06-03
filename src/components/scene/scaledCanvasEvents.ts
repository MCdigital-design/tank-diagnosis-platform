import { events, type ComputeFunction } from '@react-three/fiber'

type PointerStore = Parameters<typeof events>[0]

const computePointer: ComputeFunction = (event, state) => {
  const rect = state.gl.domElement.getBoundingClientRect()
  const w = rect.width || 1
  const h = rect.height || 1
  state.pointer.set(
    ((event.clientX - rect.left) / w) * 2 - 1,
    -((event.clientY - rect.top) / h) * 2 + 1,
  )
  state.raycaster.setFromCamera(state.pointer, state.camera)
}

/**
 * Default R3F pointer math uses offsetX/offsetY vs internal size, which drifts when
 * an ancestor uses CSS transform: scale() (see App dashboard scaling).
 */
export function scaledCanvasEvents(store: PointerStore) {
  const manager = events(store)

  return {
    ...manager,
    compute: computePointer,
  }
}
