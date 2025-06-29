export interface ReviewDto {
  id: number
  sellerId: number
  customerId: number
  rating: number
  comment: string
  created: string
  customer?: {
    id: number
    firstName: string
    lastName: string
  }
}

export interface ReviewCreateDto {
  sellerId: number
  rating: number
  comment: string
} 