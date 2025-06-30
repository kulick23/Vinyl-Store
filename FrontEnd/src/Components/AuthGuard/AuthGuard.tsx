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

  // Debug information (can be removed in production)
  useEffect(() => {
    console.log('AuthGuard Debug:', {
      user,
      requiredRole,
      userRole: user?.role,
      hasToken: !!localStorage.getItem('accessToken'),
      error
    })
  }, [user, requiredRole, error])

  useEffect(() => {
    const token = localStorage.getItem("accessToken")

    if (!token || error) {
      console.log('AuthGuard: No token or error, redirecting to:', redirectTo)
      navigate(redirectTo)
      return
    }

    if (user && requiredRole && user.role !== requiredRole) {
      console.log(`AuthGuard: Role mismatch. Required: ${requiredRole}, User has: ${user.role}`)
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
