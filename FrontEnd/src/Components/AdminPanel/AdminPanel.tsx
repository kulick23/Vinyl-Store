"use client"

import type React from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import { useGetCurrentUserQuery } from "../../redux/auth/api"
import {
  useGetAdminArtistsQuery,
  useGetAdminGenresQuery,
  useGetAdminReleasesQuery,
  useGetAdminSellersQuery,
  useGetAdminUsersQuery,
} from "../../redux/admin/api"
import VinylSpinner from "../VinylSpinner/VinylSpinner"
import AdminArtists from "./AdminArtists"
import AdminGenres from "./AdminGenres"
import AdminReleases from "./AdminReleases"
import AdminSellers from "./AdminSellers"
import AdminUsers from "./AdminUsers"
import "./AdminPanel.scss"

type AdminSection = "overview" | "artists" | "genres" | "releases" | "sellers" | "users"

const AdminOverview: React.FC = () => {
  const { data: artists = [] } = useGetAdminArtistsQuery()
  const { data: genres = [] } = useGetAdminGenresQuery()
  const { data: releases = [] } = useGetAdminReleasesQuery()
  const { data: sellers = [] } = useGetAdminSellersQuery()
  const { data: users = [] } = useGetAdminUsersQuery()

  return (
    <div>
      <h2 className="section-title">Admin Overview</h2>
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-number">{artists.length}</div>
          <div className="stat-label">Artists</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{genres.length}</div>
          <div className="stat-label">Genres</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{releases.length}</div>
          <div className="stat-label">Releases</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{sellers.length}</div>
          <div className="stat-label">Sellers</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{users.length}</div>
          <div className="stat-label">Users</div>
        </div>
      </div>
      <div>
        <h3>Recent Activity</h3>
        <p>Welcome to the admin panel. Use the sidebar to navigate between different sections.</p>
      </div>
    </div>
  )
}

export const AdminPanel: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { data: user, isLoading } = useGetCurrentUserQuery()

  const getCurrentSection = (): AdminSection => {
    const path = location.pathname.split("/admin/")[1] || "overview"
    return path as AdminSection
  }

  const [activeSection, setActiveSection] = useState<AdminSection>(getCurrentSection())

  const handleSectionChange = (section: AdminSection) => {
    setActiveSection(section)
    if (section === "overview") {
      navigate("/admin")
    } else {
      navigate(`/admin/${section}`)
    }
  }

  if (isLoading) {
    return (
      <div className="admin-panel">
        <div className="loading-spinner">
          <VinylSpinner size="large" />
          <p>Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!user || !user.roles.includes("Admin")) {
    return (
      <div className="admin-panel">
        <div className="error-message">
          <p>Access denied. Admin privileges required.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Admin Panel</h1>
          <p className="admin-subtitle">Manage your vinyl store</p>
        </div>
        <div>
          <p>Welcome, {user.firstName}!</p>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-sidebar">
          <div className="sidebar-section">
            <h3>Navigation</h3>
            <div className="nav-links">
              <button
                className={`nav-link ${activeSection === "overview" ? "active" : ""}`}
                onClick={() => handleSectionChange("overview")}
              >
                📊 Overview
              </button>
              <button
                className={`nav-link ${activeSection === "artists" ? "active" : ""}`}
                onClick={() => handleSectionChange("artists")}
              >
                🎤 Artists
              </button>
              <button
                className={`nav-link ${activeSection === "genres" ? "active" : ""}`}
                onClick={() => handleSectionChange("genres")}
              >
                🎵 Genres
              </button>
              <button
                className={`nav-link ${activeSection === "releases" ? "active" : ""}`}
                onClick={() => handleSectionChange("releases")}
              >
                💿 Releases
              </button>
              <button
                className={`nav-link ${activeSection === "sellers" ? "active" : ""}`}
                onClick={() => handleSectionChange("sellers")}
              >
                🏪 Sellers
              </button>
              <button
                className={`nav-link ${activeSection === "users" ? "active" : ""}`}
                onClick={() => handleSectionChange("users")}
              >
                👥 Users
              </button>
            </div>
          </div>
        </div>

        <div className="admin-main">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/artists" element={<AdminArtists />} />
            <Route path="/genres" element={<AdminGenres />} />
            <Route path="/releases" element={<AdminReleases />} />
            <Route path="/sellers" element={<AdminSellers />} />
            <Route path="/users" element={<AdminUsers />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
