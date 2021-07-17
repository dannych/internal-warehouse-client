import React from 'react';

import { Redirect, Route, Switch } from 'src/core/navigation/lib/route';

import Account from 'src/app/pages/account/account.page';
import Home from 'src/app/pages/home/home.page';
import Driver from 'src/app/pages/library/pages/driver/driver.page';
import Library from 'src/app/pages/library/library.page';
import StorageInventory from 'src/app/pages/warehouse/storage/inventory/inventory.page';
import StorageRegistry from 'src/app/pages/warehouse/storage/registry/inventory.page';
import StorageArrangement from 'src/app/pages/warehouse/storage/arrangement/inventory.page';
import ReceivingDelivery from 'src/app/pages/warehouse/receiving/delivery/delivery.page';
import ReceivingOrder from 'src/app/pages/warehouse/receiving/order/order.page';
import ShippingDelivery from 'src/app/pages/warehouse/shipping/delivery/delivery.page';
import ShippingOrder from 'src/app/pages/warehouse/shipping/order/order.page';

export default () => (
    <Switch>
        <Route exact={true} path='/' component={Home} />
        <Route exact={true} path='/account' component={Account} />
        <Route exact={true} path='/library' component={Library} />
        <Route exact={true} path='/library/driver' component={Driver} />
        <Redirect exact={true} path='/receiving' to='/receiving/order' />
        <Route exact={true} path='/receiving/order' component={ReceivingOrder} />
        <Route exact={true} path='/receiving/delivery' component={ReceivingDelivery} />
        <Redirect exact={true} path='/shipping' to='/shipping/order' />
        <Route exact={true} path='/shipping/order' component={ShippingOrder} />
        <Route exact={true} path='/shipping/delivery' component={ShippingDelivery} />
        <Redirect exact={true} path='/storage' to='/storage/inventory' />
        <Route exact={true} path='/storage/inventory' component={StorageInventory} />
        <Route exact={true} path='/storage/registry' component={StorageRegistry} />
        <Route exact={true} path='/storage/arrangement' component={StorageArrangement} />
        <Redirect to='/' />
    </Switch>
);
