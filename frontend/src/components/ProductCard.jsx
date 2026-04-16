const CATEGORY_EMOJI = {
  Fruits: '🍎',
  Dairy: '🥛',
  Bakery: '🍞',
  Meat: '🥩',
  Grains: '🌾',
  Vegetables: '🥦',
}

export default function ProductCard({ product, inCart, onAdd }) {
  const emoji = CATEGORY_EMOJI[product.category] || '🛒'

  return (
    <div className="product-card">
      <div className="product-emoji">{emoji}</div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <p className="product-price">${product.price.toFixed(2)}</p>
      </div>
      <button className={`add-btn${inCart > 0 ? ' in-cart' : ''}`} onClick={onAdd}>
        {inCart > 0 ? `In cart (${inCart}) — Add more` : 'Add to cart'}
      </button>
    </div>
  )
}
