export interface SuggestionModel {
    productId: number;
    name: string;
    price: number;
    quantity: number;
    reason: string; // Motivul pentru care acest produs este sugerat (ex: "Similar cu un produs din coș", "Promoție aplicabilă", etc.)
    savings: number | null; // Economiile estimate dacă utilizatorul adaugă acest produs în coș
}

export interface AnalysisModel {
    summary: string; // Un rezumat al analizei cartului (ex: "Cartul tău conține 3 produse, totalizând 150 RON. Ai aplicat 2 promoții care au economisit 20 RON.")
    suggestions: SuggestionModel[]; // O listă de sugestii pentru utilizator, bazate pe conținutul cartului și promoțiile disponibile
}