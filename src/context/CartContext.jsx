import React, { createContext, useContext, useReducer } from 'react'

const CartContext = createContext()

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find(
        i => i.name === action.item.name && i.size === action.size
      )
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i === existing ? { ...i, qty: i.qty + 1 } : i
          )
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.item, size: action.size, qty: 1 }]
      }
    }
    case 'REMOVE':
      return {
        ...state,
        items: state.items.filter((_, i) => i !== action.index)
      }
    case 'UPDATE_QTY': {
      if (action.qty <= 0) {
        return { ...state, items: state.items.filter((_, i) => i !== action.index) }
      }
      const updated = [...state.items]
      updated[action.index] = { ...updated[action.index], qty: action.qty }
      return { ...state, items: updated }
    }
    case 'CLEAR':
      return { ...state, items: [] }
    case 'TOGGLE':
      return { ...state, open: !state.open }
    case 'SET_OPEN':
      return { ...state, open: action.open }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], open: false })

  const total = state.items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const count = state.items.reduce((sum, i) => sum + i.qty, 0)

  const whatsappMessage = () => {
    const lines = state.items.map(
      i => `• ${i.name} (${i.size === 'small' ? 'صغير' : i.size === 'medium' ? 'وسط' : i.size === 'large' ? 'كبير' : 'عائلي'}) ×${i.qty} = ${i.price * i.qty} ج.م`
    )
    const msg = `مرحباً، أود طلب:\n${lines.join('\n')}\n\nالإجمالي: ${total} ج.م`
    return encodeURIComponent(msg)
  }

  return (
    <CartContext.Provider value={{ state, dispatch, total, count, whatsappMessage }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
