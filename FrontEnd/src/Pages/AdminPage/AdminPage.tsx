import type React from "react"
import AuthGuard from "../../Components/AuthGuard/AuthGuard"
import AdminPanel from "../../Components/AdminPanel/AdminPanel"

export const AdminPage: React.FC = () => {
  return (
    <AuthGuard requiredRole="Admin">
      <AdminPanel />
    </AuthGuard>
  )
}

export default AdminPage
