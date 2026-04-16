import { useState, useCallback, useRef } from 'react'
import { searchProducts, checkout, placeOrder } from './api'
import SearchBar from './components/SearchBar'
import ProductCard from './components/ProductCard'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import OrderConfirmation from './components/OrderConfirmation'

export default function App() {
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState(null)
  const [cart, setCart] = useState([])
  const [view, setView] = useState('shop') // 'shop' | 'checkout' | 'confirmation'
  const [checkoutData, setCheckoutData] = useState(null)
  const [orderResult, setOrderResult] = useState(null)
  const [placingOrder, setPlacingOrder] = useState(false)
  const debounceRef = useRef(null)

  const handleSearch = useCallback((q) => {
    setQuery(q)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!q.trim()) {
      setProducts([])
      setSearchError(null)
      return
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      setSearchError(null)
      try {
        const data = await searchProducts(q)
        setProducts(data.results)
      } catch {
        setSearchError('Search failed. Is the backend running on port 3001?')
        setProducts([])
      } finally {
        setSearching(false)
      }
    }, 300)
  }, [])

  const addToCart = useCallback((product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }, [])

  const updateQuantity = useCallback((id, qty) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(i => i.id !== id))
    } else {
      setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i))
    }
  }, [])

  const removeFromCart = useCallback((id) => {
    setCart(prev => prev.filter(i => i.id !== id))
  }, [])

  const handleCheckout = async () => {
    const cartPayload = cart.map(({ id, quantity }) => ({ id, quantity }))
    try {
      const data = await checkout(cartPayload)
      setCheckoutData(data)
      setView('checkout')
    } catch {
      alert('Could not load checkout. Make sure the backend is running on port 3001.')
    }
  }

  const handlePlaceOrder = async (customerInfo) => {
    setPlacingOrder(true)
    const cartPayload = cart.map(({ id, quantity }) => ({ id, quantity }))
    try {
      const data = await placeOrder(cartPayload, customerInfo)
      setOrderResult(data)
      setCart([])
      setView('confirmation')
    } catch {
      alert('Failed to place order. Please try again.')
    } finally {
      setPlacingOrder(false)
    }
  }

  const handleNewOrder = () => {
    setView('shop')
    setProducts([])
    setQuery('')
    setCheckoutData(null)
    setOrderResult(null)
  }

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0)

  if (view === 'confirmation') {
    return <OrderConfirmation order={orderResult} onNewOrder={handleNewOrder} />
  }

  if (view === 'checkout') {
    return (
      <Checkout
        checkoutData={checkoutData}
        onBack={() => setView('shop')}
        onPlaceOrder={handlePlaceOrder}
        placing={placingOrder}
      />
    )
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <h1 className="logo">Smart Checkout</h1>
          <p className="tagline">Your neighborhood grocery store</p>
        </div>
      </header>

      <div className="main">
        <div className="shop-area">
          <SearchBar query={query} onChange={handleSearch} />

          {searching && <p className="status">Searching...</p>}
          {searchError && <p className="status error">{searchError}</p>}

          {!query && !searching && (
            <div className="empty-state">
              <p>Search for products like "apple", "milk", "fruits", or "grains"</p>
            </div>
          )}

          {query && !searching && products.length === 0 && !searchError && (
            <p className="status">No products found for "{query}"</p>
          )}

          <div className="product-grid">
            {products.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                inCart={cart.find(i => i.id === p.id)?.quantity || 0}
                onAdd={() => addToCart(p)}
              />
            ))}
          </div>
        </div>

        <Cart
          items={cart}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          onCheckout={handleCheckout}
          cartCount={cartCount}
        />
      </div>
    </div>
  )
}
