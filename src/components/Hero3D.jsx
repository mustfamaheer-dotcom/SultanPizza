import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment, Text } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'

function StarField() {
  const ref = useRef()
  const positions = useMemo(() => {
    const arr = new Float32Array(500 * 3)
    for (let i = 0; i < 500; i++) {
      const r = 8 + Math.random() * 20, theta = Math.random() * Math.PI * 2, phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = Math.sin(phi) * Math.cos(theta) * r
      arr[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r * 0.3
      arr[i * 3 + 2] = Math.cos(phi) * r
    }
    return arr
  }, [])
  useFrame((s, d) => { if (ref.current) ref.current.rotation.y += d * 0.008 })
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" count={500} array={positions} itemSize={3} /></bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.04} transparent opacity={0.4} sizeAttenuation />
    </points>
  )
}

function Pizza() {
  const group = useRef()
  const cheeseMat = useRef()
  const pp = useMemo(() => [
    [0.5, 0.5], [-0.5, 0.5], [0.5, -0.5], [-0.5, -0.5], [1.0, 0.0], [-1.0, 0.0],
    [0.0, 1.0], [0.0, -1.0], [0.7, -0.7], [-0.7, 0.7], [1.2, 0.6], [-1.2, -0.6],
    [0.3, 1.2], [-0.3, -1.2], [0.9, -0.3], [-0.9, 0.3],
  ], [])
  const herbs = useMemo(() => {
    const p = []
    for (let i = 0; i < 60; i++) { const a = Math.random() * Math.PI * 2; const r = Math.random() * 1.6; p.push([Math.cos(a) * r, Math.sin(a) * r]) }
    return p
  }, [])

  useFrame((state, delta) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    group.current.rotation.y += delta * 0.25
    group.current.position.y = Math.sin(t * 0.4) * 0.12
    if (cheeseMat.current) cheeseMat.current.emissiveIntensity = 0.15 + Math.sin(t * 0.8) * 0.1
  })

  return (
    <group ref={group}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}><torusGeometry args={[2.2, 0.4, 32, 64]} /><meshStandardMaterial color="#D4A04A" roughness={0.85} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}><circleGeometry args={[2.0, 64]} /><meshStandardMaterial color="#E8B86D" roughness={0.8} side={THREE.DoubleSide} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}><circleGeometry args={[1.85, 64]} /><meshStandardMaterial color="#CC3333" roughness={0.5} side={THREE.DoubleSide} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <circleGeometry args={[1.75, 64]} />
        <meshStandardMaterial ref={cheeseMat} color="#FFD700" roughness={0.6} side={THREE.DoubleSide} transparent opacity={0.88}
          emissive="#FFD700" emissiveIntensity={0.2} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}><ringGeometry args={[1.8, 2.8, 48]} /><meshBasicMaterial color="#FFD700" transparent opacity={0.06} side={THREE.DoubleSide} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}><ringGeometry args={[2.5, 3.0, 48]} /><meshBasicMaterial color="#FF8C00" transparent opacity={0.03} side={THREE.DoubleSide} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.055, 0]}>
        <shapeGeometry args={[(() => { const s = new THREE.Shape(); s.moveTo(0, 0); s.absarc(0, 0, 2.2, 0.2, 0.7, false); s.lineTo(0, 0); return s })()]} />
        <meshBasicMaterial color="#0a0a1a" side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {pp.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.07, z]} rotation={[Math.random() * Math.PI, 0, Math.random() * Math.PI]}>
          <cylinderGeometry args={[0.25, 0.25, 0.05, 16]} /><meshStandardMaterial color="#8B2500" roughness={0.35} />
        </mesh>
      ))}
      {herbs.map(([x, z], i) => (
        <mesh key={`h${i}`} position={[x, 0.08, z]}><sphereGeometry args={[0.04, 6, 6]} /><meshStandardMaterial color={Math.random() > 0.5 ? '#228B22' : '#32CD32'} roughness={0.7} /></mesh>
      ))}
    </group>
  )
}

function FloatingRings() {
  const refs = useRef([])
  const colors = ['#FFD700', '#FF8C00', '#FFD700', '#FF6347', '#FFD700']
  useFrame((state) => {
    const t = state.clock.elapsedTime
    refs.current.forEach((ref, i) => {
      if (ref) {
        ref.scale.setScalar(1 + Math.sin(t * 0.4 + i * 1.2) * 0.08)
        ref.material.opacity = 0.08 + Math.sin(t * 0.5 + i * 1.5) * 0.04
        ref.rotation.z += 0.003 * (i % 2 === 0 ? 1 : -1)
        ref.position.y = -0.3 + Math.sin(t * 0.3 + i) * 0.15
      }
    })
  })
  return Array.from({ length: 5 }, (_, i) => (
    <mesh key={i} ref={(el) => (refs.current[i] = el)}
      rotation={[Math.PI / 2 + 0.15 * (i % 2 === 0 ? 1 : -1), 0, 0]} position={[0, -0.3, 0]}>
      <torusGeometry args={[2.4 + i * 0.45, 0.025, 8, 48]} />
      <meshBasicMaterial color={colors[i]} transparent opacity={0.15} depthWrite={false} />
    </mesh>
  ))
}

function Particles() {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y += 0.0008
  })
  const positions = useMemo(() => {
    const arr = new Float32Array(200 * 3)
    for (let i = 0; i < 200; i++) {
      const theta = Math.random() * Math.PI * 2, phi = Math.random() * Math.PI * 2, r = 3 + Math.random() * 5
      arr[i * 3] = Math.sin(theta) * Math.cos(phi) * r
      arr[i * 3 + 1] = (Math.random() - 0.5) * 5
      arr[i * 3 + 2] = Math.sin(theta) * Math.sin(phi) * r
    }
    return arr
  }, [])
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" count={200} array={positions} itemSize={3} /></bufferGeometry>
      <pointsMaterial color="#FFD700" size={0.04} transparent opacity={0.4} blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  )
}

function FloatingLabels() {
  const ref = useRef()
  useFrame((state) => { if (ref.current) ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15 })
  return (
    <group ref={ref} position={[0, 2.8, 0]}>
      <Text fontSize={0.2} color="#FFD700" anchorX="center" anchorY="middle" transparent opacity={0.3}>✦ PREMIUM PIZZA ✦</Text>
    </group>
  )
}

function Scene() {
  return (
    <>
      <color attach="background" args={['#060612']} />
      <fog attach="fog" args={['#060612', 12, 25]} />
      <StarField />
      <ambientLight intensity={0.3} color="#404060" />
      <directionalLight position={[6, 10, 6]} intensity={2} color="#ffeedd" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <directionalLight position={[-4, 2, -4]} intensity={0.5} color="#4488ff" />
      <directionalLight position={[-3, 4, -6]} intensity={0.7} color="#ff8844" />
      <pointLight position={[0, -2, -5]} intensity={0.4} color="#ff4400" distance={10} />
      <pointLight position={[0, 3, 3]} intensity={0.3} color="#FFD700" distance={8} />
      <Environment preset="night" />
      <Float speed={0.3} rotationIntensity={0.02} floatIntensity={0.1}>
        <Pizza />
      </Float>
      <Particles />
      <FloatingRings />
      <FloatingLabels />
    </>
  )
}

export default function Hero3D() {
  return (
    <section id="hero" style={{ position: 'relative', height: '100vh', width: '100%' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <Canvas camera={{ position: [0, 0.8, 7.5], fov: 40 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }} shadows>
          <Scene />
        </Canvas>
      </div>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.02,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(6,6,18,0.6) 100%)' }} />
      <div style={{
        position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 5%',
        background: 'linear-gradient(180deg, rgba(6,6,18,0.15) 0%, rgba(6,6,18,0.5) 50%, rgba(6,6,18,0.8) 100%)',
      }}>
        <motion.img src="/logo.jpeg" alt="Sultan Pizza"
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, type: 'spring', stiffness: 100, damping: 12 }}
          whileHover={{ scale: 1.06, rotate: 5 }}
          style={{ width: 120, height: 120, borderRadius: '50%', border: '3px solid var(--gold)', boxShadow: '0 0 80px rgba(255,215,0,0.2)', objectFit: 'cover', marginBottom: 16, cursor: 'pointer' }} />
        <motion.h1 initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.8rem, 8vw, 6.5rem)', fontWeight: 900, lineHeight: 1.05 }}>
          <motion.span className="gradient-text"
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          >Sultan</motion.span>{' '}
          <span style={{ color: 'var(--red)', textShadow: '0 0 40px rgba(196,30,58,0.3)' }}>Pizza</span>
        </motion.h1>
        <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.8rem)', fontWeight: 700, marginTop: 4, color: 'rgba(255,255,255,0.9)', letterSpacing: 2 }}>
          بيتزا السلطان
        </motion.div>
        <motion.p initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
          style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)', marginTop: 14, letterSpacing: 1.5, fontWeight: 300 }}>
          تذوق الفخامة .. مذاق السلاطين
        </motion.p>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.9, ease: 'easeOut' }}
          style={{ marginTop: 40, display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <motion.a href="#menu" className="btn btn-primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            اطلع على المنيو
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </motion.a>
          <motion.a href="#contact" className="btn btn-outline" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>تواصل معنا</motion.a>
        </motion.div>
        <motion.a href="#about" initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ opacity: { delay: 1.4 }, y: { repeat: Infinity, duration: 2, ease: 'easeInOut' } }}
          style={{ position: 'absolute', bottom: 30, color: 'var(--gold)', fontSize: '1.6rem', textDecoration: 'none', cursor: 'pointer', opacity: 0.6 }}>⌄</motion.a>
      </div>
    </section>
  )
}
