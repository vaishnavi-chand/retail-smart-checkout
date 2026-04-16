const BASE = '/api'

export async function searchProducts(q) {
  const res = await fetch(`${BASE}/products/search?q=${encodeURIComponent(q)}`)
  if (!res.ok) throw new Error('Search failed')
  return res.json()
}

export async function checkout(cart) {
  const res = await fetch(`${BASE}/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cart })
  })
  if (!res.ok) throw new Error('Checkout failed')
  return res.json()
}

export async function placeOrder(cart, customerInfo) {
  const res = await fetch(`${BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cart, customerInfo })
  })
  if (!res.ok) throw new Error('Order placement failed')
  return res.json()
}
