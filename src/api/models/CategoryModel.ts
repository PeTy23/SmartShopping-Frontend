//datele care vin de la server
export interface CategoryModel {
    id: number;
    name: string;
    description?: string;
    // imageUrl: string;
}
//datele care se trimit la server
export interface CategoryInput {
    name: string;
    description?: string;
    // imageUrl: string;
}