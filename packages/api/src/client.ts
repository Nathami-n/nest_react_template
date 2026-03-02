import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig } from "axios";

export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
    error?: any;
    timestamp: string;
}

export interface ApiClientConfig {
    baseURL: string;
    withCredentials?: boolean;
    headers?: Record<string, string>;
    onUnauthorized?: () => void;
}

export class ApiClient {
    private client: AxiosInstance;
    private onUnauthorized?: () => void;

    constructor(config: ApiClientConfig) {
        this.onUnauthorized = config.onUnauthorized;

        this.client = axios.create({
            baseURL: config.baseURL,
            withCredentials: config.withCredentials ?? true,
            headers: {
                "Content-Type": "application/json",
                ...config.headers,
            },
        });

        this.client.interceptors.response.use(
            (response) => {
                // Unwrap the data from the standard response format
                // But preserve paginated responses with meta field
                if (response.data && typeof response.data === 'object' && 'data' in response.data) {
                    // If it has a meta field, it's a paginated response - keep the whole structure
                    if ('meta' in response.data) {
                        return response;
                    }

                    return response;
                }

                return response;
            },
            (error: AxiosError) => {
                // Extract error message from backend response
                const backendMessage = (error.response?.data as any)?.message;
                const statusCode = error.response?.status;

                // Create a proper Error object with the backend message
                const enhancedError = new Error(
                    backendMessage || error.message || 'An unexpected error occurred'
                );

                // Preserve original error properties
                (enhancedError as any).response = error.response;
                (enhancedError as any).status = statusCode;
                (enhancedError as any).code = error.code;

                // Handle common errors
                if (statusCode === 401) {
                    this.onUnauthorized?.();
                }

                return Promise.reject(enhancedError);
            }
        );
    }

    async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.get<T>(url, config);
        return response.data;
    }

    async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.post<T>(url, data, config);
        return response.data;
    }

    async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.put<T>(url, data, config);
        return response.data;
    }

    async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.patch<T>(url, data, config);
        return response.data;
    }

    async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.delete<T>(url, config);
        return response.data;
    }

    // Safe versions that return structured responses
    async getSafe<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await this.client.get<ApiResponse<T>>(url, config);
            // Response is already unwrapped by interceptor, wrap it back in standard format
            return {
                success: true,
                data: response.data as T,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse<any>>;
            const errorMessage = (axiosError.response?.data as any)?.message || axiosError.message || "Request failed";
            return {
                success: false,
                data: null as T,
                error: errorMessage,
                message: errorMessage,
                timestamp: new Date().toISOString()
            };
        }
    }

    async postSafe<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await this.client.post<ApiResponse<T>>(url, data, config);
            // Response is already unwrapped by interceptor, wrap it back in standard format
            return {
                success: true,
                data: response.data as T,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse<any>>;
            const errorMessage = (axiosError.response?.data as any)?.message || axiosError.message || "Request failed";
            return {
                success: false,
                data: null as T,
                error: errorMessage,
                message: errorMessage,
                timestamp: new Date().toISOString()
            };
        }
    }

    getAxiosInstance(): AxiosInstance {
        return this.client;
    }
}
