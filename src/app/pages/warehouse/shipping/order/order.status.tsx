import React from 'react';

import { Badge } from 'antd';

const ORDER_STATUS_MAPPER: { [x: string]: { text: string; status?: any; color?: any } } = {
    order_initiated: {
        text: 'open',
        status: 'warning',
    },
    order_finished: {
        text: 'done',
        status: 'success',
    },
};

const OrderStatusBadge: React.FC<{ status: string }> = ({ status }) => (
    <Badge {...ORDER_STATUS_MAPPER[status]} />
);

export default OrderStatusBadge;
