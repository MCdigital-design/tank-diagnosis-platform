import { useLayoutEffect, useRef } from 'react'
import type { SelectionLinkSegment } from './selectionLinkTypes'

export type SceneSelectionLinkHandle = {
  paint: (segment: SelectionLinkSegment | null) => void
}

type Props = {
  onReady: (handle: SceneSelectionLinkHandle | null) => void
}

export function SceneSelectionLink({ onReady }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const lineRef = useRef<SVGLineElement>(null)
  const dotRef = useRef<SVGCircleElement>(null)
  const ringRef = useRef<SVGCircleElement>(null)

  const paint = (segment: SelectionLinkSegment | null) => {
    const svg = svgRef.current
    const line = lineRef.current
    const dot = dotRef.current
    const ring = ringRef.current
    if (!svg || !line || !dot || !ring) return

    if (!segment?.visible || segment.width < 1) {
      svg.style.opacity = '0'
      return
    }

    svg.setAttribute('viewBox', `0 0 ${segment.width} ${segment.height}`)
    svg.style.opacity = '1'

    line.setAttribute('x1', String(segment.x1))
    line.setAttribute('y1', String(segment.y1))
    line.setAttribute('x2', String(segment.x2))
    line.setAttribute('y2', String(segment.y2))

    dot.setAttribute('cx', String(segment.x1))
    dot.setAttribute('cy', String(segment.y1))
    ring.setAttribute('cx', String(segment.x1))
    ring.setAttribute('cy', String(segment.y1))
  }

  useLayoutEffect(() => {
    onReady({ paint })
    return () => onReady(null)
  }, [onReady])

  return (
    <svg ref={svgRef} className="scene__selection-link" aria-hidden>
      <defs>
        <linearGradient id="scene-link-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(0, 229, 160, 0.9)" />
          <stop offset="100%" stopColor="rgba(61, 158, 255, 0.45)" />
        </linearGradient>
      </defs>
      <circle
        ref={ringRef}
        r={10}
        fill="none"
        stroke="rgba(0, 229, 160, 0.4)"
        strokeWidth="1"
      />
      <line
        ref={lineRef}
        stroke="url(#scene-link-grad)"
        strokeWidth="1.5"
        strokeDasharray="6 5"
        opacity={0.85}
      />
      <circle ref={dotRef} r={4} fill="rgba(0, 229, 160, 0.95)" />
    </svg>
  )
}
