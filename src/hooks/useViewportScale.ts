import { useEffect, useState } from 'react'

export const DESIGN_WIDTH = 1920
export const DESIGN_HEIGHT = 1080

export function useViewportScale() {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const update = () => {
      const s = Math.min(
        window.innerWidth / DESIGN_WIDTH,
        window.innerHeight / DESIGN_HEIGHT,
      )
      setScale(s)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return scale
}
