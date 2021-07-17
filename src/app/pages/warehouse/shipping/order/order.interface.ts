export interface OrderListItem {
    _id: string;
    postId: string;
    status: string;
    customerCode: string;
    customerName: string;
    customerPaperId: string;
    representativeCode: string;
    representativeName: string;
    products: Array<{
        _sid: string;
        code: string;
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
    priorPostId: string;
    priorPaperId: string;
    fullyScheduledAt: string;
    createdAt: string;
    description?: string;
}
