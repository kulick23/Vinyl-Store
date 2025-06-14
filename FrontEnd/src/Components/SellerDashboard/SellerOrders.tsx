import type React from "react"
import { useGetOrdersQuery } from "../../redux/orders/api"
import VinylSpinner from "../VinylSpinner/VinylSpinner"

const SellerOrders: React.FC = () => {
  const { data: orders = [], isLoading, error } = useGetOrdersQuery()

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <VinylSpinner size="large" />
        <p>Loading orders...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-message">
        <p>Failed to load orders. Please try again.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="section-title">My Orders</h2>

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-color)" }}>
          <p>No orders found. Orders will appear here when customers purchase your items.</p>
        </div>
      ) : (
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Items</th>
              <th>Shipping Address</th>
              <th>Payment Method</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.items.length} items</td>
                <td>{order.shippingAddress}</td>
                <td>{order.paymentMethod}</td>
                <td>
                  <div className="action-buttons">
                    <button className="edit">View Details</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default SellerOrders
