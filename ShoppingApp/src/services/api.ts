import {
  ApiResponse,
  ProductsResponse,
  RecommendProductResponse,
} from '../types/product';

const BASE_URL = 'http://localhost:8080';

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async callApi<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        data: {} as T,
        message: error instanceof Error ? error.message : 'An error occurred',
      };
    }
  }

  async getProducts(
    limit: number = 20,
    cursor?: string,
  ): Promise<ApiResponse<ProductsResponse>> {
    const url = cursor
      ? `/products?limit=${limit}&cursor=${cursor}`
      : `/products?limit=${limit}`;

    return this.callApi<ProductsResponse>(url);
  }

  async recommendProduct() {
    return this.callApi<RecommendProductResponse>(
      '/recommended-products',
    );
  }

  async checkout(productIds: number[]): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/orders/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ products: productIds }),
      });

      if (response.status === 204) {
        return {
          success: true,
          data: undefined as void,
        };
      }

      if (response.status === 502) {
        const text = await response.text();
        throw new Error(text || '502 Bad Gateway');
      }

      if (response.status === 500) {
        const json = await response.json();
        throw new Error(json.message || 'Internal Server Error');
      }

      throw new Error(`HTTP error! status: ${response.status}`);
    } catch (error) {
      console.error('Checkout Error:', error);
      return {
        success: false,
        data: undefined as void,
        message: error instanceof Error ? error.message : 'An error occurred',
      };
    }
  }
}

export const apiService = new ApiService();

export default ApiService;
