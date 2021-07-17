const debounce = (callback: (...params: any[]) => void, delay = 350) => {
    let timeoutId: any;
    return (...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            timeoutId = null;
            callback(...args);
        }, delay);
    };
};

export default debounce;
