export const hasAccess = (
    account: { permissions: { [x: string]: number } },
    ...access: string[]
) => {
    return !!account && access.every((acc) => !!account.permissions[acc]);
};
