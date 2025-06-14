"use client"

import type React from "react"
import { useState } from "react"
import { useGetAdminUsersQuery, useUpdateAdminUserMutation, useDeleteAdminUserMutation } from "../../redux/admin/api"
import type { AdminUser } from "../../redux/admin/types"
import VinylSpinner from "../VinylSpinner/VinylSpinner"

const AdminUsers: React.FC = () => {
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    isEmailConfirmed: false,
  })

  const { data: users = [], isLoading, error } = useGetAdminUsersQuery()
  const [updateUser] = useUpdateAdminUserMutation()
  const [deleteUser] = useDeleteAdminUserMutation()

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
    } catch (error) {
      console.error("Failed to update user:", error)
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

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id).unwrap()
      } catch (error) {
        console.error("Failed to delete user:", error)
      }
    }
  }

  const handleCancel = () => {
    setEditingUser(null)
    setFormData({ email: "", firstName: "", lastName: "", phone: "", isEmailConfirmed: false })
  }

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <VinylSpinner size="large" />
        <p>Loading users...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-message">
        <p>Failed to load users. Please try again.</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 className="section-title">Manage Users</h2>
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
            <label htmlFor="userEmail">Email</label>
            <input
              type="email"
              id="userEmail"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="userFirstName">First Name</label>
            <input
              type="text"
              id="userFirstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="Enter first name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="userLastName">Last Name</label>
            <input
              type="text"
              id="userLastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="Enter last name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="userPhone">Phone</label>
            <input
              type="tel"
              id="userPhone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter phone number"
            />
          </div>
          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="checkbox"
                checked={formData.isEmailConfirmed}
                onChange={(e) => setFormData({ ...formData, isEmailConfirmed: e.target.checked })}
              />
              Email Confirmed
            </label>
          </div>
          <div className="form-actions">
            <button type="submit" className="primary">
              Update User
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
            <th>Email</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email Confirmed</th>
            <th>Last Login</th>
            <th>Actions</th>
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
              <td>{user.phone || "N/A"}</td>
              <td>{user.isEmailConfirmed ? "✅" : "❌"}</td>
              <td>{new Date(user.lastLoginAt).toLocaleDateString()}</td>
              <td>
                <div className="action-buttons">
                  <button onClick={() => handleEdit(user)} className="edit" disabled={editingUser !== null}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(user.id)} className="delete" disabled={editingUser !== null}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-color)" }}>
          <p>No users found.</p>
        </div>
      )}
    </div>
  )
}

export default AdminUsers
