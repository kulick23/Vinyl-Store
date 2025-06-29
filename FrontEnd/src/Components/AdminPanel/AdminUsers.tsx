"use client"

import type React from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useGetAdminUsersQuery, useUpdateAdminUserMutation, useDeleteAdminUserMutation, useGetAdminSellersQuery } from "../../redux/admin/api"
import type { AdminUser } from "../../redux/admin/types"
import VinylSpinner from "../VinylSpinner/VinylSpinner"
import { ConfirmDialog } from "../ConfirmDialog/ConfirmDialog"
import { useNotification } from "../../hooks/useNotification"

const AdminUsers: React.FC = () => {
  const { t } = useTranslation()
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    isEmailConfirmed: false,
  })
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)

  const { data: users = [], isLoading, error } = useGetAdminUsersQuery()
  const { data: sellers = [] } = useGetAdminSellersQuery()
  const [updateUser] = useUpdateAdminUserMutation()
  const [deleteUser] = useDeleteAdminUserMutation()
  const { showSuccess, showError } = useNotification()

  // Helper function to determine user role
  const getUserRole = (user: AdminUser) => {
    // Check if user has a seller profile by matching email or user ID
    const hasSeller = sellers.some(seller => 
      // Assuming seller has a way to link to user - checking by user ID if available
      // or you might need to adjust this based on your data structure
      seller.sellerId === parseInt(user.id)
    )
    return hasSeller ? 'Seller' : 'User'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser || !formData.email.trim() || !formData.firstName.trim() || !formData.lastName.trim()) return

    try {
      await updateUser({
        id: editingUser.id,
        data: {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone || undefined,
          isEmailConfirmed: formData.isEmailConfirmed,
        },
      }).unwrap()
      setEditingUser(null)
      setFormData({ email: "", firstName: "", lastName: "", phone: "", isEmailConfirmed: false })
      showSuccess(t('admin.users.updateSuccess'))
    } catch (error) {
      console.error("Failed to update user:", error)
      showError(t('admin.users.updateError'))
    }
  }

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone || "",
      isEmailConfirmed: user.isEmailConfirmed,
    })
  }

  const handleDeleteClick = (id: string) => {
    setUserToDelete(id)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete).unwrap()
        setShowDeleteDialog(false)
        setUserToDelete(null)
        showSuccess(t('admin.users.deleteSuccess'))
      } catch (error) {
        console.error("Failed to delete user:", error)
        showError(t('admin.users.deleteError'))
      }
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false)
    setUserToDelete(null)
  }

  const handleCancel = () => {
    setEditingUser(null)
    setFormData({ email: "", firstName: "", lastName: "", phone: "", isEmailConfirmed: false })
  }

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <VinylSpinner size="large" />
        <p>{t('admin.users.loading')}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{t('admin.users.loadError')}</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 className="section-title">{t('admin.users.title')}</h2>
      </div>

      {editingUser && (
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
            <label htmlFor="userEmail">{t('admin.users.form.email')}</label>
            <input
              type="email"
              id="userEmail"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder={t('admin.users.form.emailPlaceholder')}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="userFirstName">{t('admin.users.form.firstName')}</label>
            <input
              type="text"
              id="userFirstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder={t('admin.users.form.firstNamePlaceholder')}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="userLastName">{t('admin.users.form.lastName')}</label>
            <input
              type="text"
              id="userLastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder={t('admin.users.form.lastNamePlaceholder')}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="userPhone">{t('admin.users.form.phone')}</label>
            <input
              type="tel"
              id="userPhone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder={t('admin.users.form.phonePlaceholder')}
            />
          </div>
          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="checkbox"
                checked={formData.isEmailConfirmed}
                onChange={(e) => setFormData({ ...formData, isEmailConfirmed: e.target.checked })}
              />
              {t('admin.users.form.emailConfirmed')}
            </label>
          </div>
          <div className="form-actions">
            <button type="submit" className="primary">
              {t('admin.users.form.updateButton')}
            </button>
            <button type="button" onClick={handleCancel} className="secondary">
              {t('admin.users.form.cancelButton')}
            </button>
          </div>
        </form>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>{t('admin.users.table.id')}</th>
            <th>{t('admin.users.table.email')}</th>
            <th>{t('admin.users.table.name')}</th>
            <th>{t('admin.users.table.phone')}</th>
            <th>{t('admin.users.table.role')}</th>
            <th>{t('admin.users.table.emailConfirmed')}</th>
            <th>{t('admin.users.table.lastLogin')}</th>
            <th>{t('admin.users.table.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>
                {user.firstName} {user.lastName}
              </td>
              <td>{user.phone || t('admin.users.table.notAvailable')}</td>
              <td>
                <span className={`role-badge ${getUserRole(user).toLowerCase()}`}>
                  {getUserRole(user)}
                </span>
              </td>
              <td>{user.isEmailConfirmed ? "✅" : "❌"}</td>
              <td>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : t('admin.users.table.notAvailable')}</td>
              <td>
                <div className="action-buttons">
                  <button onClick={() => handleEdit(user)} className="edit" disabled={editingUser !== null}>
                    {t('admin.users.table.editButton')}
                  </button>
                  <button onClick={() => handleDeleteClick(user.id)} className="delete" disabled={editingUser !== null}>
                    {t('admin.users.table.deleteButton')}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-color)" }}>
          <p>{t('admin.users.noUsers')}</p>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title={t('admin.users.deleteConfirmTitle')}
        message={t('admin.users.deleteConfirmMessage')}
        type="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  )
}

export default AdminUsers
