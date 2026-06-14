export interface ProductModel {
  id: number
  name: string
  description: string
  imageUrl: string
  price: number
  isInStock: boolean
  rating: number
  isOnSale: boolean
  categories: string[]
}

export interface ProductInput {
  name: string
  description: string
  imageUrl: string
  price: number
  isInStock: boolean
  rating: number
  isOnSale: boolean
  categoryIds: number[]
}