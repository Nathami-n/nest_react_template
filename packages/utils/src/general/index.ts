
/**
 * Formats a given number into a specific currency string representation.
 * 
 * @param amount - The numerical amount to format.
 * @param currency - The 3-letter currency code (e.g. KES, USD, EUR). Defaults to KES.
 * @param locale - The locale string (e.g. en-KE, en-US). Defaults to en-KE.
 * @returns The formatted currency string.
 */
export const formatCurrency = (amount: number, currency: string = "KES", locale: string = "en-KE"): string => {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
    }).format(amount);
};
