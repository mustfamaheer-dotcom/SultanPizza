import React from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  { number: '46+', label: 'نوع بيتزا', en: 'Pizza Varieties', icon: '🍕' },
  { number: '24', label: 'صنف إيطالي', en: 'Italian Recipes', icon: '🇮🇹' },
  { number: '22', label: 'صنف شرقي', en: 'Oriental Recipes', icon: '🌯' },
  { number: '100%', label: 'مكونات طازجة', en: 'Fresh Ingredients', icon: '🥗' },
]

function Counter({ value, label, en, icon, index }) {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!isInView) return
    const num = parseInt(value)
    if (isNaN(num)) { setCount(value); return }
    let start = 0
    const duration = 1500
    const step = Math.ceil(num / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= num) { setCount(num); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, value])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{
        textAlign: 'center',
        padding: '30px 20px',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.04)',
        transition: 'all 0.4s ease',
      }}
      whileHover={{
        y: -8,
        background: 'rgba(255,215,0,0.04)',
        borderColor: 'rgba(255,215,0,0.1)',
      }}
    >
      <div style={{ fontSize: '2rem', marginBottom: 8 }}>{icon}</div>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 'clamp(2.2rem, 4vw, 3rem)',
        fontWeight: 900,
        color: 'var(--gold)',
        lineHeight: 1.2,
      }}>
        {count}
      </div>
      <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)', marginTop: 4 }}>{label}</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: 2 }}>{en}</div>
    </motion.div>
  )
}

export default function Stats() {
  return (
    <section style={{
      position: 'relative',
      zIndex: 1,
      padding: '60px 5%',
      background: 'linear-gradient(180deg, var(--surface) 0%, var(--dark) 100%)',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 20,
        maxWidth: 1100,
        margin: '0 auto',
      }}>
        {stats.map((stat, i) => (
          <Counter key={i} {...stat} index={i} />
        ))}
      </div>
    </section>
  )
}
