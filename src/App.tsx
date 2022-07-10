import {
  Dummy,
  Model,
  Reflector,
  SvgMesh,
  ThirdPersonCamera,
  World,
  usePreload
} from "lingo3d-react"
import { useState } from "react"
import "./App.css"

// Game world component
// 场景组件
const Game = () => {

  // When user clicks on map model, set arrow position to clicked position
  // 点击地图模型时，设置箭头位置为点击位置
  const [arrowPosition, setArrowPosition] = useState({ x: 0, y: 0, z: 0 })

  // When user clicks on map model, set running to true
  // 点击地图模型时，设置跑步为true
  const [running, setRunning] = useState(false)

  return (
    // World has white fog, environment image based lighting, and bloom effect
    // 场景有白色雾效，基于图片的环境光照，并且有泛光效果
    <World
      defaultFog="white"
      defaultLight="env.jpg"
      bloomStrength={1}
      bloomThreshold={0.5}
    >
      {/* Map model; when clicked, set arrow position and running state */}
      {/* 地图模型，点击时设置箭头位置以及跑步状态 */}
      <Model
        physics="map"
        bloom
        scale={20}
        src="stadium.glb"
        onClick={(e) => {
          setArrowPosition(e.point)
          setRunning(true)
        }}
      />

      {/* Ground reflection */}
      {/* 地面反射 */}
      <Reflector y={-39.38} scale={113.2} rotationX={-90} blur={512} />

      {/* Character dummy, and the camera that follows it */}
      {/* 角色假人，以及跟随它的相机 */}
      <ThirdPersonCamera
        active
        mouseControl="drag"
        lockTargetRotation={false}
        enableDamping
      >
        <Dummy
          physics="character"
          metalnessFactor={-0.5}
          roughnessFactor={0}
          y={44.58}
          // 4 arguments of lookTo are: x, y, z, and alpha. Smaller alpha means slower speed.
          // lookTo 的4个参数：x, y, z, 和 alpha。alpha 越小，速度越慢。
          lookTo={[arrowPosition.x, undefined, arrowPosition.z, 0.1]}
          // 4 arguments of moveTo: x, y, z, and speed.
          // moveTo 的4个参数：x, y, z, 和速度。
          moveTo={[arrowPosition.x, undefined, arrowPosition.z, 10]}
          // When moveTo is finished, set running to false
          // moveTo 完成后，设置跑步为false
          onMoveToEnd={() => setRunning(false)}
          // animation depends on running state
          // 跑步状态决定动画
          animation={running ? "running" : "idle"}
        />
      </ThirdPersonCamera>

      {/* When running, render an SVG arrow mesh */}
      {/* 当跑步时，渲染一个SVG箭头模型 */}
      {running && (
        <SvgMesh
          src="arrow.svg"
          bloom
          metalnessFactor={1}
          roughnessFactor={0.4}
          roughness={0.4}
          scaleZ={0.19}
          color="#ff4e4e"
          emissiveColor="#223056"
          x={arrowPosition.x}
          y={arrowPosition.y + 50}
          z={arrowPosition.z}
          animation={{ rotationY: [0, 45, 90, 135, 180, 225, 270, 315, 360] }}
        />
      )}
    </World>
  )
}

// App component renders preload progress
// App组件渲染预加载进度
const App = () => {
  const progress = usePreload(["stadium.glb"], "1.2mb")

  if (progress < 100)
    return (
      <div className="w-screen h-screen absolute left-0 top-0 text-white bg-black flex items-center justify-center">
        loaded: {Math.round(progress)}%
      </div>
    )

  return <Game />
}

export default App
