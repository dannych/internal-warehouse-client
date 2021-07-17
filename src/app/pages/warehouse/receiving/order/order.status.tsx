import React from 'react';

import { Badge } from 'antd';

const ORDER_STATUS_MAPPER: { [x: string]: { text: string; status?: any; color?: any } } = {
    order_created: {
        text: 'open',
        status: 'warning',
    },
    order_fulfilled: {
        text: 'done',
        status: 'success',
    },
};

const OrderStatusBadge: React.FC<{ status: string }> = ({ status }) => (
    <Badge {...ORDER_STATUS_MAPPER[status]} />
);

export default OrderStatusBadge;
