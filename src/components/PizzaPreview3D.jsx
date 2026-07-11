import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function ingredientConfig(name) {
  const all = []
  const add = (color, count) => { for (let i = 0; i < count; i++) all.push(color) }

  if (name.includes('لحمة') || name.includes('بولوبيف') || name.includes('برجر')) add('#8B2500', 5)
  if (name.includes('سجق') || name.includes('سوسيس') || name.includes('سلامي')) add('#CC3333', 4)
  if (name.includes('فراخ') || name.includes('استربس')) add('#D2A679', 4)
  if (name.includes('بسطرمة')) add('#8B0000', 4)
  if (name.includes('تونة')) add('#FFB6C1', 4)
  if (name.includes('مشرووم')) add('#C4A882', 4)
  if (name.includes('خضروات') || name.includes('خضراوات')) add('#228B22', 5)
  if (name.includes('جبنة') || name.includes('مارجريتا') || name.includes('موتزاريلا') || name.includes('كيري')) add('#FFD700', 5)
  if (name.includes('باربيكيو')) add('#FF6600', 4)
  if (name.includes('سوبريم') || name.includes('مشكل') || name.includes('ميكس')) {
    add('#8B2500', 2); add('#CC3333', 2); add('#228B22', 2); add('#FFD700', 2)
  }
  if (name.includes('روستو')) add('#A0522D', 4)
  if (all.length === 0) add('#FFD700', 4)

  const r = 0.9
  return all.map(c => {
    const angle = Math.random() * Math.PI * 1.2 - 0.1
    const radius = 0.15 + Math.random() * (r - 0.25)
    return { color: c, x: Math.cos(angle) * radius, z: Math.sin(angle) * radius, s: 0.04 + Math.random() * 0.05 }
  })
}

function PizzaSlice({ name }) {
  const group = useRef()
  const toppings = useMemo(() => ingredientConfig(name), [name])

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.5
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05
    }
  })

  const sliceShape = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.absarc(0, 0, 1.0, -0.1, Math.PI * 0.5 + 0.1, false)
    shape.lineTo(0, 0)
    return shape
  }, [])

  return (
    <group ref={group} rotation={[-0.6, 0.4, -0.2]}>
      {/* Crust rim */}
      <mesh position={[0, -0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <shapeGeometry args={[sliceShape]} />
        <meshStandardMaterial color="#D4A04A" roughness={0.85} side={THREE.DoubleSide} />
      </mesh>

      {/* Base */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <shapeGeometry args={[sliceShape]} />
        <meshStandardMaterial color="#E8B86D" roughness={0.8} side={THREE.DoubleSide} />
      </mesh>

      {/* Sauce */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <shapeGeometry args={[sliceShape]} />
        <meshStandardMaterial color="#CC3333" roughness={0.5} side={THREE.DoubleSide} transparent opacity={0.85} />
      </mesh>

      {/* Cheese */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <shapeGeometry args={[sliceShape]} />
        <meshStandardMaterial color="#FFD700" roughness={0.6} side={THREE.DoubleSide} transparent opacity={0.75} emissive="#FFD700" emissiveIntensity={0.05} />
      </mesh>

      {/* Toppings */}
      {toppings.map((t, i) => (
        <mesh key={i} position={[t.x, 0.03, t.z]}>
          <sphereGeometry args={[t.s, 8, 8]} />
          <meshStandardMaterial color={t.color} roughness={0.4} />
        </mesh>
      ))}

      {/* Glow */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <shapeGeometry args={[sliceShape]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.06} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

export default function PizzaPreview3D({ name }) {
  return (
    <div style={{ width: 120, height: 120, borderRadius: 16, overflow: 'hidden', background: 'rgba(6,6,18,0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,215,0,0.15)', boxShadow: '0 12px 48px rgba(0,0,0,0.5)' }}>
      <Canvas camera={{ position: [0, 0.5, 2.5], fov: 35 }} dpr={[1, 1.2]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 3]} intensity={1.5} />
        <directionalLight position={[-2, 1, -2]} intensity={0.4} />
        <PizzaSlice name={name} />
      </Canvas>
    </div>
  )
}
