"use client"

import type React from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useGetCurrentUserQuery } from "../../redux/auth/api"
import VinylSpinner from "../VinylSpinner/VinylSpinner"
import type { UserRole } from "../../redux/auth/types"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: UserRole
  redirectTo?: string
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRole, redirectTo = "/login" }) => {
  const navigate = useNavigate()
  const { data: user, isLoading, error } = useGetCurrentUserQuery()

  useEffect(() => {
    const token = localStorage.getItem("accessToken")

    if (!token || error) {
      navigate(redirectTo)
      return
    }

    if (user && requiredRole && user.role !== requiredRole) {
      navigate("/")
      return
    }
  }, [user, error, requiredRole, navigate, redirectTo])

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <VinylSpinner size="large" />
      </div>
    )
  }

  if (!user || (requiredRole && user.role !== requiredRole)) {
    return null
  }

  return <>{children}</>
}

export default AuthGuard
