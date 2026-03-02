import { VITE_API_URL } from "@/env/env.client";
import { ApiClient } from "@repo/api";


// Create API client instance
const baseClient = new ApiClient({
    baseURL: VITE_API_URL,
    withCredentials: true,
    onUnauthorized: () => {
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    },
});


// Export base client for direct access if needed
export { baseClient as apiClient };
