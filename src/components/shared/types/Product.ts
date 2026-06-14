import type { ProductModel } from '../../../api/models/ProductModel';

export interface Product {
  id: number
  name: string
  description: string
  imageUrl: string
  price: number
  priceLabel: string
  categories: string[]
  categoriesLabel: string
  isInStock: boolean
  rating: number
  isOnSale: boolean
}

export function toProduct(dto: ProductModel): Product {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    imageUrl: dto.imageUrl,
    price: dto.price,
    priceLabel: `${dto.price.toFixed(2)} RON`,
    categories: dto.categories,
    categoriesLabel: dto.categories.join(', '),
    isInStock: dto.isInStock ?? true, 
    rating: dto.rating ?? 0,
    isOnSale: dto.isOnSale ?? false
  }
}