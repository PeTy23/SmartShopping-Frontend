// Datele care VIN de la server (citire)
export const PromotionType = {
  Quantity: 0,
  CartTotal: 1,
} as const

export const PromotionReward = {
  FreeItems: 0,
  PercentDiscount: 1,
} as const


export interface PromotionModel {
    id: number;
    name: string;
    type: number;          // Probabil un Enum (ex: 0 = BuyXGetY, 1 = PercentageDiscount)
    threshold: number;     // Pragul necesar pentru activare (ex: 5 bucăți)
    reward: number;        // Tipul de recompensă (probabil tot un Enum)
    rewardValue: number;   // Valoarea recompensei (ex: 1 bucată gratuită)
    productId: number | null;  // Poate fi null dacă promoția se aplică pe o categorie
    categoryId: number | null; // Poate fi null dacă promoția se aplică pe un produs
    isActive: boolean;     // Promoția este pornită sau oprită
}

// Datele care PLEACĂ spre server (creare/editare)
export interface PromotionInput {
    name: string;
    type: number;
    threshold: number;
    reward: number;
    rewardValue: number;
    productId: number | null;
    categoryId: number | null;
    isActive: boolean;
}