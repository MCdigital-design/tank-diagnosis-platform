import { Canvas } from '@react-three/fiber'
import type { ComponentProps, ReactNode } from 'react'
import { isWebGLAvailable } from '../../utils/webgl'
import { scaledCanvasEvents } from './scaledCanvasEvents'

type Props = {
  children: ReactNode
  onPointerMissed?: () => void
  canvasProps?: Omit<ComponentProps<typeof Canvas>, 'children' | 'events' | 'onPointerMissed'>
}

export function SceneCanvas({ children, onPointerMissed, canvasProps }: Props) {
  if (!isWebGLAvailable()) {
    return (
      <div className="scene__webgl-fallback">
        <strong>无法启动 3D 视图</strong>
        <p>当前浏览器或显卡未提供 WebGL 支持，储罐三维场景无法显示。</p>
        <p>请使用桌面版 Chrome / Edge 最新版，更新显卡驱动，或联系 IT 检查浏览器策略。</p>
        <p>左侧与右侧数据面板仍可正常查看演示数据。</p>
      </div>
    )
  }

  return (
    <Canvas
      events={scaledCanvasEvents}
      onPointerMissed={onPointerMissed}
      gl={{ antialias: true, alpha: false }}
      {...canvasProps}
    >
      {children}
    </Canvas>
  )
}
