import { parse, stringify } from 'qs';
import { useCallback } from 'react';
import { useHistory as useHistoryRouter } from 'react-router-dom';

interface LocationDescriptor {
    search?: { [x: string]: any };
    state?: { [x: string]: any };
    hash?: string;
    key?: string;
}

interface Option {
    withState?: boolean;
    withSearch?: boolean;
}

export const useHistory = <State = unknown>() => {
    const { push, replace, location, ...fn } = useHistoryRouter<State>();

    const search = parse(location.search, { ignoreQueryPrefix: true }) || {};

    const createSearch = (search?: { [x: string]: any }) =>
        stringify(search || {}, { addQueryPrefix: true }) || undefined;
    const createLocationDescriptor = useCallback(
        (pathname: string, locationDescriptor?: LocationDescriptor, option?: Option) =>
            ({
                hash: locationDescriptor?.hash,
                key: locationDescriptor?.key,
                pathname,
                search: option?.withSearch
                    ? createSearch({
                          ...search,
                          ...(locationDescriptor?.search || {}),
                      })
                    : createSearch(locationDescriptor?.search),
                state: option?.withState
                    ? { ...location.state, ...locationDescriptor?.state }
                    : locationDescriptor?.state,
            } as any),
        [search, location.state]
    );

    const xPush = useCallback(
        (pathname: string, locationDescriptor?: LocationDescriptor, option?: Option) =>
            push(createLocationDescriptor(pathname, locationDescriptor, option)),
        [push, createLocationDescriptor]
    );

    const xReplace = useCallback(
        (pathname: string, locationDescriptor?: LocationDescriptor, option?: Option) =>
            replace(createLocationDescriptor(pathname, locationDescriptor, option)),
        [replace, createLocationDescriptor]
    );

    const href = useCallback(
        (url: string, params?: any) =>
            (window.location.href = `${url}${stringify(params, { addQueryPrefix: true })}`),
        []
    );

    return {
        ...fn,
        search,
        location,
        push: xPush,
        replace: xReplace,
        href,
    };
};
