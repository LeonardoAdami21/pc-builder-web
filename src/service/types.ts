import api from "./api";

export type ProductQuery = {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
};

export type CategoryQuery = {
  search?: string;
  page?: number;
  limit?: number;
};

export type CartQuery = {
  page?: number;
  limit?: number;
};

export type OrderQuery = {
  page?: number;
  limit?: number;
};

export type UserQuery = {
  page?: number;
  limit?: number;
};

export type LoginDto = {
  email: string;
  password: string;
};

export type RegisterDto = {
  name: string;
  email: string;
  cpf: string;
  password: string;
};

export type Address = {
  id: string;
  name: string;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  complement: string;
  reference: string;
  default: boolean;
};

export type AddressDto = {
  name: string;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  complement: string;
  reference: string;
  default: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  createdAt: string;
  updatedAt: string;
  addresses: Address[];
  wishlist: string[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount: number;
  images: string[];
  category: string;
  createdAt: string;
  updatedAt: string;
};

export type Cart = {
  id: string;
  product: Product;
  quantity: number;
  createdAt: string;
  updatedAt: string;
};

export type Order = {
  id: string;
  products: Cart[];
  total: number;
  createdAt: string;
  updatedAt: string;
};

export type Wishlist = {
  id: string;
  product: Product;
  createdAt: string;
  updatedAt: string;
};

export type PriceHistory = {
  id: string;
  product: Product;
  price: number;
  createdAt: string;
  updatedAt: string;
};

export type UserAddress = {
  id: string;
  name: string;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  complement: string;
  reference: string;
  default: boolean;
};

export type CreateOrderDto = {
  items: { productId: string; quantity: number }[];
  addressId: string;
  paymentMethod: string;
  couponCode?: string;
  notes?: string;
};

// ── Auth ───────────────────────────────────────────────────
export const authService = {
  login: (dto: LoginDto) => api.post("/auth/login", dto),
  register: (dto: RegisterDto) => api.post("/auth/register", dto),
  refresh: (token: string) =>
    api.post("/auth/refresh", { refreshToken: token }),
  logout: (token: string) => api.post("/auth/logout", { refreshToken: token }),
  me: () => api.get("/auth/me"),
  changePassword: (dto: any) => api.post("/auth/change-password", dto),
};

// ── Products ───────────────────────────────────────────────
export const productService = {
  list: (params: ProductQuery) => api.get("/products", { params }),
  bySlug: (slug: string) => api.get(`/products/${slug}/slug`),
  byId: (id: string) => api.get(`/products/${id}`),
  related: (id: string) => api.get(`/products/${id}/related`),
  create: (dto: any) => api.post("/products", dto),
  update: (id: string, dto: any) => api.patch(`/products/${id}`, dto),
  updateStock: (id: string, stock: number) =>
    api.patch(`/products/${id}/stock`, { stock }),
  remove: (id: string) => api.delete(`/products/${id}`),
};

// ── Categories ─────────────────────────────────────────────
export const categoryService = {
  tree: () => api.get("/categories/tree"),
  bySlug: (slug: string) => api.get(`/categories/${slug}/slug`),
  byId: (id: string) => api.get(`/categories/${id}`),
  create: (dto: any) => api.post("/categories", dto),
  update: (id: string, dto: any) => api.patch(`/categories/${id}`, dto),
};

// ── Search ─────────────────────────────────────────────────
export const searchService = {
  search: (q: string, limit = 20) =>
    api.get("/search", { params: { q, limit } }),
  autocomplete: (q: string) =>
    api.get("/search/autocomplete", { params: { q } }),
  facets: (categoryId?: string) =>
    api.get("/search/facets", { params: { categoryId } }),
};

// ── Orders ─────────────────────────────────────────────────
export const orderService = {
  create: (dto: CreateOrderDto) => api.post("/orders", dto),
  list: (page = 1) => api.get("/orders", { params: { page } }),
  byId: (id: string) => api.get(`/orders/${id}`),
  cancel: (id: string) => api.patch(`/orders/${id}/cancel`),
};

// ── Users ──────────────────────────────────────────────────
export const userService = {
  profile: () => api.get("/users/profile"),
  updateProfile: (dto: Partial<User>) => api.patch("/users/profile", dto),
  addresses: () => api.get("/users/addresses"),
  createAddress: (dto: Omit<Address, "id">) =>
    api.post("/users/addresses", dto),
  updateAddress: (id: string, dto: any) =>
    api.patch(`/users/addresses/${id}`, dto),
  removeAddress: (id: string) => api.delete(`/users/addresses/${id}`),
  wishlist: () => api.get("/users/wishlist"),
  toggleWishlist: (productId: string) =>
    api.post(`/users/wishlist/${productId}`),
};

// ── Price History ──────────────────────────────────────────
export const priceHistoryService = {
  byProduct: (id: string, days = 90) =>
    api.get(`/price-history/${id}`, { params: { days } }),
  biggestDrops: (limit = 10) =>
    api.get("/price-history/drops", { params: { limit } }),
};

// ── Compare ────────────────────────────────────────────────
export const compareService = {
  compare: (ids: string[]) =>
    api.get("/compare", { params: { ids: ids.join(",") } }),
  list: () => api.get("/compare/list"),
  add: (productId: string) => api.post("/compare/list", { productId }),
  remove: (productId: string) => api.delete(`/compare/list/${productId}`),
  clear: () => api.delete("/compare/list/clear"),
};

// ── PC Builder ─────────────────────────────────────────────
export const pcBuilderService = {
  components: (type: string, q?: string) =>
    api.get(`/pc-builder/components/${type}`, { params: { q } }),
  checkCompat: (productIds: string[]) =>
    api.post("/pc-builder/compatibility", { productIds }),
  saveBuild: (dto: any) => api.post("/pc-builder/save", dto),
  publicBuilds: () => api.get("/pc-builder/public"),
};

// ── Admin ──────────────────────────────────────────────────
export const adminService = {
  dashboard: () => api.get("/admin/dashboard"),
  salesReport: (start: string, end: string) =>
    api.get("/admin/reports/sales", {
      params: { startDate: start, endDate: end },
    }),
  orders: (page = 1, status?: string) =>
    api.get("/admin/orders", { params: { page, status } }),
  updateOrderStatus: (id: string, status: string, note?: string) =>
    api.patch(`/admin/orders/${id}/status`, { status, note }),
  lowStock: () => api.get("/admin/products/low-stock"),
  users: (page = 1, search?: string) =>
    api.get("/admin/users", { params: { page, search } }),
  pendingReviews: () => api.get("/admin/reviews/pending"),
  approveReview: (id: string, approve: boolean) =>
    api.patch(`/admin/reviews/${id}/approve`, { approve }),
};
