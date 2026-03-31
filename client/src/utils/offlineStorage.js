import Dexie from 'dexie';

export class OfflineDatabase extends Dexie {
  constructor() {
    super('StockySaaS');
    this.version(1).stores({
      syncOperations: '++id, tenantId, status, createdAt',
      cachedProducts: 'id, tenantId, sku',
      cachedSales: 'id, tenantId, status, createdAt',
    });
  }
}

export const db = new OfflineDatabase();

export class OfflineStorageService {
  /**
   * Queue a sync operation for later processing
   */
  async queueOperation(operation) {
    return await db.syncOperations.add({
      ...operation,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  /**
   * Get all pending sync operations
   */
  async getPendingOperations(tenantId) {
    return await db.syncOperations
      .where('tenantId')
      .equals(tenantId)
      .filter(op => op.status === 'pending')
      .toArray();
  }

  /**
   * Mark operation as synced
   */
  async markAsSynced(id) {
    await db.syncOperations.update(id, {
      status: 'synced',
      updatedAt: new Date(),
    });
  }

  /**
   * Mark operation as failed
   */
  async markAsFailed(id) {
    await db.syncOperations.update(id, {
      status: 'failed',
      updatedAt: new Date(),
    });
  }

  /**
   * Cache product data
   */
  async cacheProduct(product) {
    return await db.cachedProducts.put(product);
  }

  /**
   * Get cached products
   */
  async getCachedProducts(tenantId) {
    return await db.cachedProducts
      .where('tenantId')
      .equals(tenantId)
      .toArray();
  }

  /**
   * Cache sale transaction
   */
  async cacheSale(sale) {
    return await db.cachedSales.put(sale);
  }

  /**
   * Get pending sales (not yet synced)
   */
  async getPendingSales(tenantId) {
    return await db.cachedSales
      .where('tenantId')
      .equals(tenantId)
      .filter(sale => sale.status === 'pending')
      .toArray();
  }

  /**
   * Clear all offline data
   */
  async clearAllData() {
    await db.syncOperations.clear();
    await db.cachedProducts.clear();
    await db.cachedSales.clear();
  }

  /**
   * Get sync statistics
   */
  async getSyncStats(tenantId) {
    const operations = await db.syncOperations
      .where('tenantId')
      .equals(tenantId)
      .toArray();

    return {
      totalPending: operations.filter(op => op.status === 'pending').length,
      totalSynced: operations.filter(op => op.status === 'synced').length,
      totalFailed: operations.filter(op => op.status === 'failed').length,
    };
  }
}

export const offlineStorage = new OfflineStorageService();
