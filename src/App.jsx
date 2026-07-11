import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Hero3D from './components/Hero3D'
import About from './components/About'
import Menu from './components/Menu'
import Gallery from './components/Gallery'
import Contact from './components/Contact'
import Stats from './components/Stats'
import BackToTop from './components/BackToTop'
import StickyBar from './components/StickyBar'
import CartSidebar from './components/CartSidebar'

export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <CartProvider>
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loader" exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'var(--darker)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
              style={{ width: 80, height: 80, borderRadius: '50%', border: '4px solid rgba(255,215,0,0.1)', borderTopColor: 'var(--gold)' }} />
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              style={{ marginTop: 28, fontSize: '1.2rem', color: 'var(--gold)', fontWeight: 600, fontFamily: "'Cairo', sans-serif" }}>
              Sultan Pizza ... يتم التحميل
            </motion.p>
          </motion.div>
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Navbar />
            <Hero3D />
            <About />
            <Stats />
            <Menu />
            <Gallery />
            <Contact />
            <footer style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '30px 20px', color: 'var(--text-dim)', fontSize: '0.9rem', background: 'var(--darker)', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
              © 2026 بيتزا السلطان | Sultan Pizza — جميع الحقوق محفوظة
            </footer>
            <BackToTop />
            <StickyBar />
            <CartSidebar />
          </motion.div>
        )}
      </AnimatePresence>
    </CartProvider>
  )
}
