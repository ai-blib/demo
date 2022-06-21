import {
  AreaLight,
  Cube,
  Dummy,
  LingoEditor,
  Model,
  OrbitCamera,
  Reflector,
  Setup,
  SvgMesh,
  ThirdPersonCamera,
  World,
  types
} from "lingo3d-react";
import { useCallback, useRef, useState } from "react";
import "./App.css";

const App = () => {
  const [arrowPosition, setArrowPosition] = useState({ x: 0, y: 0, z: 0 })
  const dummyRef = useRef<types.Dummy>(null)

  const handleClick = useCallback((e: types.LingoMouseEvent) => {
    const dummy = dummyRef.current
    if (!dummy) return

    setArrowPosition(e.point)
    dummy.lerpTo(e.point.x, dummy.y, e.point.z, 0.01)

    dummy.onLoop = () => {
      dummy.lookAt({ ...e.point, y: dummy.y })
    }
  }, [])

  return (
    <World>
      <Model
        bloom
        width={245.36}
        depth={245.36}
        scaleX={20}
        scaleY={20}
        scaleZ={20}
        src="scene.glb"
        onClick={handleClick}
      />
      <ThirdPersonCamera active mouseControl="drag" lockTargetRotation="dynamic-lock"  >
        <Dummy
          ref={dummyRef}
          metalnessFactor={0.5}
          roughnessFactor={0.5}
          y={44.58}
        />
      </ThirdPersonCamera>
      <Reflector
        y={-39.38}
        scaleX={113.2}
        scaleY={113.2}
        rotationX={-90}
        normalScale={{ x: 1, y: 1 }}
      />
      <AreaLight
        x={-25.87}
        y={3392.78}
        z={9.76}
        scaleX={69.3}
        scaleY={69.3}
        rotationX={-90}
        color="white"
        intensity={2.6}
        helper={false}
      />
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
      <Setup
        defaultFog="white"
        defaultLight={false}
        bloomStrength={1}
        bloomThreshold={0.5}
      />
      {/* <LingoEditor/> */}
    </World>
  );
};

export default App;
