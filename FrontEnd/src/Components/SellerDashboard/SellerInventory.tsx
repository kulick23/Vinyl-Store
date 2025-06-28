"use client"

import type React from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  useGetInventoryQuery,
  useCreateInventoryItemMutation,
  useUpdateInventoryItemMutation,
  useDeleteInventoryItemMutation,
  usePatchInventoryItemMutation,
} from "../../redux/inventory/api"
import { useGetReleasesQuery } from "../../redux/catalog/api"
import type { InventoryItem, CreateInventoryPayload } from "../../redux/inventory/types"
import VinylSpinner from "../VinylSpinner/VinylSpinner"

const SellerInventory: React.FC = () => {
  const { t } = useTranslation()
  const [isCreating, setIsCreating] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [formData, setFormData] = useState({
    releaseId: 0,
    price: 0,
    quantity: 1,
    condition: 5,
    notes: "",
  })

  const { data: inventory = [], isLoading, error } = useGetInventoryQuery()
  const { data: releases = [] } = useGetReleasesQuery({})
  const [createItem] = useCreateInventoryItemMutation()
  const [updateItem] = useUpdateInventoryItemMutation()
  const [deleteItem] = useDeleteInventoryItemMutation()
  const [patchItem] = usePatchInventoryItemMutation()

  const getConditionText = (condition: number) => {
    const conditions = {
      1: "Poor (P)",
      2: "Fair (F)",
      3: "Good (G)",
      4: "Very Good (VG)",
      5: "Near Mint (NM)",
      6: "Mint (M)",
    }
    return conditions[condition as keyof typeof conditions] || "Unknown"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.releaseId || formData.price <= 0 || formData.quantity <= 0) return

    try {
      if (editingItem) {
        await updateItem({
          id: editingItem.id,
          data: {
            releaseId: formData.releaseId,
            price: formData.price,
            quantity: formData.quantity,
            condition: formData.condition,
            notes: formData.notes || undefined,
          },
        }).unwrap()
        setEditingItem(null)
      } else {
        const payload: CreateInventoryPayload = {
          releaseId: formData.releaseId,
          price: formData.price,
          quantity: formData.quantity,
          condition: formData.condition,
          notes: formData.notes || undefined,
        }
        await createItem(payload).unwrap()
        setIsCreating(false)
      }
      setFormData({ releaseId: 0, price: 0, quantity: 1, condition: 5, notes: "" })
    } catch (error) {
      console.error("Failed to save inventory item:", error)
    }
  }

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item)
    setFormData({
      releaseId: item.releaseId,
      price: item.price,
      quantity: item.quantity,
      condition: item.condition,
      notes: item.notes || "",
    })
    setIsCreating(false)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm(t("seller.inventory.deleteConfirm"))) {
      try {
        await deleteItem(id).unwrap()
      } catch (error) {
        console.error("Failed to delete inventory item:", error)
      }
    }
  }

  const handleToggleActive = async (item: InventoryItem) => {
    try {
      await patchItem({
        id: item.id,
        data: { isActive: !item.isActive },
      }).unwrap()
    } catch (error) {
      console.error("Failed to toggle item status:", error)
    }
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingItem(null)
    setFormData({ releaseId: 0, price: 0, quantity: 1, condition: 5, notes: "" })
  }

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <VinylSpinner size="large" />
        <p>Loading inventory...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-message">
        <p>Failed to load inventory. Please try again.</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 className="section-title">{t("seller.inventory.title")}</h2>
        <button
          onClick={() => setIsCreating(true)}
          disabled={isCreating || editingItem !== null}
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
          {t("seller.inventory.addNewItem")}
        </button>
      </div>

      {(isCreating || editingItem) && (
        <form
          onSubmit={handleSubmit}
          className="seller-form"
          style={{
            marginBottom: "32px",
            padding: "24px",
            backgroundColor: "var(--cover-color)",
            borderRadius: "12px",
            border: "1px solid rgba(59, 130, 246, 0.2)",
          }}
        >
          <div className="form-group">
            <label htmlFor="releaseId">Release</label>
            <select
              id="releaseId"
              value={formData.releaseId}
              onChange={(e) => setFormData({ ...formData, releaseId: Number(e.target.value) })}
              required
            >
              <option value={0}>Select a release</option>
              {releases.map((release) => (
                <option key={release.id} value={release.id}>
                  {release.artist} - {release.title} ({release.year})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="price">Price ($)</label>
            <input
              type="number"
              id="price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="condition">Condition</label>
            <select
              id="condition"
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: Number(e.target.value) })}
              required
            >
              <option value={1}>Poor (P)</option>
              <option value={2}>Fair (F)</option>
              <option value={3}>Good (G)</option>
              <option value={4}>Very Good (VG)</option>
              <option value={5}>Near Mint (NM)</option>
              <option value={6}>Mint (M)</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="notes">Notes (Optional)</label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional notes about this item..."
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="primary">
              {editingItem ? "Update Item" : "Add Item"}
            </button>
            <button type="button" onClick={handleCancel} className="secondary">
              Cancel
            </button>
          </div>
        </form>
      )}

      <table className="inventory-table">
        <thead>
          <tr>
            <th>Release ID</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Condition</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.id}>
              <td>{item.releaseId}</td>
              <td>${item.price}</td>
              <td>{item.quantity}</td>
              <td>{getConditionText(item.condition)}</td>
              <td>
                <span
                  style={{
                    color: item.isActive ? "#10b981" : "#ef4444",
                    fontWeight: "bold",
                  }}
                >
                  {item.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td>{item.notes || "N/A"}</td>
              <td>
                <div className="action-buttons">
                  <button
                    onClick={() => handleEdit(item)}
                    className="edit"
                    disabled={isCreating || editingItem !== null}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleActive(item)}
                    className={`toggle ${!item.isActive ? "inactive" : ""}`}
                    disabled={isCreating || editingItem !== null}
                  >
                    {item.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="delete"
                    disabled={isCreating || editingItem !== null}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {inventory.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-color)" }}>
          <p>No inventory items found. Add your first item to get started selling!</p>
        </div>
      )}
    </div>
  )
}

export default SellerInventory
