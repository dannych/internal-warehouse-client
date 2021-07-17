declare global {
    interface Window {
        env: any;
    }
}
export const isomorph = (buildEnv: any) => {
    return typeof window !== 'undefined' && window.env ? window.env : buildEnv;
};

export const loadEnv = (src: string) =>
    new Promise<object>((resolve) => {
        const tag = document.createElement('script');
        tag.async = false;
        tag.src = src;
        tag.onload = () => resolve(window.env);
        const head = document.getElementsByTagName('head')[0];
        head.appendChild(tag);
    });
