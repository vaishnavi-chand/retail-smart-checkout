export default function Cart({ items, onUpdateQuantity, onRemove, onCheckout, cartCount }) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <aside className="cart">
      <h2 className="cart-title">
        Cart
        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
      </h2>

      {items.length === 0 ? (
        <p className="cart-empty">Your cart is empty</p>
      ) : (
        <>
          <ul className="cart-list">
            {items.map(item => (
              <li key={item.id} className="cart-item">
                <div className="cart-item-info">
                  <span className="cart-item-name">{item.name}</span>
                  <span className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <div className="cart-item-controls">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    &minus;
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => onRemove(item.id)}
                    aria-label="Remove item"
                  >
                    &#10005;
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-footer">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <p className="cart-tax-note">Tax (8%) calculated at checkout</p>
            <button className="checkout-btn" onClick={onCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </aside>
  )
}
