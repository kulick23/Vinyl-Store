import type React from "react"
import AuthGuard from "../../Components/AuthGuard/AuthGuard"
import UserProfile from "../../Components/UserProfile/UserProfile"

export const ProfilePage: React.FC = () => {
  return (
    <AuthGuard>
      <UserProfile />
    </AuthGuard>
  )
}

export default ProfilePage
