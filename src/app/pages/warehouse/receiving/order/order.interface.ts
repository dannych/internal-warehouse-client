export interface OrderListItem {
    _id: string;
    postId: string;
    status: string;
    customerCode: string;
    customerName: string;
    customerPaperId: string;
    supplierCode: string;
    supplierName: string;
    representativeCode: string;
    representativeName: string;
    products: Array<{
        _sid: string;
        name: string;
        brand: string;
        type: string;
        pin: string;
        quantity: number;
        price: number;
        meta: any;
        categories: string[];
        tags: string[];
    }>;
    createdAt: string;
    description?: string;
}
