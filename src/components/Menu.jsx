import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { menuData } from '../data/menu'
import { useCart } from '../context/CartContext'

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
  for (const [k, v] of Object.entries(foodIcons)) { if (name.includes(k)) return v }
  return '🍕'
}

const sizeLabels = { small: 'صغير', medium: 'وسط', large: 'كبير', family: 'عائلي' }
const sizes = ['small', 'medium', 'large', 'family']

const extras = [
  { id: 'cheese', ar: 'إضافة جبنة', en: 'Add Cheese', price: 10 },
  { id: 'mushroom', ar: 'إضافة مشرووم', en: 'Add Mushroom', price: 10 },
  { id: 'pepperoni', ar: 'إضافة بيبروني', en: 'Add Pepperoni', price: 12 },
  { id: 'olives', ar: 'إضافة زيتون', en: 'Add Olives', price: 8 },
  { id: 'peppers', ar: 'إضافة فلفل', en: 'Add Peppers', price: 8 },
  { id: 'extra_cheese', ar: 'جبنة إضافية', en: 'Extra Cheese', price: 12 },
]

const MenuItem = React.forwardRef(({ item, index }, ref) => {
  const { dispatch } = useCart()
  const [size, setSize] = useState('medium')
  const [selectedExtras, setSelectedExtras] = useState([])

  const toggleExtra = (id) => {
    setSelectedExtras(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    )
  }

  const basePrice = item[size]
  const extrasTotal = selectedExtras.reduce((sum, id) => {
    const extra = extras.find(e => e.id === id)
    return sum + (extra ? extra.price : 0)
  }, 0)

  const addToCart = () => {
    const extraNames = selectedExtras.map(id => {
      const e = extras.find(x => x.id === id)
      return e ? e.ar : ''
    }).filter(Boolean)
    const name = extraNames.length
      ? `${item.name} + ${extraNames.join(' + ')}`
      : item.name
    dispatch({ type: 'ADD', item: { name, price: basePrice + extrasTotal }, size })
  }

  return (
    <motion.div ref={ref} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}>
      <motion.div whileHover={{ y: -6 }}
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 20, overflow: 'hidden', transition: 'border-color 0.4s ease, box-shadow 0.4s ease' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,215,0,0.2)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4)' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.boxShadow = 'none' }}>
        <div style={{ height: 3, background: item.cat === 'italian' ? 'linear-gradient(90deg, var(--red), transparent)' : 'linear-gradient(90deg, var(--gold), transparent)' }} />
        <div style={{ padding: '20px 22px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '1.5rem' }}>{getIcon(item.name)}</span>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>{item.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', direction: 'ltr', textAlign: 'left' }}>{item.en}</div>
              </div>
            </div>
            <span style={{
              fontSize: '0.55rem', padding: '3px 12px', borderRadius: 20, whiteSpace: 'nowrap',
              background: item.cat === 'italian' ? 'rgba(196,30,58,0.15)' : 'rgba(255,215,0,0.12)',
              color: item.cat === 'italian' ? 'var(--red)' : 'var(--gold)', fontWeight: 700,
            }}>{item.cat === 'italian' ? 'إيطالي' : 'شرقي'}</span>
          </div>

          {/* Size Selector */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginTop: 12, padding: '10px 0 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            {sizes.map(s => {
              const active = size === s
              return (
                <div key={s} onClick={() => setSize(s)}
                  style={{
                    textAlign: 'center', padding: '6px 4px', borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s ease',
                    background: active ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.02)',
                    border: active ? '1px solid rgba(255,215,0,0.2)' : '1px solid transparent',
                  }}>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontWeight: 600 }}>{sizeLabels[s]}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--gold)', lineHeight: 1.3 }}>{item[s]}</div>
                  <div style={{ fontSize: '0.5rem', color: 'var(--text-dim)' }}>ج.م</div>
                </div>
              )
            })}
          </div>

          {/* Extras */}
          <div style={{ marginTop: 12, padding: '10px 0 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 600, marginBottom: 8, textAlign: 'right' }}>
              إضافات | Extras
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {extras.map(extra => {
                const active = selectedExtras.includes(extra.id)
                return (
                  <div key={extra.id} onClick={() => toggleExtra(extra.id)}
                    style={{
                      padding: '5px 10px', borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s ease', fontSize: '0.68rem', fontWeight: 600,
                      background: active ? 'rgba(255,215,0,0.12)' : 'rgba(255,255,255,0.03)',
                      border: active ? '1px solid rgba(255,215,0,0.25)' : '1px solid rgba(255,255,255,0.04)',
                      color: active ? 'var(--gold)' : 'var(--text-muted)',
                    }}>
                    <span style={{ marginLeft: 4 }}>{extra.ar}</span>
                    <span style={{ opacity: 0.6, fontSize: '0.6rem' }}>+{extra.price}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Total + Buttons */}
          <div style={{ display: 'flex', gap: 6, marginTop: 14, padding: '10px 0 0', borderTop: '1px solid rgba(255,255,255,0.04)', alignItems: 'center' }}>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--gold)', marginLeft: 'auto', whiteSpace: 'nowrap' }}>
              {basePrice + extrasTotal} ج.م
            </div>
            <motion.a
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
              href={`https://wa.me/201129115112?text=${encodeURIComponent(`مرحباً، أود طلب ${item.name} (${sizeLabels[size]}) من بيتزا السلطان${selectedExtras.length ? ' مع ' + selectedExtras.map(id => extras.find(e => e.id === id)?.ar).join(' و ') : ''}`)}`}
              target="_blank" rel="noopener noreferrer"
              style={{
                padding: '8px 12px', borderRadius: 10, border: '1px solid rgba(37,211,102,0.3)',
                background: 'rgba(37,211,102,0.08)', color: '#25D366', textDecoration: 'none',
                fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                fontFamily: "'Cairo', sans-serif", fontWeight: 700,
              }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              واتساب
            </motion.a>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }} onClick={addToCart}
              style={{
                padding: '8px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, var(--red), #6B0015)', color: '#fff',
                fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: '0.8rem', whiteSpace: 'nowrap',
                boxShadow: '0 4px 16px rgba(196,30,58,0.25)',
              }}>
              + أضف إلى الطلب
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
})

export default function Menu() {
  const [activeTab, setActiveTab] = useState('all')
  const items = useMemo(() => {
    if (activeTab === 'all') return [...menuData.italian.map(i => ({ ...i, cat: 'italian' })), ...menuData.oriental.map(i => ({ ...i, cat: 'oriental' }))]
    return menuData[activeTab].map(i => ({ ...i, cat: activeTab }))
  }, [activeTab])

  return (
    <section id="menu" className="section" style={{ background: 'linear-gradient(180deg, var(--dark) 0%, var(--surface) 50%, var(--dark) 100%)' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.015, backgroundImage: 'radial-gradient(circle at 25% 25%, var(--gold) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
      <div className="section-header">
        <motion.h2 className="section-title" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <span className="gold">المنيو</span> <span style={{ color: 'var(--text-muted)', opacity: 0.3, fontWeight: 300 }}>|</span> <span className="red">Menu</span>
        </motion.h2>
        <motion.p className="section-subtitle" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}>
          46 نوع بيتزا من أشهى النكهات الإيطالية والشرقية
        </motion.p>
        <motion.div className="section-ornament" initial={{ width: 0 }} whileInView={{ width: 60 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.25 }} />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
        style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 45, flexWrap: 'wrap' }}>
        {tabs.map((tab) => (
          <motion.button key={tab.id} onClick={() => setActiveTab(tab.id)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            style={{
              padding: '10px 28px', borderRadius: 50, fontFamily: "'Cairo', sans-serif", fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s ease',
              border: activeTab === tab.id ? '1px solid var(--red)' : '1px solid rgba(255,255,255,0.06)',
              background: activeTab === tab.id ? 'linear-gradient(135deg, var(--red), #6B0015)' : 'rgba(255,255,255,0.02)',
              color: activeTab === tab.id ? '#fff' : 'var(--text-muted)',
              boxShadow: activeTab === tab.id ? '0 6px 24px rgba(196,30,58,0.25)' : 'none',
            }}>{tab.label}</motion.button>
        ))}
      </motion.div>
      <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 18, maxWidth: 1400, margin: '0 auto' }}>
        <AnimatePresence mode="popLayout">
          {items.map((item, i) => <MenuItem key={`${item.cat}-${item.en}`} item={item} index={i} />)}
        </AnimatePresence>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: 50, padding: '16px 30px', borderRadius: 16, background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.03)', maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}>
        إجمالي {items.length} صنف &middot; السعر شامل ضريبة القيمة المضافة<br /><span style={{ fontSize: '0.75rem', opacity: 0.6 }}>All prices include VAT</span>
      </motion.div>
    </section>
  )
}
