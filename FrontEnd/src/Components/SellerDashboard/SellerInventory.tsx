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
        <p>{t("seller.inventory.loading")}</p>
      </div>
    )
  }

  if (error) {
    const errorMessage = error as any
    if (errorMessage?.status === 401) {
      return (
        <div className="error-message">
          <p>{t("seller.inventory.authError")}</p>
          <button onClick={() => window.location.href = '/login'} className="retry-btn">
            {t("seller.inventory.loginAgain")}
          </button>
        </div>
      )
    }
    return (
      <div className="error-message">
        <p>{t("seller.inventory.loadError")}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          {t("seller.inventory.retry")}
        </button>
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
            <label htmlFor="releaseId">{t("seller.inventory.release")}</label>
            <select
              id="releaseId"
              value={formData.releaseId}
              onChange={(e) => setFormData({ ...formData, releaseId: Number(e.target.value) })}
              required
            >
              <option value={0}>{t("seller.inventory.selectRelease")}</option>
              {releases.map((release) => (
                <option key={release.id} value={release.id}>
                  {release.artist} - {release.title} ({release.year})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="price">{t("seller.inventory.price")} ($)</label>
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
            <label htmlFor="quantity">{t("seller.inventory.quantity")}</label>
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
            <label htmlFor="condition">{t("seller.inventory.condition")}</label>
            <select
              id="condition"
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: Number(e.target.value) })}
              required
            >
              <option value={1}>{t("seller.inventory.conditionPoor")}</option>
              <option value={2}>{t("seller.inventory.conditionFair")}</option>
              <option value={3}>{t("seller.inventory.conditionGood")}</option>
              <option value={4}>{t("seller.inventory.conditionVeryGood")}</option>
              <option value={5}>{t("seller.inventory.conditionNearMint")}</option>
              <option value={6}>{t("seller.inventory.conditionMint")}</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="notes">{t("seller.inventory.notes")}</label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={t("seller.inventory.notesPlaceholder")}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="primary">
              {editingItem ? t("seller.inventory.updateItem") : t("seller.inventory.addItem")}
            </button>
            <button type="button" onClick={handleCancel} className="secondary">
              {t("seller.inventory.cancel")}
            </button>
          </div>
        </form>
      )}

      <table className="inventory-table">
        <thead>
          <tr>
            <th>{t("seller.inventory.releaseId")}</th>
            <th>{t("seller.inventory.price")}</th>
            <th>{t("seller.inventory.quantity")}</th>
            <th>{t("seller.inventory.condition")}</th>
            <th>{t("seller.inventory.status")}</th>
            <th>{t("seller.inventory.notes")}</th>
            <th>{t("seller.inventory.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.id}>
              <td>{item.releaseId}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>{item.quantity}</td>
              <td>{getConditionText(item.condition)}</td>
              <td>
                <span
                  className={`status-badge ${item.isActive ? 'active' : 'inactive'}`}
                >
                  {item.isActive ? t("seller.inventory.statusActive") : t("seller.inventory.statusInactive")}
                </span>
              </td>
              <td>{item.notes || t("seller.inventory.noNotes")}</td>
              <td>
                <div className="action-buttons">
                  <button
                    onClick={() => handleEdit(item)}
                    className="edit"
                    disabled={isCreating || editingItem !== null}
                    title={t("seller.inventory.edit")}
                  >
                    ✏️ {t("seller.inventory.edit")}
                  </button>
                  <button
                    onClick={() => handleToggleActive(item)}
                    className={`toggle ${!item.isActive ? "inactive" : ""}`}
                    disabled={isCreating || editingItem !== null}
                    title={item.isActive ? t("seller.inventory.deactivate") : t("seller.inventory.activate")}
                  >
                    {item.isActive ? "🔴" : "🟢"} {item.isActive ? t("seller.inventory.deactivate") : t("seller.inventory.activate")}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="delete"
                    disabled={isCreating || editingItem !== null}
                    title={t("seller.inventory.delete")}
                  >
                    🗑️ {t("seller.inventory.delete")}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {inventory.length === 0 && (
        <div className="empty-inventory">
          <div className="empty-icon">📦</div>
          <h3>{t("seller.inventory.noItems")}</h3>
          <p>{t("seller.inventory.noItemsMessage")}</p>
          <button 
            onClick={() => setIsCreating(true)} 
            className="add-first-item-btn"
          >
            {t("seller.inventory.addFirstItem")}
          </button>
        </div>
      )}
    </div>
  )
}

export default SellerInventory
