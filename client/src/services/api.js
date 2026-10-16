// API Client for Raksh Crackers
const API_BASE = '/api';

function getAuthToken() {
  return localStorage.getItem('raksh_auth_token') || '';
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('raksh_auth_token', token);
  } else {
    localStorage.removeItem('raksh_auth_token');
  }
}

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Accept': 'application/json',
    ...(options.headers || {})
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    headers['X-Auth-Token'] = token;
  }

  const config = {
    ...options,
    headers,
    credentials: 'include' // include cookies
  };

  if (options.body && !(options.body instanceof FormData) && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  if (data.token) {
    setAuthToken(data.token);
  }
  if (data.user) {
    try {
      localStorage.setItem('raksh_user', JSON.stringify(data.user));
    } catch (_e) {}
  }

  return data;
}

export const api = {
  // Auth
  getMe: () => request('/auth/me'),
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  register: (email, password, password_confirmation) => 
    request('/auth/register', { method: 'POST', body: { email, password, password_confirmation } }),
  logout: () => {
    localStorage.removeItem('raksh_user');
    setAuthToken('');
    return request('/auth/logout', { method: 'DELETE' });
  },
  demoLogin: (role) => request('/auth/demo_login', { method: 'POST', body: { role } }),

  // Shop Config
  getShopConfig: () => request('/shop_config'),
  updateShopConfig: (data) => request('/shop_config', { method: 'PUT', body: data }),

  // Products
  getProducts: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.set('category', params.category);
    if (params.search) query.set('search', params.search);
    if (params.sort) query.set('sort', params.sort);
    const qs = query.toString();
    return request(`/products${qs ? `?${qs}` : ''}`);
  },
  getProductCategories: () => request('/products/categories'),
  getProduct: (id) => request(`/products/${id}`),

  // Cart
  getCart: () => request('/cart'),
  addToCart: (productId, amount = 1) => 
    request('/cart/add_item', { method: 'POST', body: { product_id: productId, amount } }),
  updateCartItem: (itemId, quantity) => 
    request('/cart/update_item', { method: 'POST', body: { id: itemId, quantity } }),
  removeCartItem: (itemId) => 
    request('/cart/remove_item', { method: 'POST', body: { id: itemId } }),
  clearCart: () => request('/cart/clear', { method: 'POST' }),

  // Orders & Parcel Tracking
  getOrders: () => request('/orders'),
  getOrder: (id) => request(`/orders/${id}`),
  createOrder: (orderData) => request('/orders', { method: 'POST', body: orderData }),
  trackOrder: (query) => request(`/orders/track?query=${encodeURIComponent(query)}`),

  // Admin APIs
  getAdminDashboard: () => request('/admin/dashboard'),
  getAdminUsers: () => request('/admin/users'),
  
  createProduct: (productData) => request('/admin/products', { method: 'POST', body: productData }),
  updateProduct: (id, productData) => request(`/admin/products/${id}`, { method: 'PUT', body: productData }),
  deleteProduct: (id) => request(`/admin/products/${id}`, { method: 'DELETE' }),
  bulkDeleteProducts: (ids) => request('/admin/products/bulk_destroy', { method: 'POST', body: { ids } }),
  importProductsCsv: (csvDataOrFile) => {
    if (csvDataOrFile instanceof File) {
      const fd = new FormData();
      fd.append('file', csvDataOrFile);
      return request('/products/import_csv', { method: 'POST', body: fd });
    }
    if (csvDataOrFile instanceof FormData) {
      return request('/products/import_csv', { method: 'POST', body: csvDataOrFile });
    }
    return request('/products/import_csv', { method: 'POST', body: { csv_data: csvDataOrFile } });
  },
  uploadPricelistPdf: (file) => {
    const fd = new FormData();
    fd.append('shop_config[pricelist_pdf]', file);
    return request('/shop_config', { method: 'PUT', body: fd });
  },

  updateAdminOrder: (id, orderData) => request(`/admin/orders/${id}`, { method: 'PATCH', body: orderData }),

  // POS Fast Billing & AI Voice
  searchBillingProducts: (query) => request(`/admin/billing/products?query=${encodeURIComponent(query || '')}`),
  checkoutBilling: (billData) => request('/admin/billing/checkout', { method: 'POST', body: billData }),
  aiVoiceParse: (query, cart = [], discount = 0) => request('/admin/billing/ai_parse', { method: 'POST', body: { query, cart, discount } }),
  ttsAudioUrl: (text) => `/api/admin/billing/tts?text=${encodeURIComponent(text || '')}`
};
