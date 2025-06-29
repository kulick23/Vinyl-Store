import type React from "react"
import AuthGuard from "../../Components/AuthGuard/AuthGuard"
import SellerDashboard from "../../Components/SellerDashboard/SellerDashboard"

export const SellerPage: React.FC = () => {
  return (
    <AuthGuard>
      <SellerDashboard />
    </AuthGuard>
  )
}

export default SellerPage
