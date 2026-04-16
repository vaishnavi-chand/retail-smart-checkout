import { useState } from 'react'

export default function Checkout({ checkoutData, onBack, onPlaceOrder, placing }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onPlaceOrder({ name: name.trim() || 'Anonymous', email: email.trim() })
  }

  return (
    <div className="checkout-page">
      <div className="checkout-inner">
        <button className="back-btn" onClick={onBack}>
          &larr; Back to cart
        </button>

        <h2>Order Summary</h2>

        <div className="order-items">
          {checkoutData.cart.map(item => (
            <div key={item.id} className="order-row">
              <span>{item.name} &times; {item.quantity}</span>
              <span>${item.itemTotal.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="order-totals">
          <div className="total-row">
            <span>Subtotal</span>
            <span>${checkoutData.subtotal.toFixed(2)}</span>
          </div>
          <div className="total-row">
            <span>Tax (8%)</span>
            <span>${checkoutData.tax.toFixed(2)}</span>
          </div>
          <div className="total-row grand-total">
            <span>Total</span>
            <span>${checkoutData.total.toFixed(2)}</span>
          </div>
        </div>

        <form className="customer-form" onSubmit={handleSubmit}>
          <h3>Contact Info <span className="optional">(optional)</span></h3>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={placing}
          />
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={placing}
          />
          <button type="submit" className="place-order-btn" disabled={placing}>
            {placing ? 'Placing order...' : `Place Order — $${checkoutData.total.toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  )
}
