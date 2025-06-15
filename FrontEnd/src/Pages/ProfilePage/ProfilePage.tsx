import type React from "react"
import AuthGuard from "../../Components/AuthGuard/AuthGuard"
import UserProfile from "../../Components/UserProfile/UserProfile"
import "./ProfilePage.scss"

export const ProfilePage: React.FC = () => {
  return (
    <div className="profile-page">
      <AuthGuard>
        <UserProfile />
      </AuthGuard>
    </div>
  )
}

export default ProfilePage
