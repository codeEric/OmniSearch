export const clearReactive = (obj: Record<string, unknown>) => {
    Object.keys(obj).forEach((key) => delete obj[key]);
};
