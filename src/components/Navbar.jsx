import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { label: 'الرئيسية', href: '#hero' },
  { label: 'عننا', href: '#about' },
  { label: 'المنيو', href: '#menu' },
  { label: 'معرض الصور', href: '#gallery' },
  { label: 'اتصل بنا', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80)
      if (mobileOpen) setMobileOpen(false)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [mobileOpen])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: scrolled ? '12px 5%' : '20px 5%',
        background: scrolled
          ? 'rgba(6, 6, 18, 0.92)'
          : 'linear-gradient(180deg, rgba(6,6,18,0.6) 0%, transparent)',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.04)' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.4s ease',
      }}
    >
      <a
        href="#hero"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          textDecoration: 'none',
        }}
      >
        <img
          src="/logo.jpeg"
          alt="Sultan Pizza"
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: '2px solid var(--gold)',
            objectFit: 'cover',
          }}
        />
        <span style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          fontSize: '1.4rem',
          color: 'var(--gold)',
          letterSpacing: 1,
        }}>
          <span style={{ fontFamily: "'Cairo', sans-serif" }}>بيتزا</span>{' '}
          <span style={{ color: 'var(--red)' }}>السلطان</span>
        </span>
      </a>

      {/* Desktop Links */}
      <div style={{ display: 'flex', gap: 8 }}>
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            style={{
              color: 'var(--text-muted)',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
              padding: '8px 18px',
              borderRadius: 50,
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.color = 'var(--gold)'
              e.target.style.background = 'rgba(255,215,0,0.06)'
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'var(--text-muted)'
              e.target.style.background = 'transparent'
            }}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Mobile Hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          color: 'var(--gold)',
          fontSize: '1.8rem',
          cursor: 'pointer',
          padding: 4,
          zIndex: 110,
          position: 'relative',
        }}
        className="mobile-toggle"
      >
        <motion.div
          animate={mobileOpen ? { rotate: 90 } : { rotate: 0 }}
          transition={{ duration: 0.2 }}
        >
          {mobileOpen ? '✕' : '☰'}
        </motion.div>
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                zIndex: 90,
              }}
            />
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                top: 64,
                left: '5%',
                right: '5%',
                background: 'rgba(10, 10, 26, 0.97)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16,
                padding: '12px 8px',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                zIndex: 100,
                boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
              }}
            >
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ x: 4 }}
                  style={{
                    color: 'var(--text-muted)',
                    textDecoration: 'none',
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    padding: '14px 20px',
                    borderRadius: 12,
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255,215,0,0.06)'
                    e.target.style.color = 'var(--gold)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent'
                    e.target.style.color = 'var(--text-muted)'
                  }}
                >
                  <span style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--gold)',
                    opacity: 0.4,
                    flexShrink: 0,
                  }} />
                  {link.label}
                </motion.a>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          nav > div:first-of-type { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </motion.nav>
  )
}
