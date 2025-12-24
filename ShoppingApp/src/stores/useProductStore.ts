import { create } from "zustand";
import { Product, CartItem } from "../types/product";
import { apiService } from "../services/api";
import {
  calculatePairDiscountPromotion,
  PromotionResult,
} from "../utils/promotionCalculator";

interface ProductStore {
  products: Product[];
  recommendedProducts: Product[];
  cart: CartItem[];
  loading: boolean;
  recommendLoading: boolean;
  checkoutLoading: boolean;
  error: string | null;
  nextCursor: string | null;
  hasMore: boolean;

  fetchProducts: (limit?: number, cursor?: string) => Promise<void>;
  fetchRecommendProduct: () => Promise<void>;
  loadMoreProducts: () => Promise<void>;
  setProducts: (products: Product[]) => void;

  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  checkout: () => Promise<{ success: boolean; message?: string }>;

  getCartTotal: () => number;
  getCartItemsCount: () => number;
  getCartItem: (productId: number) => CartItem | undefined;
  getCartPromotionDetails: (code: string) => PromotionResult;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  recommendedProducts: [],
  cart: [],
  loading: false,
  recommendLoading: false,
  checkoutLoading: false,
  error: null,
  nextCursor: null,
  hasMore: true,

  fetchProducts: async (limit = 20, cursor?: string) => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.getProducts(limit, cursor);
      if (response.success && response.data) {
        set({
          products: response.data.items,
          nextCursor: response.data.nextCursor || null,
          hasMore: !!response.data.nextCursor,
          loading: false,
        });
      } else {
        set({
          error: response.message || "Failed to fetch products",
          loading: false,
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        loading: false,
      });
    }
  },

  fetchRecommendProduct: async () => {
    set({ recommendLoading: true, error: null });
    try {
      const response = await apiService.recommendProduct();
      console.log("response--->>", response);
      if (response.success && response.data) {
        set({
          recommendedProducts: response.data,
          recommendLoading: false,
        });
      } else {
        set({
          error: response.message || "Failed to fetch recommended products",
          recommendLoading: false,
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        recommendLoading: false,
      });
    }
  },

  loadMoreProducts: async () => {
    const { nextCursor, hasMore, loading, products } = get();

    if (!hasMore || loading || !nextCursor) return;

    set({ loading: true, error: null });
    try {
      const response = await apiService.getProducts(20, nextCursor);
      if (response.success && response.data) {
        set({
          products: [...products, ...response.data.items],
          nextCursor: response.data.nextCursor || null,
          hasMore: !!response.data.nextCursor,
          loading: false,
        });
      } else {
        set({
          error: response.message || "Failed to load more products",
          loading: false,
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        loading: false,
      });
    }
  },

  setProducts: (products: Product[]) => {
    set({ products });
  },

  addToCart: (product: Product) => {
    const { cart } = get();
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      set({
        cart: cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      set({
        cart: [...cart, { ...product, quantity: 1 }],
      });
    }
  },

  removeFromCart: (productId: number) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== productId),
    }));
  },

  updateQuantity: (productId: number, quantity: number) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }

    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      ),
    }));
  },

  clearCart: () => {
    set({ cart: [] });
  },

  checkout: async () => {
    const { cart } = get();

    if (cart.length === 0) {
      return {
        success: false,
        message: "ตะกร้าสินค้าว่างเปล่า",
      };
    }

    const productIds = cart
      .filter((item) => item.id > 0)
      .map((item) => item.id);

    set({ checkoutLoading: true, error: null });
    try {
      const response = await apiService.checkout(productIds);

      if (response.success) {
        set({ cart: [], checkoutLoading: false });
        return {
          success: true,
          message: "สั่งซื้อสำเร็จ",
        };
      } else {
        set({ checkoutLoading: false, error: response.message || null });
        return {
          success: false,
          message: response.message || "เกิดข้อผิดพลาด",
        };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "เกิดข้อผิดพลาด";
      set({ checkoutLoading: false, error: errorMessage });
      return {
        success: false,
        message: errorMessage,
      };
    }
  },

  getCartTotal: () => {
    const { cart } = get();
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  getCartItemsCount: () => {
    const { cart } = get();
    return cart.reduce((count, item) => count + item.quantity, 0);
  },

  getCartItem: (productId: number) => {
    const { cart } = get();
    return cart.find((item) => item.id === productId);
  },

  getCartPromotionDetails: (code: string) => {
    const { cart } = get();
    return calculatePairDiscountPromotion(cart, code);
  },
}));

export default useProductStore;
