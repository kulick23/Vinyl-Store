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
  const { t } = useTranslation()
  const { data: artists = [] } = useGetAdminArtistsQuery()
  const { data: genres = [] } = useGetAdminGenresQuery()
  const { data: releases = [] } = useGetAdminReleasesQuery()
  const { data: sellers = [] } = useGetAdminSellersQuery()
  const { data: users = [] } = useGetAdminUsersQuery()

  return (
    <div>
      <h2 className="section-title">{t('admin.overview.title')}</h2>
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-number">{artists.length}</div>
          <div className="stat-label">{t('admin.overview.artists')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{genres.length}</div>
          <div className="stat-label">{t('admin.overview.genres')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{releases.length}</div>
          <div className="stat-label">{t('admin.overview.releases')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{sellers.length}</div>
          <div className="stat-label">{t('admin.overview.sellers')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{users.length}</div>
          <div className="stat-label">{t('admin.overview.users')}</div>
        </div>
      </div>
      <div>
        <h3>{t('admin.overview.recentActivity')}</h3>
        <p>{t('admin.overview.welcomeMessage')}</p>
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
          <p>{t('admin.panel.loading')}</p>
        </div>
      </div>
    )
  }

  // Temporarily commented out admin role check - any user can access admin panel
  // if (!user || !user.roles.includes("Admin")) {
  //   return (
  //     <div className="admin-panel">
  //       <div className="error-message">
  //         <p>{t('admin.panel.accessDenied')}</p>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">{t('admin.panel.title')}</h1>
          <p className="admin-subtitle">{t('admin.panel.subtitle')}</p>
        </div>
        <div>
          <p>{t('admin.panel.welcome', { name: user.firstName })}</p>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-sidebar">
          <div className="sidebar-section">
            <h3>{t('admin.panel.navigation')}</h3>
            <div className="nav-links">
              <button
                className={`nav-link ${activeSection === "overview" ? "active" : ""}`}
                onClick={() => handleSectionChange("overview")}
              >
                📊 {t('admin.overview.title')}
              </button>
              <button
                className={`nav-link ${activeSection === "artists" ? "active" : ""}`}
                onClick={() => handleSectionChange("artists")}
              >
                🎤 {t('admin.overview.artists')}
              </button>
              <button
                className={`nav-link ${activeSection === "genres" ? "active" : ""}`}
                onClick={() => handleSectionChange("genres")}
              >
                🎵 {t('admin.overview.genres')}
              </button>
              <button
                className={`nav-link ${activeSection === "releases" ? "active" : ""}`}
                onClick={() => handleSectionChange("releases")}
              >
                💿 {t('admin.overview.releases')}
              </button>
              <button
                className={`nav-link ${activeSection === "sellers" ? "active" : ""}`}
                onClick={() => handleSectionChange("sellers")}
              >
                🏪 {t('admin.overview.sellers')}
              </button>
              <button
                className={`nav-link ${activeSection === "users" ? "active" : ""}`}
                onClick={() => handleSectionChange("users")}
              >
                👥 {t('admin.overview.users')}
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
