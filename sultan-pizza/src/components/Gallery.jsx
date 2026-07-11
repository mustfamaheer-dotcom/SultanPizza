import React from 'react'
import { motion } from 'framer-motion'

const images = [
  { src: '/pizza1.jpeg', label: 'بيتزا إيطالي', en: 'Italian Pizza' },
  { src: '/pizza2.jpeg', label: 'بيتزا السلطان', en: 'Sultan Pizza' },
  { src: '/pizza3.jpeg', label: 'شهية السلطان', en: 'Royal Taste' },
  { src: '/pizza4.jpeg', label: 'روعة التقديم', en: 'Gorgeous Presentation' },
  { src: '/pizza5.jpeg', label: 'نكهة السلاطين', en: 'Flavor of Sultans' },
  { src: '/pizza6.jpeg', label: 'مكونات طازجة', en: 'Fresh Ingredients' },
]

export default function Gallery() {
  return (
    <section id="gallery" className="section" style={{
      background: 'linear-gradient(180deg, var(--surface) 0%, var(--dark) 100%)',
    }}>
      <div className="section-header">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="gold">معرض صور المأكولات</span>
        </motion.h2>
        <motion.div
          className="section-ornament"
          initial={{ width: 0 }}
          whileInView={{ width: 60 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 20,
          maxWidth: 1300,
          margin: '0 auto',
        }}
      >
        {images.map((img, i) => (
          <motion.div
            key={img.src}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -8, scale: 1.02 }}
            style={{
              position: 'relative',
              borderRadius: 20,
              overflow: 'hidden',
              aspectRatio: '1',
              cursor: 'pointer',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            }}
          >
            <motion.img
              src={img.src}
              alt={img.label}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.6s ease',
              }}
              whileHover={{ scale: 1.1 }}
            />
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '40px 20px 20px',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                transition: 'opacity 0.3s ease',
              }}
            >
              <div style={{
                fontWeight: 700,
                fontSize: '1rem',
                color: 'var(--gold)',
              }}>
                {img.label}
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                marginTop: 2,
              }}>
                {img.en}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
