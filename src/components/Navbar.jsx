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
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: scrolled ? '12px 5%' : '20px 5%',
        background: scrolled ? 'rgba(6, 6, 18, 0.92)' : 'linear-gradient(180deg, rgba(6,6,18,0.6) 0%, transparent)',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.04)' : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 0.4s ease',
      }}
    >
      <a href="#hero" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <img src="/logo.jpeg" alt="Sultan Pizza" style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid var(--gold)', objectFit: 'cover' }} />
        <span style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: '1.3rem', color: 'var(--gold)' }}>
          بيتزا <span style={{ color: 'var(--red)' }}>السلطان</span>
        </span>
      </a>

      <div style={{ display: 'flex', gap: 8 }}>
        {links.map((link) => (
          <a key={link.href} href={link.href}
            style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, padding: '8px 18px', borderRadius: 50, transition: 'all 0.3s ease' }}
            onMouseEnter={(e) => { e.target.style.color = 'var(--gold)'; e.target.style.background = 'rgba(255,215,0,0.06)' }}
            onMouseLeave={(e) => { e.target.style.color = 'var(--text-muted)'; e.target.style.background = 'transparent' }}
          >{link.label}</a>
        ))}
      </div>

      <button onClick={() => setMobileOpen(!mobileOpen)}
        style={{ display: 'none', background: 'none', border: 'none', color: 'var(--gold)', fontSize: '1.8rem', cursor: 'pointer', padding: 4 }}
        className="mobile-toggle"
      >{mobileOpen ? '✕' : '☰'}</button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed', top: 70, left: 0, right: 0, background: 'rgba(6, 6, 18, 0.98)',
              backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)',
              padding: '20px 5%', display: 'flex', flexDirection: 'column', gap: 8,
            }}
          >
            {links.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 600, padding: '14px 20px', borderRadius: 12 }}
              >{link.label}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@media (max-width: 768px) { nav > div:first-of-type { display: none !important; } .mobile-toggle { display: block !important; } }`}</style>
    </motion.nav>
  )
}
