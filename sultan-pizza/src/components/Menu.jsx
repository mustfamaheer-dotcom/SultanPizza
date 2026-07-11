import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { menuData } from '../data/menu'

const tabs = [
  { id: 'all', label: 'الكل', en: 'All' },
  { id: 'italian', label: 'إيطالي', en: 'Italian' },
  { id: 'oriental', label: 'شرقي', en: 'Oriental' },
]

const foodIcons = {
  لحمة: '🥩', سجق: '🌭', سوسيس: '🌭', بسطرمة: '🥓', تونة: '🐟',
  جبنة: '🧀', مشرووم: '🍄', بولوبيف: '🥩', سلامي: '🥩', فراخ: '🍗',
  خضروات: '🥬', مارجريتا: '🧀', كيري: '🧀', برجر: '🍔', باربيكيو: '🔥',
  روستو: '🥩', سوبريم: '⭐', ميكس: '🔄', موتزاريلا: '🧀',
}

function getIcon(name) {
  for (const [key, icon] of Object.entries(foodIcons)) {
    if (name.includes(key)) return icon
  }
  return '🍕'
}

const MenuItem = React.forwardRef(({ item, index }, ref) => {
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      whileHover={{ y: -6 }}
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 20,
        padding: 0,
        cursor: 'default',
        overflow: 'hidden',
        transition: 'all 0.4s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
        e.currentTarget.style.borderColor = 'rgba(255,215,0,0.2)'
        e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Top accent bar */}
      <div style={{
        height: 3,
        background: item.cat === 'italian'
          ? 'linear-gradient(90deg, var(--red), transparent)'
          : 'linear-gradient(90deg, var(--gold), transparent)',
      }} />

      <div style={{ padding: '22px 24px 20px' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '1.6rem' }}>{getIcon(item.name)}</span>
            <div>
              <div style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                color: 'var(--text)',
                marginBottom: 1,
              }}>
                {item.name}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-dim)',
                fontWeight: 400,
                direction: 'ltr',
                textAlign: 'left',
              }}>
                {item.en}
              </div>
            </div>
          </div>
          <span style={{
            fontSize: '0.6rem',
            padding: '4px 14px',
            borderRadius: 20,
            background: item.cat === 'italian'
              ? 'rgba(196,30,58,0.15)'
              : 'rgba(255,215,0,0.12)',
            color: item.cat === 'italian' ? 'var(--red)' : 'var(--gold)',
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}>
            {item.cat === 'italian' ? 'إيطالي' : 'شرقي'}
          </span>
        </div>

        {/* Prices */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 8,
          marginTop: 16,
          padding: '12px 0 0',
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}>
          {[
            { size: 'صغير', en: 'S', key: 'small' },
            { size: 'وسط', en: 'M', key: 'medium' },
            { size: 'كبير', en: 'L', key: 'large' },
            { size: 'عائلي', en: 'F', key: 'family' },
          ].map((s) => (
            <div key={s.key} style={{
              textAlign: 'center',
              padding: '6px 4px',
              borderRadius: 10,
              background: 'rgba(255,255,255,0.02)',
              transition: 'background 0.3s ease',
            }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,215,0,0.06)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
            >
              <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 600, marginBottom: 2 }}>
                {s.size}
              </div>
              <div style={{
                fontSize: '1.2rem',
                fontWeight: 800,
                color: 'var(--gold)',
                lineHeight: 1.3,
              }}>
                {item[s.key]}
              </div>
              <div style={{ fontSize: '0.55rem', color: 'var(--text-dim)', letterSpacing: 1 }}>ج.م</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
})

export default function Menu() {
  const [activeTab, setActiveTab] = useState('all')

  const items = useMemo(() => {
    if (activeTab === 'all') {
      return [
        ...menuData.italian.map(i => ({ ...i, cat: 'italian' })),
        ...menuData.oriental.map(i => ({ ...i, cat: 'oriental' })),
      ]
    }
    return menuData[activeTab].map(i => ({ ...i, cat: activeTab }))
  }, [activeTab])

  return (
    <section id="menu" className="section" style={{
      background: 'linear-gradient(180deg, var(--dark) 0%, var(--surface) 50%, var(--dark) 100%)',
    }}>
      {/* Background pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.015,
        backgroundImage: 'radial-gradient(circle at 25% 25%, var(--gold) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      <div className="section-header">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="gold">المنيو</span>{' '}
          <span style={{ color: 'var(--text-muted)', opacity: 0.3, fontWeight: 300 }}>|</span>{' '}
          <span className="red">Menu</span>
        </motion.h2>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          46 نوع بيتزا من أشهى النكهات الإيطالية والشرقية
        </motion.p>
        <motion.div
          className="section-ornament"
          initial={{ width: 0 }}
          whileInView={{ width: 60 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
        />
      </div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 10,
          marginBottom: 45,
          flexWrap: 'wrap',
        }}
      >
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: '10px 28px',
              borderRadius: 50,
              border: activeTab === tab.id
                ? '1px solid var(--red)'
                : '1px solid rgba(255,255,255,0.06)',
              background: activeTab === tab.id
                ? 'linear-gradient(135deg, var(--red), #6B0015)'
                : 'rgba(255,255,255,0.02)',
              color: activeTab === tab.id ? '#fff' : 'var(--text-muted)',
              fontFamily: "'Cairo', sans-serif",
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: activeTab === tab.id
                ? '0 6px 24px rgba(196,30,58,0.25)'
                : 'none',
            }}
          >
            {tab.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Grid */}
      <motion.div layout style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
        gap: 18,
        maxWidth: 1400,
        margin: '0 auto',
      }}>
        <AnimatePresence mode="popLayout">
          {items.map((item, i) => (
            <MenuItem key={`${item.cat}-${item.en}`} item={item} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Count summary */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{
          textAlign: 'center',
          color: 'var(--text-dim)',
          fontSize: '0.85rem',
          marginTop: 50,
          padding: '16px 30px',
          borderRadius: 16,
          background: 'rgba(255,255,255,0.015)',
          border: '1px solid rgba(255,255,255,0.03)',
          maxWidth: 400,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        إجمالي {items.length} صنف &middot; السعر شامل ضريبة القيمة المضافة
        <br />
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', opacity: 0.6 }}>
          All prices include VAT
        </span>
      </motion.div>
    </section>
  )
}
