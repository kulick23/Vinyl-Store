"use client"

import type React from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  useGetAdminReleasesQuery,
  useCreateAdminReleaseMutation,
  useUpdateAdminReleaseMutation,
  useDeleteAdminReleaseMutation,
  useUploadReleaseImageMutation,
} from "../../redux/admin/api"
import { useGetAdminArtistsQuery, useGetAdminGenresQuery } from "../../redux/admin/api"
import type { AdminRelease } from "../../redux/admin/types"
import VinylSpinner from "../VinylSpinner/VinylSpinner"
import { ConfirmDialog } from "../ConfirmDialog/ConfirmDialog"
import { useNotification } from "../../hooks/useNotification"

const AdminReleases: React.FC = () => {
  const { t } = useTranslation()
  const [isCreating, setIsCreating] = useState(false)
  const [editingRelease, setEditingRelease] = useState<AdminRelease | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    year: new Date().getFullYear(),
    artistId: 0,
    genreId: 0,
    imageFile: null as File | null,
    imageUrl: "",
  })
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [releaseToDelete, setReleaseToDelete] = useState<number | null>(null)

  const { data: releases = [], isLoading, error } = useGetAdminReleasesQuery()
  const { data: artists = [] } = useGetAdminArtistsQuery()
  const { data: genres = [] } = useGetAdminGenresQuery()
  const [createRelease] = useCreateAdminReleaseMutation()
  const [updateRelease] = useUpdateAdminReleaseMutation()
  const [deleteRelease] = useDeleteAdminReleaseMutation()
  const [uploadImage] = useUploadReleaseImageMutation()
  const { showSuccess, showError } = useNotification()

  const resetForm = () => {
    setFormData({ title: "", year: new Date().getFullYear(), artistId: 0, genreId: 0, imageFile: null, imageUrl: "" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.artistId || !formData.genreId) return

    try {
      let releaseId: number
      
      if (editingRelease) {
        await updateRelease({
          id: editingRelease.id,
          data: {
            title: formData.title,
            year: formData.year,
            artistId: formData.artistId,
            genreId: formData.genreId,
          }
        }).unwrap()
        releaseId = editingRelease.id
        setEditingRelease(null)
        showSuccess(t('admin.releases.updateSuccess'))
      } else {
        const result = await createRelease({
          title: formData.title,
          year: formData.year,
          artistId: formData.artistId,
          genreId: formData.genreId,
        }).unwrap()
        releaseId = result.id
        setIsCreating(false)
        showSuccess(t('admin.releases.createSuccess'))
      }
      
      // Upload image if provided
      if (formData.imageFile) {
        try {
          await uploadImage({ releaseId, imageFile: formData.imageFile }).unwrap()
          showSuccess(t('admin.releases.imageUploadSuccess'))
        } catch (imageError) {
          console.error("Failed to upload image:", imageError)
          showError(t('admin.releases.imageUploadError'))
        }
      }
      
      resetForm()
    } catch (error) {
      console.error("Failed to save release:", error)
      showError(t('admin.releases.saveError'))
    }
  }

  const handleEdit = (release: AdminRelease) => {
    setEditingRelease(release)
    // Find the artist and genre IDs from the name strings
    const artist = artists.find(a => a.name === release.artist)
    const genre = genres.find(g => g.name === release.genre)
    
    setFormData({
      title: release.title,
      year: release.year,
      artistId: artist?.id || 0,
      genreId: genre?.id || 0,
      imageFile: null,
      imageUrl: release.imageUrl,
    })
    setIsCreating(false)
  }

  const handleDeleteClick = (id: number) => {
    setReleaseToDelete(id)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    if (releaseToDelete) {
      try {
        await deleteRelease(releaseToDelete).unwrap()
        setShowDeleteDialog(false)
        setReleaseToDelete(null)
        showSuccess(t('admin.releases.deleteSuccess'))
      } catch (error) {
        console.error("Failed to delete release:", error)
        showError(t('admin.releases.deleteError'))
      }
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false)
    setReleaseToDelete(null)
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingRelease(null)
    resetForm()
  }

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <VinylSpinner size="large" />
        <p>{t('admin.releases.loading')}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{t('admin.releases.loadError')}</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 className="section-title">{t('admin.releases.title')}</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="primary"
          disabled={isCreating || editingRelease !== null}
        >
          {t('admin.releases.form.createButton')}
        </button>
      </div>

      {(isCreating || editingRelease) && (
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
            <label htmlFor="releaseTitle">{t('admin.releases.form.title')}</label>
            <input
              type="text"
              id="releaseTitle"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={t('admin.releases.form.titlePlaceholder')}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="releaseYear">{t('admin.releases.form.year')}</label>
            <input
              type="number"
              id="releaseYear"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
              placeholder={t('admin.releases.form.yearPlaceholder')}
              min="1900"
              max={new Date().getFullYear() + 1}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="releaseArtist">{t('admin.releases.form.artist')}</label>
            <select
              id="releaseArtist"
              value={formData.artistId || ""}
              onChange={(e) => setFormData({ ...formData, artistId: Number(e.target.value) })}
              required
            >
              <option value="">{t('admin.releases.form.artistPlaceholder')}</option>
              {artists.map((artist) => (
                <option key={artist.id} value={artist.id}>{artist.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="releaseGenre">{t('admin.releases.form.genre')}</label>
            <select
              id="releaseGenre"
              value={formData.genreId || ""}
              onChange={(e) => setFormData({ ...formData, genreId: Number(e.target.value) })}
              required
            >
              <option value="">{t('admin.releases.form.genrePlaceholder')}</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>{genre.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="releaseImage">{t('admin.releases.form.image')}</label>
            <input
              type="file"
              id="releaseImage"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                setFormData({ ...formData, imageFile: file || null })
              }}
            />
            {formData.imageUrl && (
              <div className="current-image">
                <p>Current image:</p>
                <img src={formData.imageUrl} alt="Release cover" style={{ maxWidth: "200px", maxHeight: "200px" }} />
              </div>
            )}
          </div>
          <div className="form-actions">
            <button type="submit" className="primary">
              {editingRelease ? t('admin.releases.form.updateButton') : t('admin.releases.form.createButton')}
            </button>
            <button type="button" onClick={handleCancel} className="secondary">
              {t('admin.releases.form.cancelButton')}
            </button>
          </div>
        </form>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>{t('admin.releases.table.id')}</th>
            <th>{t('admin.releases.table.title')}</th>
            <th>{t('admin.releases.table.artist')}</th>
            <th>{t('admin.releases.table.genre')}</th>
            <th>{t('admin.releases.table.year')}</th>
            <th>{t('admin.releases.table.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {releases.map((release) => (
            <tr key={release.id}>
              <td>{release.id}</td>
              <td>{release.title}</td>
              <td>{release.artist}</td>
              <td>{release.genre}</td>
              <td>{release.year}</td>
              <td>
                <div className="action-buttons">
                  <button
                    onClick={() => handleEdit(release)}
                    className="edit"
                    disabled={isCreating || editingRelease !== null}
                  >
                    {t('admin.releases.table.editButton')}
                  </button>
                  <button
                    onClick={() => handleDeleteClick(release.id)}
                    className="delete"
                    disabled={isCreating || editingRelease !== null}
                  >
                    {t('admin.releases.table.deleteButton')}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {releases.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-color)" }}>
          <p>{t('admin.releases.noReleases')}</p>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title={t('admin.releases.deleteConfirmTitle')}
        message={t('admin.releases.deleteConfirmMessage')}
        type="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  )
}

export default AdminReleases
