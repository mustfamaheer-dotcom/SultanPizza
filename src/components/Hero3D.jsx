import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Environment, Text } from '@react-three/drei'
// Custom glow via emissive + additive blending (no postprocessing needed)
import * as THREE from 'three'
import { motion } from 'framer-motion'

// ─── Floating ingredient (basil, pepperoni, cheese cube) ───
function FloatingIngredient({ position, color, shape = 'box', size = 0.12, speed = 0.5, offset = 0 }) {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime * speed + offset
    ref.current.position.y += Math.sin(t * 2) * 0.001
    ref.current.rotation.x = Math.sin(t) * 0.3
    ref.current.rotation.y += 0.01
  })

  let geo
  if (shape === 'sphere') geo = <sphereGeometry args={[size, 12, 12]} />
  else if (shape === 'torus') geo = <torusGeometry args={[size, size * 0.3, 8, 16]} />
  else geo = <boxGeometry args={[size, size * 0.3, size]} />

  return (
    <mesh ref={ref} position={position} castShadow>
      {geo}
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
    </mesh>
  )
}

// ─── Steam / heat rising particles ───
function SteamParticles({ count = 60 }) {
  const ref = useRef()
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * 1.6
      arr[i * 3] = Math.cos(angle) * radius
      arr[i * 3 + 1] = Math.random() * 0.05
      arr[i * 3 + 2] = Math.sin(angle) * radius
    }
    return arr
  }, [count])

  const velocities = useMemo(() => {
    return Array.from({ length: count }, () => 0.002 + Math.random() * 0.006)
  }, [count])

  const life = useRef(new Float32Array(count).fill(1))

  useFrame((state, delta) => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position.array
    const sizes = ref.current.geometry.attributes.size.array
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += velocities[i] * delta * 30
      life.current[i] -= delta * 0.15
      // wobble
      pos[i * 3] += Math.sin(state.clock.elapsedTime + i) * 0.001
      pos[i * 3 + 2] += Math.cos(state.clock.elapsedTime + i) * 0.001

      if (life.current[i] <= 0 || pos[i * 3 + 1] > 2.5) {
        const angle = Math.random() * Math.PI * 2
        const radius = Math.random() * 1.6
        pos[i * 3] = Math.cos(angle) * radius
        pos[i * 3 + 1] = 0.05
        pos[i * 3 + 2] = Math.sin(angle) * radius
        life.current[i] = 0.5 + Math.random() * 0.5
      }
      sizes[i] = life.current[i] * 0.08
    }
    ref.current.geometry.attributes.position.needsUpdate = true
    ref.current.geometry.attributes.size.needsUpdate = true
  })

  const sizes = useMemo(() => new Float32Array(count).fill(0.08), [count])

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        color="#ffeecc"
        size={0.08}
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

// ─── Gold sparkle particles (follow mouse) ───
function GoldSparkles({ mouse }) {
  const ref = useRef()
  const count = 120
  const basePositions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI * 2
      const r = 1.5 + Math.random() * 4
      arr[i * 3] = Math.sin(theta) * Math.cos(phi) * r
      arr[i * 3 + 1] = (Math.random() - 0.5) * 3
      arr[i * 3 + 2] = Math.sin(theta) * Math.sin(phi) * r
    }
    return arr
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position.array
    const base = basePositions
    const tx = mouse.current.x * 1.5
    const ty = mouse.current.y * 1.5
    for (let i = 0; i < count; i++) {
      pos[i * 3] = base[i * 3] + tx * 0.8
      pos[i * 3 + 1] = base[i * 3 + 1] + ty * 0.5
      pos[i * 3 + 2] = base[i * 3 + 2]
    }
    ref.current.geometry.attributes.position.needsUpdate = true
    ref.current.rotation.y += 0.001
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={basePositions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        color="#FFD700"
        size={0.035}
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}

// ─── Background starfield ───
function StarField() {
  const ref = useRef()
  const count = 500
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 8 + Math.random() * 20
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = Math.sin(phi) * Math.cos(theta) * r
      arr[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r * 0.3
      arr[i * 3 + 2] = Math.cos(phi) * r
    }
    return arr
  }, [])

  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.008
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.04} transparent opacity={0.4} sizeAttenuation />
    </points>
  )
}

// ─── The Pizza ───
function Pizza({ scrollY, mouse }) {
  const group = useRef()
  const cheeseMat = useRef()
  const pepperoniPositions = useMemo(() => [
    [0.5, 0.5], [-0.5, 0.5], [0.5, -0.5], [-0.5, -0.5],
    [1.0, 0.0], [-1.0, 0.0], [0.0, 1.0], [0.0, -1.0],
    [0.7, -0.7], [-0.7, 0.7], [1.2, 0.6], [-1.2, -0.6],
    [0.3, 1.2], [-0.3, -1.2], [0.9, -0.3], [-0.9, 0.3],
  ], [])

  const herbPositions = useMemo(() => {
    const pos = []
    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * 1.6
      pos.push([Math.cos(angle) * radius, Math.sin(angle) * radius])
    }
    return pos
  }, [])

  // Melting cheese drips geometry
  const dripPositions = useMemo(() => {
    const arr = []
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 1.3 + Math.random() * 0.6
      arr.push([Math.cos(angle) * radius, Math.sin(angle) * radius])
    }
    return arr
  }, [])

  useFrame((state, delta) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    const scrollFactor = scrollY.current * 0.0003

    // Smooth mouse-driven tilt
    const targetX = mouse.current.y * 0.15 + scrollFactor
    const targetZ = mouse.current.x * 0.1
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.03
    group.current.rotation.z += (targetZ - group.current.rotation.z) * 0.03

    // Auto rotation
    group.current.rotation.y += delta * 0.25

    // Gentle float
    group.current.position.y = Math.sin(t * 0.4) * 0.12

    // Pulsing cheese emissive
    if (cheeseMat.current) {
      cheeseMat.current.emissiveIntensity = 0.15 + Math.sin(t * 0.8) * 0.1
    }
  })

  return (
    <group ref={group}>
      {/* Crust */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} castShadow>
        <torusGeometry args={[2.2, 0.4, 32, 64]} />
        <meshStandardMaterial color="#D4A04A" roughness={0.85} metalness={0.02} />
      </mesh>

      {/* Base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[2.0, 64]} />
        <meshStandardMaterial color="#E8B86D" roughness={0.8} metalness={0} side={THREE.DoubleSide} />
      </mesh>

      {/* Sauce */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[1.85, 64]} />
        <meshStandardMaterial color="#CC3333" roughness={0.5} metalness={0} side={THREE.DoubleSide} />
      </mesh>

      {/* Cheese (with pulsing emissive) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <circleGeometry args={[1.75, 64]} />
        <meshStandardMaterial
          ref={cheeseMat}
          color="#FFD700"
          roughness={0.6}
          metalness={0.05}
          side={THREE.DoubleSide}
          transparent
          opacity={0.88}
          emissive="#FFD700"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Cheese drips */}
      {dripPositions.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.02, z]} rotation={[Math.random() * 0.3, 0, Math.random() * 0.3]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#FFD700" roughness={0.6} emissive="#FFD700" emissiveIntensity={0.05} />
        </mesh>
      ))}

      {/* Glow halo behind pizza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <ringGeometry args={[1.8, 2.8, 48]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.06} side={THREE.DoubleSide} />
      </mesh>

      {/* Outer glow ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
        <ringGeometry args={[2.5, 3.0, 48]} />
        <meshBasicMaterial color="#FF8C00" transparent opacity={0.03} side={THREE.DoubleSide} />
      </mesh>

      {/* Missing slice */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.055, 0]}>
        <shapeGeometry args={[(() => {
          const shape = new THREE.Shape()
          shape.moveTo(0, 0)
          shape.absarc(0, 0, 2.2, 0.2, 0.7, false)
          shape.lineTo(0, 0)
          return shape
        })()]} />
        <meshBasicMaterial color="#0a0a1a" side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      {/* Pepperoni */}
      {pepperoniPositions.map(([x, z], i) => (
        <mesh
          key={i}
          position={[x, 0.07, z]}
          rotation={[Math.random() * Math.PI, 0, Math.random() * Math.PI]}
          castShadow
        >
          <cylinderGeometry args={[0.25, 0.25, 0.05, 16]} />
          <meshStandardMaterial color="#8B2500" roughness={0.35} metalness={0.05} />
        </mesh>
      ))}

      {/* Herbs */}
      {herbPositions.map(([x, z], i) => (
        <mesh key={`h${i}`} position={[x, 0.08, z]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshStandardMaterial color={Math.random() > 0.5 ? '#228B22' : '#32CD32'} roughness={0.7} />
        </mesh>
      ))}

      {/* Spice dust on pizza */}
      <points position={[0, 0.09, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={80}
            array={(() => {
              const arr = new Float32Array(80 * 3)
              for (let i = 0; i < 80; i++) {
                const angle = Math.random() * Math.PI * 2
                const radius = 0.3 + Math.random() * 1.8
                arr[i * 3] = Math.cos(angle) * radius
                arr[i * 3 + 1] = 0
                arr[i * 3 + 2] = Math.sin(angle) * radius
              }
              return arr
            })()}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial color="#CC3333" size={0.025} transparent opacity={0.35} sizeAttenuation />
      </points>
    </group>
  )
}

// ─── Floating golden rings ───
function FloatingRings() {
  const refs = useRef([])
  const colors = ['#FFD700', '#FF8C00', '#FFD700', '#FF6347', '#FFD700']

  useFrame((state) => {
    const t = state.clock.elapsedTime
    refs.current.forEach((ref, i) => {
      if (ref) {
        const s = 1 + Math.sin(t * 0.4 + i * 1.2) * 0.08
        ref.scale.setScalar(s)
        ref.material.opacity = 0.08 + Math.sin(t * 0.5 + i * 1.5) * 0.04
        ref.rotation.z += 0.003 * (i % 2 === 0 ? 1 : -1)
        ref.position.y = -0.3 + Math.sin(t * 0.3 + i) * 0.15
      }
    })
  })

  return Array.from({ length: 5 }, (_, i) => (
    <mesh
      key={i}
      ref={(el) => (refs.current[i] = el)}
      rotation={[Math.PI / 2 + 0.15 * (i % 2 === 0 ? 1 : -1), 0, 0]}
      position={[0, -0.3, 0]}
    >
      <torusGeometry args={[2.4 + i * 0.45, 0.025, 8, 48]} />
      <meshBasicMaterial color={colors[i]} transparent opacity={0.15} depthWrite={false} />
    </mesh>
  ))
}

// ─── Orbiting ingredients ───
function OrbitingIngredients() {
  const group = useRef()
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const items = useMemo(() => {
    const configs = []
    const types = [
      { shape: 'sphere', color: '#228B22', size: 0.1 },   // basil
      { shape: 'torus', color: '#8B2500', size: 0.1 },    // pepperoni ring
      { shape: 'box', color: '#FFD700', size: 0.08 },     // cheese cube
    ]
    const baseRadius = isMobile ? 2 : 3
    for (let i = 0; i < 15; i++) {
      const t = types[i % types.length]
      configs.push({
        ...t,
        angle: (i / 15) * Math.PI * 2,
        radius: baseRadius + Math.random() * (isMobile ? 0.8 : 1.5),
        height: (Math.random() - 0.5) * (isMobile ? 1.2 : 2),
        speed: 0.2 + Math.random() * 0.3,
      })
    }
    return configs
  }, [])

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    items.forEach((item, i) => {
      const child = group.current.children[i]
      if (child) {
        const angle = item.angle + t * item.speed
        child.position.x = Math.cos(angle) * item.radius
        child.position.z = Math.sin(angle) * item.radius
        child.position.y = item.height + Math.sin(t * 0.5 + i) * 0.2
        child.rotation.x = Math.sin(t + i) * 0.5
        child.rotation.y += 0.02
      }
    })
  })

  return (
    <group ref={group}>
      {items.map((item, i) => {
        let geo
        if (item.shape === 'sphere') geo = <sphereGeometry args={[item.size, 8, 8]} />
        else if (item.shape === 'torus') geo = <torusGeometry args={[item.size, item.size * 0.3, 6, 12]} />
        else geo = <boxGeometry args={[item.size, item.size * 0.3, item.size]} />
        return (
          <mesh key={i} castShadow>
            {geo}
            <meshStandardMaterial color={item.color} roughness={0.3} metalness={0.1} />
          </mesh>
        )
      })}
    </group>
  )
}

// ─── Scene content ───
function Scene({ scrollY, mouse }) {
  return (
    <>
      {/* Background */}
      <color attach="background" args={['#060612']} />
      <fog attach="fog" args={['#060612', 12, 25]} />

      {/* Stars */}
      <StarField />

      {/* Lighting */}
      <ambientLight intensity={0.3} color="#404060" />

      <directionalLight
        position={[6, 10, 6]}
        intensity={2}
        color="#ffeedd"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-4, 2, -4]} intensity={0.5} color="#4488ff" />
      <directionalLight position={[-3, 4, -6]} intensity={0.7} color="#ff8844" />
      <pointLight position={[0, -2, -5]} intensity={0.4} color="#ff4400" distance={10} />
      <pointLight position={[0, 3, 3]} intensity={0.3} color="#FFD700" distance={8} />

      {/* Environment */}
      <Environment preset="night" />

      {/* Main pizza */}
      <Float speed={0.3} rotationIntensity={0.02} floatIntensity={0.1}>
        <Pizza scrollY={scrollY} mouse={mouse} />
      </Float>

      {/* Steam */}
      <SteamParticles count={80} />

      {/* Orbiting ingredients */}
      <OrbitingIngredients />

      {/* Rings */}
      <FloatingRings />

      {/* Gold sparkles */}
      <GoldSparkles mouse={mouse} />

      {/* Glow is achieved via emissive materials and additive blending on particles/rings */}
    </>
  )
}

// ─── Hero wrapper ───
export default function Hero3D() {
  const scrollY = useRef(0)
  const mouse = useRef({ x: 0, y: 0 })
  const [viewport, setViewport] = React.useState({
    isSmall: window.innerWidth <= 430,
    isMobile: window.innerWidth < 768,
  })

  React.useEffect(() => {
    const onScroll = () => { scrollY.current = window.scrollY }
    const onMouse = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    const onResize = () => setViewport({
      isSmall: window.innerWidth <= 430,
      isMobile: window.innerWidth < 768,
    })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMouse, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <section id="hero" style={{ position: 'relative', height: '100vh', width: '100%' }}>
      {/* 3D Canvas */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <Canvas
          camera={{
            position: viewport.isSmall ? [0, 0.8, 9] : viewport.isMobile ? [0, 0.8, 8] : [0, 0.8, 7.5],
            fov: 40,
          }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
          }}
          shadows
        >
          <Scene scrollY={scrollY} mouse={mouse} />
        </Canvas>
      </div>

      {/* Noise overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.02,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette gradient */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(6,6,18,0.6) 100%)',
        }}
      />

      {/* Hero Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 5%',
          background: 'linear-gradient(180deg, rgba(6,6,18,0.15) 0%, rgba(6,6,18,0.5) 50%, rgba(6,6,18,0.8) 100%)',
        }}
      >
        <motion.img
          src="/logo.jpeg"
          alt="Sultan Pizza"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, type: 'spring', stiffness: 100, damping: 12 }}
          whileHover={{ scale: 1.06, rotate: 5 }}
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            border: '3px solid var(--gold)',
            boxShadow: '0 0 80px rgba(255,215,0,0.2), 0 0 20px rgba(255,215,0,0.1)',
            objectFit: 'cover',
            marginBottom: 16,
            cursor: 'pointer',
          }}
        />

        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2.8rem, 8vw, 6.5rem)',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: 1,
          }}
        >
          <motion.span
            className="gradient-text"
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            style={{
              background: 'linear-gradient(135deg, var(--gold), #FF8C00, var(--gold), #FFD700)',
              backgroundSize: '300% 300%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Sultan
          </motion.span>{' '}
          <span style={{ color: 'var(--red)', textShadow: '0 0 40px rgba(196,30,58,0.3)' }}>Pizza</span>
        </motion.h1>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          style={{
            fontSize: 'clamp(1.4rem, 3.5vw, 2.8rem)',
            fontWeight: 700,
            marginTop: 4,
            color: 'rgba(255,255,255,0.9)',
            textShadow: '0 0 40px rgba(255,255,255,0.08)',
            letterSpacing: 2,
          }}
        >
          بيتزا السلطان
        </motion.div>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
          style={{
            color: 'var(--text-muted)',
            fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)',
            marginTop: 14,
            maxWidth: 480,
            letterSpacing: 1.5,
            fontWeight: 300,
          }}
        >
          تذوق الفخامة .. مذاق السلاطين
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9, ease: 'easeOut' }}
          style={{ marginTop: 40, display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <motion.a
            href="#menu"
            className="btn btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            اطلع على المنيو
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.a>
          <motion.a
            href="#contact"
            className="btn btn-outline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            تواصل معنا
          </motion.a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.a
          href="#about"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            y: [0, 10, 0],
          }}
          transition={{
            opacity: { delay: 1.4 },
            y: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
          }}
          style={{
            position: 'absolute',
            bottom: 30,
            color: 'var(--gold)',
            fontSize: '1.6rem',
            textDecoration: 'none',
            cursor: 'pointer',
            opacity: 0.6,
          }}
        >
          ⌄
        </motion.a>
      </div>
    </section>
  )
}
