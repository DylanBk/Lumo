export const capitalise = (word: string) : string => {
    return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
};

export const dateToReadable = (date: Date) : string => {
    return date.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};