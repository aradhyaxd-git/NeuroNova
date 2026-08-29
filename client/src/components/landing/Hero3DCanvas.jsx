import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Icosahedron, Octahedron, Line } from '@react-three/drei';
import * as THREE from 'three';

function createNodeTexture(label, color) {
  const canvas = document.createElement('canvas');
  canvas.width = 280;
  canvas.height = 70;
  const ctx = canvas.getContext('2d');

  // Background Capsule
  ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
  ctx.beginPath();
  ctx.roundRect(4, 4, 272, 62, 31);
  ctx.fill();

  // Brand Accent Border
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Brand Color Core Dot
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(28, 35, 8, 0, Math.PI * 2);
  ctx.fill();

  // Brand Title Text
  ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, 48, 35);

  return new THREE.CanvasTexture(canvas);
}

function SophisticatedKnowledgeCore({ scrollProgress = 0 }) {
  const outerCoreRef = useRef();
  const innerCoreRef = useRef();
  const ringGroupRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (outerCoreRef.current) {
      outerCoreRef.current.rotation.x = t * 0.12 + scrollProgress * 2;
      outerCoreRef.current.rotation.y = t * 0.18 + scrollProgress * 3;
    }

    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y = -t * 0.25;
      innerCoreRef.current.rotation.z = t * 0.15;
    }

    if (ringGroupRef.current) {
      ringGroupRef.current.rotation.z = t * 0.08;
    }
  });

  const coreScale = 1 + scrollProgress * 0.3;

  return (
    <group scale={coreScale}>
      {/* Outer Polyhedral Wireframe Geometry */}
      <Icosahedron ref={outerCoreRef} args={[1.2, 2]} scale={1}>
        <meshStandardMaterial
          color="#6366f1"
          wireframe
          transparent
          opacity={0.7}
          emissive="#818cf8"
          emissiveIntensity={0.6}
        />
      </Icosahedron>

      {/* Inner Crystalline Octahedron Core */}
      <Octahedron ref={innerCoreRef} args={[0.7, 0]} scale={1}>
        <meshStandardMaterial
          color="#a855f7"
          emissive="#c084fc"
          emissiveIntensity={1}
          roughness={0.05}
          metalness={0.95}
        />
      </Octahedron>

      {/* Concentric Laser Orbit Rings */}
      <group ref={ringGroupRef}>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[1.8, 0.008, 16, 100]} />
          <meshBasicMaterial color="#818cf8" transparent opacity={0.6} />
        </mesh>
        <mesh rotation={[-Math.PI / 4, Math.PI / 4, 0]}>
          <torusGeometry args={[2.3, 0.008, 16, 100]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.5} />
        </mesh>
      </group>
    </group>
  );
}

function RealTechSkillNode({ position, label, color, isSelected, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const texture = useMemo(() => createNodeTexture(label, color), [label, color]);

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5} position={position}>
      <group
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onSelect}
      >
        <mesh scale={hovered ? 1.3 : 1}>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 1.5 : 0.8}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>

        {/* 100% Local WebGL Brand Sprite */}
        <sprite position={[0, 0.42, 0]} scale={[1.5, 0.38, 1]}>
          <spriteMaterial map={texture} transparent opacity={hovered || isSelected ? 1 : 0.88} />
        </sprite>
      </group>
    </Float>
  );
}

function LaserConnectionLines({ nodes, scrollProgress = 0 }) {
  const lines = useMemo(() => {
    const list = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      list.push({ start: nodes[i].position, end: nodes[i + 1].position, key: `${i}-${i+1}` });
    }
    nodes.forEach((n, idx) => {
      list.push({ start: [0, 0, 0], end: n.position, key: `core-${idx}`, isRadial: true });
    });
    return list;
  }, [nodes]);

  const opacity = 0.25 + scrollProgress * 0.4;

  return (
    <group>
      {lines.map((l) => (
        <Line
          key={l.key}
          points={[l.start, l.end]}
          color={l.isRadial ? '#818cf8' : '#38bdf8'}
          lineWidth={l.isRadial ? 1 : 1.5}
          transparent
          opacity={l.isRadial ? opacity * 0.6 : opacity}
        />
      ))}
    </group>
  );
}

function SceneContent({ scrollProgress, activeNodeIndex, setActiveNodeIndex }) {
  const baseNodes = [
    { label: 'JavaScript', color: '#F7DF1E', basePos: [-3.2, 1.4, 0.2] },
    { label: 'TypeScript', color: '#3178C6', basePos: [-2.2, -0.6, 0.6] },
    { label: 'React 19', color: '#61DAFB', basePos: [-1.8, 2.1, -0.4] },
    { label: 'Node.js', color: '#5FA04E', basePos: [2.0, 1.8, 0.4] },
    { label: 'PostgreSQL', color: '#4169E1', basePos: [3.3, 0.8, -0.2] },
    { label: 'Redis', color: '#FF4438', basePos: [2.7, -1.6, 0.5] },
    { label: 'Python & AI', color: '#3776AB', basePos: [-3.1, -1.8, 0.3] },
    { label: 'Docker & Infra', color: '#2496ED', basePos: [0.0, -2.6, -0.6] }
  ];

  const currentNodes = baseNodes.map((node, i) => {
    let [x, y, z] = node.basePos;

    if (scrollProgress > 0.1 && scrollProgress < 0.5) {
      const factor = 1 - (scrollProgress - 0.1) * 0.8;
      x *= factor;
      y *= factor;
      z *= factor;
    } else if (scrollProgress >= 0.5) {
      const step = (i - 3.5) * 1.25;
      x = THREE.MathUtils.lerp(x, step, (scrollProgress - 0.5) * 2);
      y = THREE.MathUtils.lerp(y, Math.sin(i * 0.8) * 0.5, (scrollProgress - 0.5) * 2);
    }

    return { ...node, position: [x, y, z] };
  });

  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#818cf8" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#c084fc" />

      <SophisticatedKnowledgeCore scrollProgress={scrollProgress} />

      {currentNodes.map((n, i) => (
        <RealTechSkillNode
          key={i}
          {...n}
          isSelected={activeNodeIndex === i}
          onSelect={() => setActiveNodeIndex(i)}
        />
      ))}

      <LaserConnectionLines nodes={currentNodes} scrollProgress={scrollProgress} />
    </>
  );
}

export default function Hero3DCanvas({ scrollProgress = 0 }) {
  const [activeNodeIndex, setActiveNodeIndex] = useState(1);

  return (
    <div className="hero-3d-canvas-wrap">
      <Canvas camera={{ position: [0, 0, 7.5], fov: 45 }}>
        <SceneContent
          scrollProgress={scrollProgress}
          activeNodeIndex={activeNodeIndex}
          setActiveNodeIndex={setActiveNodeIndex}
        />
      </Canvas>
    </div>
  );
}
