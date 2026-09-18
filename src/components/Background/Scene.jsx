import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Float } from "@react-three/drei";

const NODE_COUNT = 240;

function NeuralGlobe() {
  const group = useRef();
  const points = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(NODE_COUNT * 3);
    const gold = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < NODE_COUNT; i++) {
      const y = 1 - (i / (NODE_COUNT - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = gold * i;
      arr[i * 3] = Math.cos(theta) * r;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = Math.sin(theta) * r;
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.08;
      group.current.rotation.x += delta * 0.02;
    }
    if (points.current) {
      const t = state.clock.elapsedTime;
      points.current.rotation.y = Math.sin(t * 0.1) * 0.2;
    }
  });

  return (
    <group ref={group}>
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
        <Points ref={points} positions={positions} stride={3}>
          <PointMaterial
            transparent
            color="#34d399"
            size={0.035}
            sizeAttenuation
            depthWrite={false}
            opacity={0.85}
          />
        </Points>
        <mesh>
          <icosahedronGeometry args={[1.9, 1]} />
          <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.06} />
        </mesh>
      </Float>
    </group>
  );
}

const Scene = () => (
  <Canvas
    dpr={[1, 1.5]}
    camera={{ position: [0, 0, 4.2], fov: 45 }}
    gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    style={{ position: "absolute", inset: 0, background: "transparent" }}
  >
    <NeuralGlobe />
  </Canvas>
);

export default Scene;
