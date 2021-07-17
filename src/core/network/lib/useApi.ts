import { useFetch } from 'use-http';

export const useApi = (path: string) => {
    return useFetch(`${path}`);
};
