export interface UpdateCustomer {
    productName?: string;
    productBrand?: string;
    productCategories?: string[];
}

export interface ReadManyItems {
    _id: string;
    productPin: string;
    count: number;
    productName?: string;
    productBrand?: string;
    productCategories?: string[];
}
