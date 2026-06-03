import { useEffect, type RefObject } from 'react'
import { tankRoofNdc } from './tankLinkState'
import type { SceneSelectionLinkHandle } from './SceneSelectionLink'
import type { SelectionLinkSegment } from './selectionLinkTypes'

type Args = {
  active: boolean
  viewportRef: RefObject<HTMLDivElement | null>
  cardRef: RefObject<HTMLDivElement | null>
  painterRef: RefObject<SceneSelectionLinkHandle | null>
}

/** DOM measurements run outside Canvas (requestAnimationFrame), safe for WebGL. */
export function useSelectionLinkLoop({
  active,
  viewportRef,
  cardRef,
  painterRef,
}: Args) {
  useEffect(() => {
    if (!active) {
      painterRef.current?.paint(null)
      tankRoofNdc.current.valid = false
      return
    }

    let frame = 0

    const tick = () => {
      const viewport = viewportRef.current
      const card = cardRef.current
      const painter = painterRef.current
      const ndc = tankRoofNdc.current

      if (!viewport || !card || !painter) {
        frame = requestAnimationFrame(tick)
        return
      }

      const vpRect = viewport.getBoundingClientRect()
      const canvas = viewport.querySelector('canvas')
      const canvasRect = canvas?.getBoundingClientRect()
      const cardRect = card.getBoundingClientRect()

      if (!canvasRect || !ndc.valid || vpRect.width < 1) {
        painter.paint(null)
        frame = requestAnimationFrame(tick)
        return
      }

      const ndcX = ndc.x * 0.5 + 0.5
      const ndcY = -ndc.y * 0.5 + 0.5

      const segment: SelectionLinkSegment = {
        x1: canvasRect.left + ndcX * canvasRect.width - vpRect.left,
        y1: canvasRect.top + ndcY * canvasRect.height - vpRect.top,
        x2: cardRect.left - vpRect.left,
        y2: cardRect.top - vpRect.top + cardRect.height / 2,
        width: vpRect.width,
        height: vpRect.height,
        visible: true,
      }

      painter.paint(segment)
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, viewportRef, cardRef, painterRef])
}
