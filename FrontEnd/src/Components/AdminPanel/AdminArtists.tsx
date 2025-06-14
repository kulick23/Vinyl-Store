"use client"

import type React from "react"
import { useState } from "react"
import {
  useGetAdminArtistsQuery,
  useCreateAdminArtistMutation,
  useUpdateAdminArtistMutation,
  useDeleteAdminArtistMutation,
} from "../../redux/admin/api"
import type { AdminArtist } from "../../redux/admin/types"
import VinylSpinner from "../VinylSpinner/VinylSpinner"

const AdminArtists: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false)
  const [editingArtist, setEditingArtist] = useState<AdminArtist | null>(null)
  const [formData, setFormData] = useState({ name: "" })

  const { data: artists = [], isLoading, error } = useGetAdminArtistsQuery()
  const [createArtist] = useCreateAdminArtistMutation()
  const [updateArtist] = useUpdateAdminArtistMutation()
  const [deleteArtist] = useDeleteAdminArtistMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    try {
      if (editingArtist) {
        await updateArtist({ ...editingArtist, name: formData.name }).unwrap()
        setEditingArtist(null)
      } else {
        await createArtist({ id: 0, name: formData.name }).unwrap()
        setIsCreating(false)
      }
      setFormData({ name: "" })
    } catch (error) {
      console.error("Failed to save artist:", error)
    }
  }

  const handleEdit = (artist: AdminArtist) => {
    setEditingArtist(artist)
    setFormData({ name: artist.name })
    setIsCreating(false)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this artist?")) {
      try {
        await deleteArtist(id).unwrap()
      } catch (error) {
        console.error("Failed to delete artist:", error)
      }
    }
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
        <p>Loading artists...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-message">
        <p>Failed to load artists. Please try again.</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 className="section-title">Manage Artists</h2>
        <button
          onClick={() => setIsCreating(true)}
          disabled={isCreating || editingArtist !== null}
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
          Add Artist
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
            <label htmlFor="artistName">Artist Name</label>
            <input
              type="text"
              id="artistName"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              placeholder="Enter artist name"
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="primary">
              {editingArtist ? "Update Artist" : "Create Artist"}
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
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(artist.id)}
                    className="delete"
                    disabled={isCreating || editingArtist !== null}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {artists.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-color)" }}>
          <p>No artists found. Create your first artist to get started.</p>
        </div>
      )}
    </div>
  )
}

export default AdminArtists
