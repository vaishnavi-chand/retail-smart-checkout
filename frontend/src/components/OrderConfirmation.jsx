export default function OrderConfirmation({ order, onNewOrder }) {
  return (
    <div className="confirmation-page">
      <div className="confirmation-inner">
        <div className="confirmation-icon">&#10003;</div>
        <h2>Order Placed!</h2>
        <p className="confirmation-sub">Thank you for your purchase.</p>

        <div className="order-id-box">
          <span className="order-id-label">Order ID</span>
          <code>{order.orderId}</code>
        </div>

        <div className="order-details">
          <div className="detail-row">
            <span>Total</span>
            <strong>${order.order.total.toFixed(2)}</strong>
          </div>
          <div className="detail-row">
            <span>Status</span>
            <span className="status-badge">{order.order.status}</span>
          </div>
          <div className="detail-row">
            <span>Placed at</span>
            <span>{new Date(order.order.createdAt).toLocaleString()}</span>
          </div>
        </div>

        <button className="new-order-btn" onClick={onNewOrder}>
          Start New Order
        </button>
      </div>
    </div>
  )
}
