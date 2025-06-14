"use client"

import type React from "react"
import { useState } from "react"
import {
  useGetAdminSellersQuery,
  useCreateAdminSellerMutation,
  useUpdateAdminSellerMutation,
  useDeleteAdminSellerMutation,
} from "../../redux/admin/api"
import type { AdminSeller } from "../../redux/admin/types"
import VinylSpinner from "../VinylSpinner/VinylSpinner"

const AdminSellers: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false)
  const [editingSeller, setEditingSeller] = useState<AdminSeller | null>(null)
  const [formData, setFormData] = useState({
    sellerId: 0,
    displayName: "",
    description: "",
    rating: 5,
  })

  const { data: sellers = [], isLoading, error } = useGetAdminSellersQuery()
  const [createSeller] = useCreateAdminSellerMutation()
  const [updateSeller] = useUpdateAdminSellerMutation()
  const [deleteSeller] = useDeleteAdminSellerMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.displayName.trim() || !formData.description.trim()) return

    try {
      const sellerData = {
        id: editingSeller?.id || 0,
        sellerId: formData.sellerId,
        displayName: formData.displayName,
        description: formData.description,
        rating: formData.rating,
      }

      if (editingSeller) {
        await updateSeller(sellerData).unwrap()
        setEditingSeller(null)
      } else {
        await createSeller(sellerData).unwrap()
        setIsCreating(false)
      }
      setFormData({ sellerId: 0, displayName: "", description: "", rating: 5 })
    } catch (error) {
      console.error("Failed to save seller:", error)
    }
  }

  const handleEdit = (seller: AdminSeller) => {
    setEditingSeller(seller)
    setFormData({
      sellerId: seller.sellerId,
      displayName: seller.displayName,
      description: seller.description,
      rating: seller.rating,
    })
    setIsCreating(false)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this seller?")) {
      try {
        await deleteSeller(id).unwrap()
      } catch (error) {
        console.error("Failed to delete seller:", error)
      }
    }
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingSeller(null)
    setFormData({ sellerId: 0, displayName: "", description: "", rating: 5 })
  }

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <VinylSpinner size="large" />
        <p>Loading sellers...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-message">
        <p>Failed to load sellers. Please try again.</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 className="section-title">Manage Sellers</h2>
        <button
          onClick={() => setIsCreating(true)}
          disabled={isCreating || editingSeller !== null}
          style={{
            backgroundColor: "var(--orange-color)",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "500",
            height: "auto",
          }}
        >
          Add Seller
        </button>
      </div>

      {(isCreating || editingSeller) && (
        <form
          onSubmit={handleSubmit}
          className="admin-form"
          style={{
            marginBottom: "32px",
            padding: "24px",
            backgroundColor: "var(--cover-color)",
            borderRadius: "12px",
            border: "1px solid rgba(229, 89, 46, 0.2)",
          }}
        >
          <div className="form-group">
            <label htmlFor="sellerId">Seller ID</label>
            <input
              type="number"
              id="sellerId"
              value={formData.sellerId}
              onChange={(e) => setFormData({ ...formData, sellerId: Number(e.target.value) })}
              placeholder="Enter seller ID"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="displayName">Display Name</label>
            <input
              type="text"
              id="displayName"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              placeholder="Enter display name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter seller description"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="rating">Rating</label>
            <input
              type="number"
              id="rating"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
              min="1"
              max="5"
              step="0.1"
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="primary">
              {editingSeller ? "Update Seller" : "Create Seller"}
            </button>
            <button type="button" onClick={handleCancel} className="secondary">
              Cancel
            </button>
          </div>
        </form>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Seller ID</th>
            <th>Display Name</th>
            <th>Description</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sellers.map((seller) => (
            <tr key={seller.id}>
              <td>{seller.id}</td>
              <td>{seller.sellerId}</td>
              <td>{seller.displayName}</td>
              <td>{seller.description}</td>
              <td>⭐ {seller.rating}</td>
              <td>
                <div className="action-buttons">
                  <button
                    onClick={() => handleEdit(seller)}
                    className="edit"
                    disabled={isCreating || editingSeller !== null}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(seller.id)}
                    className="delete"
                    disabled={isCreating || editingSeller !== null}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {sellers.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-color)" }}>
          <p>No sellers found. Create your first seller to get started.</p>
        </div>
      )}
    </div>
  )
}

export default AdminSellers
