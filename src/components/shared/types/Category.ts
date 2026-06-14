import type { CategoryModel } from "../../../api/models/CategoryModel"

export interface Category {
    id: number
    name: string
    description?: string
    imageUrl: string
}

export function toCategory(dto:CategoryModel): Category {
    return {
        id: dto.id,
        name: dto.name,
        description: dto.description ?? '',
        imageUrl: dto.imageUrl ?? 'https://images.unsplash.com/photo-1491897554428-130a60dd4757?q=80&w=800&auto=format&fit=crop'
    }
}