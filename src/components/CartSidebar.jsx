import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'

export default function CartSidebar() {
  const { state, dispatch, total, count, whatsappMessage } = useCart()

  return (
    <AnimatePresence>
      {state.open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch({ type: 'SET_OPEN', open: false })}
            style={{
              position: 'fixed', inset: 0, zIndex: 199, background: 'rgba(0,0,0,0.5)',
            }}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 200,
              width: 'min(380px, 85vw)',
              background: 'var(--darker)',
              borderLeft: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', flexDirection: 'column',
              boxShadow: '-10px 0 60px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--gold)', fontSize: '1.3rem' }}>
                طلبي <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>| My Order</span>
              </h3>
              <button onClick={() => dispatch({ type: 'SET_OPEN', open: false })}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>
                ✕
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
              {count === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-dim)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 16 }}>🛒</div>
                  <p>سلة الطلب فارغة</p>
                  <p style={{ fontSize: '0.85rem' }}>Your cart is empty</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {state.items.map((item, i) => (
                    <motion.div
                      key={`${item.name}-${item.size}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      style={{
                        padding: '14px 16px', borderRadius: 14,
                        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>{item.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                            {item.size === 'small' ? 'صغير' : item.size === 'medium' ? 'وسط' : item.size === 'large' ? 'كبير' : 'عائلي'} | {item.price} ج.م
                          </div>
                        </div>
                        <button onClick={() => dispatch({ type: 'REMOVE', index: i })}
                          style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', fontSize: '0.8rem' }}>
                          ✕
                        </button>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <button onClick={() => dispatch({ type: 'UPDATE_QTY', index: i, qty: item.qty - 1 })}
                          style={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'var(--text)', cursor: 'pointer' }}>
                          −
                        </button>
                        <span style={{ fontWeight: 700, color: 'var(--gold)', minWidth: 24, textAlign: 'center' }}>{item.qty}</span>
                        <button onClick={() => dispatch({ type: 'UPDATE_QTY', index: i, qty: item.qty + 1 })}
                          style={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'var(--text)', cursor: 'pointer' }}>
                          +
                        </button>
                        <div style={{ marginLeft: 'auto', fontWeight: 700, color: 'var(--gold)' }}>{item.price * item.qty} ج.م</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {count > 0 && (
              <div style={{
                borderTop: '1px solid rgba(255,255,255,0.06)', padding: '20px 24px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ color: 'var(--text-muted)' }}>الإجمالي | Total</span>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 700, color: 'var(--gold)' }}>{total} ج.م</span>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => dispatch({ type: 'CLEAR' })}
                    style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                    تفريغ
                  </button>
                  <a href={`https://wa.me/201129115112?text=${whatsappMessage()}`} target="_blank" rel="noopener noreferrer"
                    style={{ flex: 2, padding: '12px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #25D366, #128C7E)', color: '#fff', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>
                    أرسل الطلب via WhatsApp
                  </a>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
