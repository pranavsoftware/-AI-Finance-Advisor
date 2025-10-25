/**
 * Format currency values
 */
export const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
};
/**
 * Format date to readable format
 */
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};
/**
 * Format date to YYYY-MM-DD
 */
export const formatDateISO = (date) => {
    return date.toISOString().split('T')[0];
};
/**
 * Truncate text
 */
export const truncateText = (text, length) => {
    return text.length > length ? text.substring(0, length) + '...' : text;
};
