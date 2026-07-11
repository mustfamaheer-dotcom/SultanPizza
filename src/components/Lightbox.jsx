import React, { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Lightbox({ images, index, onClose }) {
  const [current, setCurrent] = React.useState(index)

  const prev = useCallback(() => setCurrent(i => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setCurrent(i => (i + 1) % images.length), [images.length])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, prev, next])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(0,0,0,0.92)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(10px)',
        }}
      >
        <button onClick={onClose}
          style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer', zIndex: 10 }}>
          ✕
        </button>

        <button onClick={(e) => { e.stopPropagation(); prev() }}
          style={{ position: 'absolute', left: 20, background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer', width: 50, height: 50, borderRadius: '50%', zIndex: 10 }}>
          ‹
        </button>

        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          style={{ maxWidth: '90vw', maxHeight: '85vh', textAlign: 'center' }}
        >
          <img src={images[current].src} alt={images[current].label}
            style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: 16, objectFit: 'contain' }} />
          <div style={{ marginTop: 16 }}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--gold)' }}>{images[current].label}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4 }}>{images[current].en}</div>
          </div>
        </motion.div>

        <button onClick={(e) => { e.stopPropagation(); next() }}
          style={{ position: 'absolute', right: 20, background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer', width: 50, height: 50, borderRadius: '50%', zIndex: 10 }}>
          ›
        </button>

        <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
          {images.map((_, i) => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: '50%',
              background: i === current ? 'var(--gold)' : 'rgba(255,255,255,0.2)',
              transition: 'all 0.3s ease',
            }} />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
