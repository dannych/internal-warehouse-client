export const CURRENCY = {
    IDR: 'IDR',
};

const formatter = (value: number | string, prefix = CURRENCY.IDR) =>
    `${prefix ? prefix + ' ' : ''}${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export default formatter;
