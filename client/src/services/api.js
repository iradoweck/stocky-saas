import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class APIClient {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.token = null;

    // Add request interceptor to include token
    this.client.interceptors.request.use(
      config => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    this.loadToken();
  }

  loadToken() {
    const token = localStorage.getItem('token');
    if (token) {
      this.token = token;
    }
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Auth endpoints
  async login(email, password) {
    const response = await this.client.post('/api/auth/login', { email, password });
    return response.data;
  }

  async register(userData) {
    const response = await this.client.post('/api/auth/register', userData);
    return response.data;
  }

  async logout() {
    await this.client.post('/api/auth/logout');
    this.clearToken();
  }

  // Product endpoints
  async getProducts(tenantId) {
    const response = await this.client.get(`/api/products?tenantId=${tenantId}`);
    return response.data;
  }

  async createProduct(tenantId, productData) {
    const response = await this.client.post('/api/products', {
      tenantId,
      ...productData,
    });
    return response.data;
  }

  async updateProduct(tenantId, productId, productData) {
    const response = await this.client.put(`/api/products/${productId}`, {
      tenantId,
      ...productData,
    });
    return response.data;
  }

  async deleteProduct(tenantId, productId) {
    await this.client.delete(`/api/products/${productId}?tenantId=${tenantId}`);
  }

  // Inventory endpoints
  async getStockLevels(tenantId) {
    const response = await this.client.get(`/api/inventory/stock-levels?tenantId=${tenantId}`);
    return response.data;
  }

  async getStockMovements(tenantId, productId) {
    const params = new URLSearchParams({ tenantId });
    if (productId) params.append('productId', productId);
    const response = await this.client.get(`/api/inventory/movements?${params}`);
    return response.data;
  }

  async adjustStock(tenantId, adjustmentData) {
    const response = await this.client.post('/api/inventory/adjust', {
      tenantId,
      ...adjustmentData,
    });
    return response.data;
  }

  async getLowStockProducts(tenantId) {
    const response = await this.client.get(`/api/inventory/low-stock?tenantId=${tenantId}`);
    return response.data;
  }

  // Sales endpoints
  async getSales(tenantId) {
    const response = await this.client.get(`/api/sales?tenantId=${tenantId}`);
    return response.data;
  }

  async createSale(tenantId, saleData) {
    const response = await this.client.post('/api/sales', {
      tenantId,
      ...saleData,
    });
    return response.data;
  }

  async getSaleDetails(tenantId, saleId) {
    const response = await this.client.get(`/api/sales/${saleId}?tenantId=${tenantId}`);
    return response.data;
  }

  async createSalesReturn(tenantId, saleId, returnData) {
    const response = await this.client.post(`/api/sales/${saleId}/return`, {
      tenantId,
      ...returnData,
    });
    return response.data;
  }

  // Purchase endpoints
  async getPurchaseOrders(tenantId) {
    const response = await this.client.get(`/api/purchases?tenantId=${tenantId}`);
    return response.data;
  }

  async createPurchaseOrder(tenantId, poData) {
    const response = await this.client.post('/api/purchases', {
      tenantId,
      ...poData,
    });
    return response.data;
  }

  async receivePurchaseOrder(tenantId, poId, receiveData) {
    const response = await this.client.post(`/api/purchases/${poId}/receive`, {
      tenantId,
      ...receiveData,
    });
    return response.data;
  }

  // Debtor endpoints
  async getDebtors(tenantId) {
    const response = await this.client.get(`/api/debtors?tenantId=${tenantId}`);
    return response.data;
  }

  async getDebtorDetails(tenantId, debtorId) {
    const response = await this.client.get(`/api/debtors/${debtorId}?tenantId=${tenantId}`);
    return response.data;
  }

  async recordPayment(tenantId, debtorId, paymentData) {
    const response = await this.client.post(`/api/debtors/${debtorId}/payment`, {
      tenantId,
      ...paymentData,
    });
    return response.data;
  }

  async sendPaymentReminder(tenantId, debtorId) {
    const response = await this.client.post(`/api/debtors/${debtorId}/reminder`, {
      tenantId,
    });
    return response.data;
  }

  // Sync endpoints
  async pushOfflineChanges(tenantId, operations) {
    const response = await this.client.post('/api/sync/push', {
      tenantId,
      operations,
    });
    return response.data;
  }

  async pullServerChanges(tenantId, lastSyncTime) {
    const params = new URLSearchParams({ tenantId });
    if (lastSyncTime) params.append('lastSyncTime', lastSyncTime);
    const response = await this.client.get(`/api/sync/pull?${params}`);
    return response.data;
  }

  async getSyncStatus(tenantId) {
    const response = await this.client.get(`/api/sync/status?tenantId=${tenantId}`);
    return response.data;
  }
}

export const apiClient = new APIClient();
