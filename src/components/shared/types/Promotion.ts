import { PromotionReward, PromotionType, type PromotionModel } from "../../../api/models/PromotionModel";

export interface Promotion {
  id: number
  name: string
  type: number
  typeLabel: string
  threshold: number
  reward: number
  rewardValue: number
  rewardLabel: string
  productId: number | null
  categoryId: number | null
  isActive: boolean
  activeLabel: string
}

const typeLabels: Record<number, string> = {
  [PromotionType.Quantity]: 'Quantity',
  [PromotionType.CartTotal]: 'Cart Total',
}

const rewardLabels: Record<number, string> = {
  [PromotionReward.FreeItems]: 'Free Items',
  [PromotionReward.PercentDiscount]: 'Percent Discount',
}

export function toPromotion(dto: PromotionModel): Promotion {
  return {
    id: dto.id,
    name: dto.name,
    type: dto.type,
    typeLabel: typeLabels[dto.type] ?? 'Unknown',
    threshold: dto.threshold,
    reward: dto.reward,
    rewardValue: dto.rewardValue,
    rewardLabel: `${dto.rewardValue} ${rewardLabels[dto.reward] ?? 'Unknown'}`,
    productId: dto.productId,
    categoryId: dto.categoryId,
    isActive: dto.isActive,
    activeLabel: dto.isActive ? 'Yes' : 'No',
  }
}