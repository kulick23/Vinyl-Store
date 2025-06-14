"use client"

import type React from "react"
import { useState } from "react"
import {
  useGetAdminGenresQuery,
  useCreateAdminGenreMutation,
  useUpdateAdminGenreMutation,
  useDeleteAdminGenreMutation,
} from "../../redux/admin/api"
import type { AdminGenre } from "../../redux/admin/types"
import VinylSpinner from "../VinylSpinner/VinylSpinner"

const AdminGenres: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false)
  const [editingGenre, setEditingGenre] = useState<AdminGenre | null>(null)
  const [formData, setFormData] = useState({ name: "" })

  const { data: genres = [], isLoading, error } = useGetAdminGenresQuery()
  const [createGenre] = useCreateAdminGenreMutation()
  const [updateGenre] = useUpdateAdminGenreMutation()
  const [deleteGenre] = useDeleteAdminGenreMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    try {
      if (editingGenre) {
        await updateGenre({ ...editingGenre, name: formData.name }).unwrap()
        setEditingGenre(null)
      } else {
        await createGenre({ id: 0, name: formData.name }).unwrap()
        setIsCreating(false)
      }
      setFormData({ name: "" })
    } catch (error) {
      console.error("Failed to save genre:", error)
    }
  }

  const handleEdit = (genre: AdminGenre) => {
    setEditingGenre(genre)
    setFormData({ name: genre.name })
    setIsCreating(false)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this genre?")) {
      try {
        await deleteGenre(id).unwrap()
      } catch (error) {
        console.error("Failed to delete genre:", error)
      }
    }
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
        <p>Loading genres...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-message">
        <p>Failed to load genres. Please try again.</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 className="section-title">Manage Genres</h2>
        <button
          onClick={() => setIsCreating(true)}
          disabled={isCreating || editingGenre !== null}
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
          Add Genre
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
            <label htmlFor="genreName">Genre Name</label>
            <input
              type="text"
              id="genreName"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              placeholder="Enter genre name"
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="primary">
              {editingGenre ? "Update Genre" : "Create Genre"}
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
            <th>Name</th>
            <th>Actions</th>
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
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(genre.id)}
                    className="delete"
                    disabled={isCreating || editingGenre !== null}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {genres.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-color)" }}>
          <p>No genres found. Create your first genre to get started.</p>
        </div>
      )}
    </div>
  )
}

export default AdminGenres
