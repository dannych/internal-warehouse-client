import React from 'react';

import { Autocomplete } from './autocomplete.component';

export const AutocompleteSupplier: React.FC<{ form: any } & any> = ({ form, ...props }) => (
    <Autocomplete
        form={form}
        namePrefix='supplierSender'
        apiPath='/suppliers/search'
        allowClear={true}
        {...props}
    />
);
