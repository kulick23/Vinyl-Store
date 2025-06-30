export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface GoogleAuthRequest {
  idToken: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  accessExpiresAt: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  isEmailConfirmed: boolean
  role?: UserRole
  lastLoginAt: string
  createdAt: string
  avatarPath?: string
}

export type UserRole = "Admin" | "Seller" | "Customer" | "User"

export interface WishlistItem {
  id: number
  title: string
  artist: string
  imageUrl?: string
  year: number
  genre: string
}
