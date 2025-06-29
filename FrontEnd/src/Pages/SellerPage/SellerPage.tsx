import type React from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useGetCurrentUserQuery } from "../../redux/auth/api"
import { useGetCurrentSellerProfileQuery } from "../../redux/seller/api"
import AuthGuard from "../../Components/AuthGuard/AuthGuard"
import SellerDashboard from "../../Components/SellerDashboard/SellerDashboard"
import VinylSpinner from "../../Components/VinylSpinner/VinylSpinner"

export const SellerPage: React.FC = () => {
  const navigate = useNavigate()
  const { data: user, isLoading: isUserLoading } = useGetCurrentUserQuery()
  const { data: sellerProfile, isLoading: isSellerLoading } = useGetCurrentSellerProfileQuery(undefined, {
    skip: !user,
  })

  const isLoading = isUserLoading || isSellerLoading

  useEffect(() => {
    // Redirect if not logged in
    if (!isLoading && !user) {
      navigate("/login")
      return
    }

    // Redirect to profile if no seller profile
    if (!isLoading && user && sellerProfile === null) {
      navigate("/profile")
      return
    }
  }, [user, sellerProfile, isLoading, navigate])

  if (isLoading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "400px",
      }}>
        <VinylSpinner size="large" />
      </div>
    )
  }

  // Only render if user is logged in and has a seller profile
  if (!user || sellerProfile === null) {
    return null
  }

  return (
    <AuthGuard>
      <SellerDashboard />
    </AuthGuard>
  )
}

export default SellerPage
