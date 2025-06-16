import type React from "react"
import AuthGuard from "../../Components/AuthGuard/AuthGuard"
import AdminPanel from "../../Components/AdminPanel/AdminPanel"

export const AdminPage: React.FC = () => {
  return (
    // Temporarily commented out admin role check - any user can access admin panel
    // <AuthGuard requiredRole="Admin">
      <AdminPanel />
    // </AuthGuard>
  )
}

export default AdminPage
