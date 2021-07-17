import React from 'react';

import priceFormatter from 'src/app/helper/format/price';

const Price: React.FC<{ value: number; prefix?: string; tax?: boolean }> = ({
    value,
    prefix = 'IDR',
    tax,
}) => (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>
            {prefix}
            {tax && '+'}
        </span>
        <span>{priceFormatter(value, '')}</span>
    </div>
);

export default Price;
