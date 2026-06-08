import { http } from "../base/http";
// 1. Am schimbat importul vechi cu noile tale modele
import type { ProductModel, ProductInput } from "../../api/models/ProductModel";
import { toProduct, type Product } from "../../components/shared/types/Product";

const BASE_PATH = "/products";

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
     const data = await http.get<ProductModel[]>('/products')
     return data.map(toProduct)
  },

  getById: async (id: number): Promise<ProductModel> => {
    return await http.get<ProductModel>(`${BASE_PATH}/${id}`);
  },

  // 2. SECRETUL ESTE AICI: Acum acceptă ProductInput la creare!
  create: async (data: ProductInput): Promise<Product> => {
    return toProduct(await http.post<ProductModel>('/products', data))
  },
  update: async (id: number, data: ProductInput): Promise<Product> => {
    return toProduct(await http.put<ProductModel>(`/products/${id}`, data))
  },
  remove: (id: number) => http.remove<void>(`/products/${id}`),

};