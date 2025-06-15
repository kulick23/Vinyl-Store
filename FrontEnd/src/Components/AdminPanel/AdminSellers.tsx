"use client"

import type React from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  useGetAdminSellersQuery,
  useCreateAdminSellerMutation,
  useUpdateAdminSellerMutation,
  useDeleteAdminSellerMutation,
} from "../../redux/admin/api"
import type { AdminSeller } from "../../redux/admin/types"
import VinylSpinner from "../VinylSpinner/VinylSpinner"
import { ConfirmDialog } from "../ConfirmDialog/ConfirmDialog"
import { useNotification } from "../../hooks/useNotification"

const AdminSellers: React.FC = () => {
  const { t } = useTranslation()
  const [isCreating, setIsCreating] = useState(false)
  const [editingSeller, setEditingSeller] = useState<AdminSeller | null>(null)
  const [formData, setFormData] = useState({
    sellerId: 0,
    displayName: "",
    description: "",
    rating: 5,
  })
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [sellerToDelete, setSellerToDelete] = useState<number | null>(null)

  const { data: sellers = [], isLoading, error } = useGetAdminSellersQuery()
  const [createSeller] = useCreateAdminSellerMutation()
  const [updateSeller] = useUpdateAdminSellerMutation()
  const [deleteSeller] = useDeleteAdminSellerMutation()
  const { showSuccess, showError } = useNotification()

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
        showSuccess(t('admin.sellers.updateSuccess'))
      } else {
        await createSeller(sellerData).unwrap()
        setIsCreating(false)
        showSuccess(t('admin.sellers.updateSuccess'))
      }
      setFormData({ sellerId: 0, displayName: "", description: "", rating: 5 })
    } catch (error) {
      console.error("Failed to save seller:", error)
      showError(t('admin.sellers.updateError'))
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

  const handleDeleteClick = (id: number) => {
    setSellerToDelete(id)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    if (sellerToDelete) {
      try {
        await deleteSeller(sellerToDelete).unwrap()
        setShowDeleteDialog(false)
        setSellerToDelete(null)
        showSuccess(t('admin.sellers.deleteSuccess'))
      } catch (error) {
        console.error("Failed to delete seller:", error)
        showError(t('admin.sellers.deleteError'))
      }
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false)
    setSellerToDelete(null)
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
        <p>{t('admin.sellers.loading')}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{t('admin.sellers.loadError')}</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 className="section-title">{t('admin.sellers.title')}</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="primary"
          disabled={isCreating || editingSeller !== null}
        >
          {t('admin.sellers.form.updateButton')}
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
            <label htmlFor="displayName">{t('admin.sellers.form.name')}</label>
            <input
              type="text"
              id="displayName"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              placeholder={t('admin.sellers.form.namePlaceholder')}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter description"
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
              {t('admin.sellers.form.updateButton')}
            </button>
            <button type="button" onClick={handleCancel} className="secondary">
              {t('admin.sellers.form.cancelButton')}
            </button>
          </div>
        </form>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>{t('admin.sellers.table.id')}</th>
            <th>Seller ID</th>
            <th>{t('admin.sellers.table.name')}</th>
            <th>Description</th>
            <th>Rating</th>
            <th>{t('admin.sellers.table.actions')}</th>
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
                    {t('admin.sellers.table.editButton')}
                  </button>
                  <button
                    onClick={() => handleDeleteClick(seller.id)}
                    className="delete"
                    disabled={isCreating || editingSeller !== null}
                  >
                    {t('admin.sellers.table.deleteButton')}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {sellers.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-color)" }}>
          <p>{t('admin.sellers.noSellers')}</p>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title={t('admin.sellers.deleteConfirmTitle')}
        message={t('admin.sellers.deleteConfirmMessage')}
        type="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  )
}

export default AdminSellers
