import { toCategory, type Category } from "../../components/shared/types/Category";
import { http } from "../base/http";
import { type CategoryModel, type CategoryInput } from "../models/CategoryModel";

// componenta -> categoriesApi -> http -> server
export const categoriesApi = {
    getAll: async (): Promise<Category[]> => {
        const data = await http.get<CategoryModel[]>('/categories');
        return data.map(toCategory);
    },
    getById: async (id: number): Promise<Category> => {
        const data = await http.get<CategoryModel>(`/categories/${id}`);
        return toCategory(data);
    },
    create: async (data: CategoryInput): Promise<Category> => {
        return toCategory(await http.post<CategoryModel>('/categories', data));
    },
    update: async (id:number, data: CategoryInput): Promise<Category> => {
        return toCategory(await http.put<CategoryModel>(`/categories/${id}`, data));
    },
    remove: (id: number) => http.remove<void>(`/categories/${id}`)
}