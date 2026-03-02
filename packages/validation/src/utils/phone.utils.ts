/**
 * Normalizes Kenyan phone numbers to M-Pesa format (254XXXXXXXXX)
 * Accepts:
 * - 254712345678 (already correct)
 * - 0712345678 (adds 254 prefix)
 * - 712345678 (adds 254 prefix)
 * - +254712345678 (removes + sign)
 * 
 * @param phone - Phone number in various formats
 * @returns Normalized phone number in 254XXXXXXXXX format or original value if invalid
 */
export function normalizeKenyanPhone(phone: unknown): string {
    if (typeof phone !== 'string') return String(phone || '');

    // Remove all spaces, dashes, and plus signs
    let cleaned = phone.trim().replace(/[\s\-+]/g, '');

    // If starts with 0, replace with 254
    if (cleaned.startsWith('0')) {
        cleaned = '254' + cleaned.substring(1);
    }

    // If starts with 7 or 1 (without country code), add 254
    if (/^[17]\d{8}$/.test(cleaned)) {
        cleaned = '254' + cleaned;
    }

    return cleaned;
}

/**
 * Validates that a phone number is in correct M-Pesa format
 * @param phone - Phone number to validate
 * @returns true if valid, false otherwise
 */
export function isValidKenyanPhone(phone: string): boolean {
    return /^254[17]\d{8}$/.test(phone);
}
