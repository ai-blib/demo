import {
  Dummy,
  Model,
  Reflector,
  SvgMesh,
  ThirdPersonCamera,
  World,
  types,
  usePreload,
} from "lingo3d-react"
import { useRef, useState } from "react"
import "./App.css"

// Game world component
// 场景组件
const Game = () => {
  // When user clicks on map model, set arrow position to clicked position
  // 点击地图模型时，设置箭头位置为点击位置
  const [arrowPosition, setArrowPosition] = useState({ x: 0, y: 0, z: 0 })
  
  const dummyRef = useRef<types.Dummy>(null)
  const [running, setRunning] = useState(false)

  const handleClick = (e: types.MouseEvent) => {
    const dummy = dummyRef.current
    if (!dummy) return

    setArrowPosition(e.point)
    dummy.lookTo(e.point.x, undefined, e.point.z, 0.1)
    dummy.moveTo(e.point.x, undefined, e.point.z, 10)
    setRunning(true)

    dummy.onMoveToEnd = () => {
      setRunning(false)
    }
  }

  return (
    <World
      defaultFog="white"
      defaultLight="env1.jpg"
      bloomStrength={1}
      bloomThreshold={0.5}
    >
      <Model
        physics="map"
        bloom
        width={245.36}
        depth={245.36}
        scaleX={20}
        scaleY={20}
        scaleZ={20}
        src="stadium.glb"
        onClick={handleClick}
      />
      <Reflector
        y={-39.38}
        scaleX={113.2}
        scaleY={113.2}
        rotationX={-90}
        blur={512}
      />
      <ThirdPersonCamera
        active
        mouseControl="drag"
        lockTargetRotation={false}
        enableDamping
      >
        <Dummy
          physics="character"
          ref={dummyRef}
          metalnessFactor={-0.5}
          roughnessFactor={0}
          animation={running ? "running" : "idle"}
          y={44.58}
        />
      </ThirdPersonCamera>
      {running && (
        <SvgMesh
          bloom
          metalnessFactor={1}
          roughnessFactor={0.4}
          width={72.99}
          height={100}
          depth={100}
          scaleX={-0.82}
          scaleZ={0.19}
          src="arrow.svg"
          color="#ff4e4e"
          emissiveColor="#223056"
          roughness={0.4}
          x={arrowPosition.x}
          y={arrowPosition.y + 50}
          z={arrowPosition.z}
          animation={{ rotationY: [0, 45, 90, 135, 180, 225, 270, 315, 360] }}
        />
      )}
    </World>
  )
}

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
