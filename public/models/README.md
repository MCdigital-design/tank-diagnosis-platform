# 3D 模型资源

将 Blender 导出的 `terminal_site.glb` 或单罐 `tank_01.glb` 放在此目录，然后在 `StorageTank.tsx` 或新组件中用 `useGLTF` 加载即可替换当前程序生成的几何体。

推荐导出设置：glTF 2.0 / GLB、Draco 压缩可选、单文件 &lt; 30MB。
