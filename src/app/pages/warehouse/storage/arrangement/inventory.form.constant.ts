export default {
    _id: {
        dataIndex: '_id',
        label: 'PIN',
        placeholder: 'Product ID',
    },
    pin: {
        dataIndex: 'pin',
        label: 'PIN',
        placeholder: 'Product ID',
    },
    name: {
        dataIndex: 'productName',
        label: 'Name',
        placeholder: 'Product name',
    },
    brand: {
        dataIndex: 'productBrand',
        label: 'Brand',
        placeholder: 'Product brand',
    },
    categories: {
        dataIndex: 'productCategories',
        label: 'Categories',
        placeholder: 'Product categories',
    },
};

export const BRAND_LIST = ['acer', 'apc', 'aruba', 'asus', 'cisco', 'dell', 'hp', 'lenovo'];

export const CATEGORY_LIST = [
    'desktop',
    'keyboard',
    'mini desktop',
    'mouse',
    'notebook',
    'printer',
    'toner',
];

export const CATEGORY_AUTOCOMPLETE = CATEGORY_LIST.map((x) => ({ label: x, value: x }));
