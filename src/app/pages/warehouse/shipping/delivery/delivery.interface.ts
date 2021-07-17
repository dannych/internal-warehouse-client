export interface CreateSale {
    salePaperId: string;
    division: string;
    salePaperIdPrefix: string;
    saleRepresentativeCode: string;
    saleRepresentativeName: string;
    customerCode: string;
    customerName: string;
    customerPaperId: string;
    createdAt: string;
    description?: string;
    products: Array<{
        productCode: string;
        productName: string;
        productBrand: string;
        productType: string;
        quantity: number;
        price: number;
        priceTax: boolean;
        categories: string[];
        meta: string;
        tags: string[];
    }>;
}

export interface DeliveryListItem {
    _id: string;
    postId: string;
    status: string;
    customerCode: string;
    customerName: string;
    customerPaperId: string;
    representativeCode: string;
    representativeName: string;
    scannedProducts: any[];
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
    orderPriorPostId: string;
    orderPriorPaperId: string;
    receivedAt: string;
    packagedAt: string;
    createdAt: string;
    description?: string;
}

export interface PreviewTableDataSource {
    products: Array<{
        code: string;
        name: string;
        brand: string;
        type: string;
        tags: string[];
        meta: any;
        quantity: number;
        price: number;
    }>;
    validationTypes: string[];
    validations: {
        [x: string]: {
            summary: {
                result: string;
                eligibleProductCodes: string[];
                totalEligiblePrice: number;
                totalEligibleQuantity: number;
                totalEligibleCount: number;
            };
            details: {
                [productCode: string]: {
                    productCode: number;
                    quantity: number;
                    price: number;
                    result: string;
                    resultQuantity: string;
                    resultPrice: string;
                    contractProductCode: string;
                    contractProductName: string;
                    ineligibleQuantity: number;
                    eligibleQuantity: number;
                    eligiblePrice: number;
                    eligibleTotalPrice: number;
                };
            };
        };
    };
}
