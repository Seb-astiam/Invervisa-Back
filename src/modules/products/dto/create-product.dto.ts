export class CreateProductDto {
    name: string;
    description: string;
    price: number;
    stock: number;
    discount?: number;
    brand: string;
    imageUrl?: string;
    categoryId: string;
}
