"use client"

import type React from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  useGetAdminArtistsQuery,
  useCreateAdminArtistMutation,
  useUpdateAdminArtistMutation,
  useDeleteAdminArtistMutation,
} from "../../redux/admin/api"
import type { AdminArtist } from "../../redux/admin/types"
import VinylSpinner from "../VinylSpinner/VinylSpinner"
import { ConfirmDialog } from "../ConfirmDialog/ConfirmDialog"
import { useNotification } from "../../hooks/useNotification"

const AdminArtists: React.FC = () => {
  const { t } = useTranslation()
  const [isCreating, setIsCreating] = useState(false)
  const [editingArtist, setEditingArtist] = useState<AdminArtist | null>(null)
  const [formData, setFormData] = useState({ name: "" })
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [artistToDelete, setArtistToDelete] = useState<number | null>(null)

  const { data: artists = [], isLoading, error } = useGetAdminArtistsQuery()
  const [createArtist] = useCreateAdminArtistMutation()
  const [updateArtist] = useUpdateAdminArtistMutation()
  const [deleteArtist] = useDeleteAdminArtistMutation()
  const { showSuccess, showError } = useNotification()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    try {
      if (editingArtist) {
        await updateArtist({ ...editingArtist, name: formData.name }).unwrap()
        setEditingArtist(null)
        showSuccess(t('admin.artists.updateSuccess'))
      } else {
        await createArtist({ id: 0, name: formData.name }).unwrap()
        setIsCreating(false)
        showSuccess(t('admin.artists.createSuccess'))
      }
      setFormData({ name: "" })
    } catch (error) {
      console.error("Failed to save artist:", error)
      showError(t('admin.artists.saveError'))
    }
  }

  const handleEdit = (artist: AdminArtist) => {
    setEditingArtist(artist)
    setFormData({ name: artist.name })
    setIsCreating(false)
  }

  const handleDeleteClick = (id: number) => {
    setArtistToDelete(id)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    if (artistToDelete) {
      try {
        await deleteArtist(artistToDelete).unwrap()
        setShowDeleteDialog(false)
        setArtistToDelete(null)
        showSuccess(t('admin.artists.deleteSuccess'))
      } catch (error) {
        console.error("Failed to delete artist:", error)
        showError(t('admin.artists.deleteError'))
      }
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false)
    setArtistToDelete(null)
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingArtist(null)
    setFormData({ name: "" })
  }

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <VinylSpinner size="large" />
        <p>{t('admin.artists.loading')}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{t('admin.artists.loadError')}</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 className="section-title">{t('admin.artists.title')}</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="primary"
          disabled={isCreating || editingArtist !== null}
        >
          {t('admin.artists.form.createButton')}
        </button>
      </div>

      {(isCreating || editingArtist) && (
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
            <label htmlFor="artistName">{t('admin.artists.form.name')}</label>
            <input
              type="text"
              id="artistName"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              placeholder={t('admin.artists.form.namePlaceholder')}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="primary">
              {editingArtist ? t('admin.artists.form.updateButton') : t('admin.artists.form.createButton')}
            </button>
            <button type="button" onClick={handleCancel} className="secondary">
              {t('admin.artists.form.cancelButton')}
            </button>
          </div>
        </form>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>{t('admin.artists.table.id')}</th>
            <th>{t('admin.artists.table.name')}</th>
            <th>{t('admin.artists.table.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {artists.map((artist) => (
            <tr key={artist.id}>
              <td>{artist.id}</td>
              <td>{artist.name}</td>
              <td>
                <div className="action-buttons">
                  <button
                    onClick={() => handleEdit(artist)}
                    className="edit"
                    disabled={isCreating || editingArtist !== null}
                  >
                    {t('admin.artists.table.editButton')}
                  </button>
                  <button
                    onClick={() => handleDeleteClick(artist.id)}
                    className="delete"
                    disabled={isCreating || editingArtist !== null}
                  >
                    {t('admin.artists.table.deleteButton')}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {artists.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-color)" }}>
          <p>{t('admin.artists.noArtists')}</p>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title={t('admin.artists.deleteConfirmTitle')}
        message={t('admin.artists.deleteConfirmMessage')}
        type="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  )
}

export default AdminArtists
