"use client"

import type React from "react"
import { useState } from "react"
import {
  useGetAdminReleasesQuery,
  useCreateAdminReleaseMutation,
  useUpdateAdminReleaseMutation,
  useDeleteAdminReleaseMutation,
} from "../../redux/admin/api"
import { useGetAdminArtistsQuery, useGetAdminGenresQuery } from "../../redux/admin/api"
import type { AdminRelease } from "../../redux/admin/types"
import VinylSpinner from "../VinylSpinner/VinylSpinner"

const AdminReleases: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false)
  const [editingRelease, setEditingRelease] = useState<AdminRelease | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    year: new Date().getFullYear(),
    artist: "",
    genre: "",
  })

  const { data: releases = [], isLoading, error } = useGetAdminReleasesQuery()
  const { data: artists = [] } = useGetAdminArtistsQuery()
  const { data: genres = [] } = useGetAdminGenresQuery()
  const [createRelease] = useCreateAdminReleaseMutation()
  const [updateRelease] = useUpdateAdminReleaseMutation()
  const [deleteRelease] = useDeleteAdminReleaseMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.artist || !formData.genre) return

    try {
      const releaseData = {
        id: editingRelease?.id || 0,
        title: formData.title,
        year: formData.year,
        artist: formData.artist,
        genre: formData.genre,
      }

      if (editingRelease) {
        await updateRelease(releaseData).unwrap()
        setEditingRelease(null)
      } else {
        await createRelease(releaseData).unwrap()
        setIsCreating(false)
      }
      setFormData({ title: "", year: new Date().getFullYear(), artist: "", genre: "" })
    } catch (error) {
      console.error("Failed to save release:", error)
    }
  }

  const handleEdit = (release: AdminRelease) => {
    setEditingRelease(release)
    setFormData({
      title: release.title,
      year: release.year,
      artist: release.artist,
      genre: release.genre,
    })
    setIsCreating(false)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this release?")) {
      try {
        await deleteRelease(id).unwrap()
      } catch (error) {
        console.error("Failed to delete release:", error)
      }
    }
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingRelease(null)
    setFormData({ title: "", year: new Date().getFullYear(), artist: "", genre: "" })
  }

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <VinylSpinner size="large" />
        <p>Loading releases...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-message">
        <p>Failed to load releases. Please try again.</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 className="section-title">Manage Releases</h2>
        <button
          onClick={() => setIsCreating(true)}
          disabled={isCreating || editingRelease !== null}
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
          Add Release
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
            <label htmlFor="releaseTitle">Title</label>
            <input
              type="text"
              id="releaseTitle"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter release title"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="releaseYear">Year</label>
            <input
              type="number"
              id="releaseYear"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
              min="1900"
              max={new Date().getFullYear() + 1}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="releaseArtist">Artist</label>
            <select
              id="releaseArtist"
              value={formData.artist}
              onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
              required
            >
              <option value="">Select an artist</option>
              {artists.map((artist) => (
                <option key={artist.id} value={artist.name}>
                  {artist.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="releaseGenre">Genre</label>
            <select
              id="releaseGenre"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              required
            >
              <option value="">Select a genre</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.name}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="primary">
              {editingRelease ? "Update Release" : "Create Release"}
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
            <th>Title</th>
            <th>Artist</th>
            <th>Genre</th>
            <th>Year</th>
            <th>Actions</th>
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
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(release.id)}
                    className="delete"
                    disabled={isCreating || editingRelease !== null}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {releases.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-color)" }}>
          <p>No releases found. Create your first release to get started.</p>
        </div>
      )}
    </div>
  )
}

export default AdminReleases
