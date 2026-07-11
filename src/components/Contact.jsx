import React from 'react'
import { motion } from 'framer-motion'

export default function Contact() {
  return (
    <section id="contact" className="section" style={{ background: 'linear-gradient(180deg, var(--dark) 0%, var(--darker) 100%)', paddingBottom: 60 }}>
      <div className="section-header">
        <motion.h2 className="section-title" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <span className="gold">تواصل</span> <span style={{ color: 'var(--text-muted)', opacity: 0.3 }}>|</span> <span className="red">Contact</span>
        </motion.h2>
        <motion.div className="section-ornament" initial={{ width: 0 }} whileInView={{ width: 60 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }} />
      </div>
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 30, padding: '50px 40px', textAlign: 'center', backdropFilter: 'blur(20px)' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
            style={{ width: 60, height: 60, margin: '0 auto 25px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold), #FF8C00)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', boxShadow: '0 0 40px rgba(255,215,0,0.2)' }}>
            🍕
          </motion.div>
          <div style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 2.2, marginBottom: 30 }}>
            <div>📍 القاهرة، مصر</div>
            <div>📞 <a href="tel:+201129115112" style={{ color: 'var(--gold)', textDecoration: 'none' }}>+20 112 911 5112</a></div>
            <div>🟢 واتساب: <a href="https://wa.me/201129115112" style={{ color: 'var(--gold)', textDecoration: 'none' }}>+20 112 911 5112</a></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            <motion.a href="https://wa.me/201129115112" target="_blank" rel="noopener noreferrer"
              whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '16px 44px', borderRadius: 60, background: 'linear-gradient(135deg, #25D366, #128C7E)', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '1.1rem', fontFamily: "'Cairo', sans-serif", boxShadow: '0 10px 40px rgba(37,211,102,0.3)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              واتساب | WhatsApp
            </motion.a>
            <motion.a href="https://www.facebook.com/share/18viPaUhgZ/" target="_blank" rel="noopener noreferrer"
              whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '16px 44px', borderRadius: 60, background: 'linear-gradient(135deg, #1877F2, #0C5BC6)', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '1.1rem', fontFamily: "'Cairo', sans-serif", boxShadow: '0 10px 40px rgba(24,119,242,0.3)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Sultan Pizza على فيسبوك
            </motion.a>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
