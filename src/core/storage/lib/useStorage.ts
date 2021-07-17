export const useStorage = <Value = unknown>(namespace: string) => {
    const value = JSON.parse(localStorage.getItem(namespace) || '{ "value": {} }').value as Value;
    const setValue = (value: Value) =>
        localStorage.setItem(namespace, JSON.stringify({ value })) as void;
    return [value, setValue] as [Value, typeof setValue];
};
