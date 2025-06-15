"use client"

import type React from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  useGetAdminGenresQuery,
  useCreateAdminGenreMutation,
  useUpdateAdminGenreMutation,
  useDeleteAdminGenreMutation,
} from "../../redux/admin/api"
import type { AdminGenre } from "../../redux/admin/types"
import VinylSpinner from "../VinylSpinner/VinylSpinner"
import { ConfirmDialog } from "../ConfirmDialog/ConfirmDialog"
import { useNotification } from "../../hooks/useNotification"

const AdminGenres: React.FC = () => {
  const { t } = useTranslation()
  const [isCreating, setIsCreating] = useState(false)
  const [editingGenre, setEditingGenre] = useState<AdminGenre | null>(null)
  const [formData, setFormData] = useState({ name: "" })
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [genreToDelete, setGenreToDelete] = useState<number | null>(null)

  const { data: genres = [], isLoading, error } = useGetAdminGenresQuery()
  const [createGenre] = useCreateAdminGenreMutation()
  const [updateGenre] = useUpdateAdminGenreMutation()
  const [deleteGenre] = useDeleteAdminGenreMutation()
  const { showSuccess, showError } = useNotification()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    try {
      if (editingGenre) {
        await updateGenre({ ...editingGenre, name: formData.name }).unwrap()
        setEditingGenre(null)
        showSuccess(t('admin.genres.updateSuccess'))
      } else {
        await createGenre({ id: 0, name: formData.name }).unwrap()
        setIsCreating(false)
        showSuccess(t('admin.genres.createSuccess'))
      }
      setFormData({ name: "" })
    } catch (error) {
      console.error("Failed to save genre:", error)
      showError(t('admin.genres.saveError'))
    }
  }

  const handleEdit = (genre: AdminGenre) => {
    setEditingGenre(genre)
    setFormData({ name: genre.name })
    setIsCreating(false)
  }

  const handleDeleteClick = (id: number) => {
    setGenreToDelete(id)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    if (genreToDelete) {
      try {
        await deleteGenre(genreToDelete).unwrap()
        setShowDeleteDialog(false)
        setGenreToDelete(null)
        showSuccess(t('admin.genres.deleteSuccess'))
      } catch (error) {
        console.error("Failed to delete genre:", error)
        showError(t('admin.genres.deleteError'))
      }
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false)
    setGenreToDelete(null)
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingGenre(null)
    setFormData({ name: "" })
  }

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <VinylSpinner size="large" />
        <p>{t('admin.genres.loading')}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{t('admin.genres.loadError')}</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 className="section-title">{t('admin.genres.title')}</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="primary"
          disabled={isCreating || editingGenre !== null}
        >
          {t('admin.genres.form.createButton')}
        </button>
      </div>

      {(isCreating || editingGenre) && (
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
            <label htmlFor="genreName">{t('admin.genres.form.name')}</label>
            <input
              type="text"
              id="genreName"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              placeholder={t('admin.genres.form.namePlaceholder')}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="primary">
              {editingGenre ? t('admin.genres.form.updateButton') : t('admin.genres.form.createButton')}
            </button>
            <button type="button" onClick={handleCancel} className="secondary">
              {t('admin.genres.form.cancelButton')}
            </button>
          </div>
        </form>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>{t('admin.genres.table.id')}</th>
            <th>{t('admin.genres.table.name')}</th>
            <th>{t('admin.genres.table.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {genres.map((genre) => (
            <tr key={genre.id}>
              <td>{genre.id}</td>
              <td>{genre.name}</td>
              <td>
                <div className="action-buttons">
                  <button
                    onClick={() => handleEdit(genre)}
                    className="edit"
                    disabled={isCreating || editingGenre !== null}
                  >
                    {t('admin.genres.table.editButton')}
                  </button>
                  <button
                    onClick={() => handleDeleteClick(genre.id)}
                    className="delete"
                    disabled={isCreating || editingGenre !== null}
                  >
                    {t('admin.genres.table.deleteButton')}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {genres.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-color)" }}>
          <p>{t('admin.genres.noGenres')}</p>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title={t('admin.genres.deleteConfirmTitle')}
        message={t('admin.genres.deleteConfirmMessage')}
        type="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  )
}

export default AdminGenres
