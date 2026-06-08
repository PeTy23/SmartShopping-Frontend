import type { CartModel } from "../../../api/models/CartModel";

function money(value: number): string {
  return `${value.toFixed(2)} RON`
}

export interface CartItem {
  id: number
  productId: number
  productName: string
  unitPrice: number
  unitPriceLabel: string
  quantity: number
  subtotal: number
  subtotalLabel: string
}

export interface AppliedPromotion {
  promotionId: number
  promotionName: string
  discount: number
  discountLabel: string
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  subtotalLabel: string
  appliedPromotions: AppliedPromotion[]
  totalDiscount: number
  totalDiscountLabel: string
  total: number
  totalLabel: string
  itemCount: number
}

export function toCartModel(dto: CartModel): Cart {
  // Dacă dto.items e null, folosim un array gol [] ca să nu crape .map()
  const safeItems = dto.items || []; 
  // La fel și pentru promoții
  const safePromotions = dto.appliedPromotions || [];

  return {
    items: safeItems.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      unitPrice: item.unitPrice,
      unitPriceLabel: money(item.unitPrice),
      quantity: item.quantity,
      subtotal: item.subtotal,
      subtotalLabel: money(item.subtotal),
    })),
    subtotal: dto.subtotal,
    subtotalLabel: money(dto.subtotal),
    appliedPromotions: safePromotions.map((promotion) => ({
      promotionId: promotion.promotionId,
      promotionName: promotion.promotionName,
      discount: promotion.discount,
      discountLabel: money(promotion.discount),
    })),
    totalDiscount: dto.totalDiscount,
    totalDiscountLabel: money(dto.totalDiscount),
    total: dto.total,
    totalLabel: money(dto.total),
    itemCount: safeItems.reduce((sum, item) => sum + item.quantity, 0),
  }
}