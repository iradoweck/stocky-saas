import { SyncQueue } from '../models/index.js';
import { Logger } from '../utils/logger.js';
import { config } from '../config/env.js';

const logger = new Logger('OfflineSyncEngine');

class OfflineSyncEngine {
  /**
   * Queue a sync operation for later processing
   */
  async queueOperation(operation) {
    try {
      const syncItem = new SyncQueue({
        tenantId: operation.tenantId,
        userId: operation.userId,
        operationType: operation.operationType,
        entityType: operation.entityType,
        entityId: operation.entityId,
        payload: operation.payload,
        status: 'pending',
        retryCount: 0,
      });

      await syncItem.save();

      logger.info(`Sync operation queued: ${operation.operationType} ${operation.entityType}`, {
        syncId: syncItem._id,
        entityId: operation.entityId,
      });

      return syncItem;
    } catch (error) {
      logger.error('Failed to queue sync operation:', error);
      throw error;
    }
  }

  /**
   * Get pending sync operations for a user
   */
  async getPendingOperations(tenantId, userId, limit = 50) {
    try {
      const operations = await SyncQueue.find({
        tenantId,
        userId,
        status: 'pending',
      })
        .sort({ createdAt: 1 })
        .limit(limit)
        .lean();

      return operations;
    } catch (error) {
      logger.error('Failed to get pending operations:', error);
      throw error;
    }
  }

  /**
   * Mark sync operation as synced
   */
  async markAsSynced(syncId) {
    try {
      await SyncQueue.findByIdAndUpdate(syncId, {
        status: 'synced',
        retryCount: 0,
      });

      logger.info(`Sync operation marked as synced: ${syncId}`);
    } catch (error) {
      logger.error('Failed to mark sync operation as synced:', error);
      throw error;
    }
  }

  /**
   * Mark sync operation as failed and retry if attempts remaining
   */
  async markAsFailed(syncId, error) {
    try {
      const syncItem = await SyncQueue.findById(syncId);

      if (!syncItem) {
        return false;
      }

      syncItem.retryCount += 1;
      syncItem.lastError = error;

      if (syncItem.retryCount >= config.SYNC_RETRY_ATTEMPTS) {
        syncItem.status = 'failed';
        logger.error(`Sync operation failed after ${config.SYNC_RETRY_ATTEMPTS} attempts: ${syncId}`, {
          error,
        });
      } else {
        syncItem.status = 'pending';
        logger.warn(
          `Sync operation failed, will retry (attempt ${syncItem.retryCount}/${config.SYNC_RETRY_ATTEMPTS}): ${syncId}`,
          { error }
        );
      }

      await syncItem.save();
      return syncItem.status === 'pending';
    } catch (error) {
      logger.error('Failed to mark sync operation as failed:', error);
      throw error;
    }
  }

  /**
   * Get failed sync operations
   */
  async getFailedOperations(tenantId, limit = 50) {
    try {
      const operations = await SyncQueue.find({
        tenantId,
        status: 'failed',
      })
        .sort({ updatedAt: -1 })
        .limit(limit)
        .lean();

      return operations;
    } catch (error) {
      logger.error('Failed to get failed operations:', error);
      throw error;
    }
  }

  /**
   * Retry failed sync operations
   */
  async retryFailedOperations(tenantId) {
    try {
      const result = await SyncQueue.updateMany(
        {
          tenantId,
          status: 'failed',
          retryCount: { $lt: config.SYNC_RETRY_ATTEMPTS },
        },
        {
          status: 'pending',
          retryCount: 0,
        }
      );

      logger.info(`Retrying failed sync operations: ${result.modifiedCount} operations reset`, {
        tenantId,
      });

      return result.modifiedCount;
    } catch (error) {
      logger.error('Failed to retry failed operations:', error);
      throw error;
    }
  }

  /**
   * Get sync statistics for a tenant
   */
  async getSyncStats(tenantId) {
    try {
      const total = await SyncQueue.countDocuments({ tenantId });
      const pending = await SyncQueue.countDocuments({ tenantId, status: 'pending' });
      const synced = await SyncQueue.countDocuments({ tenantId, status: 'synced' });
      const failed = await SyncQueue.countDocuments({ tenantId, status: 'failed' });

      const lastSynced = await SyncQueue.findOne({ tenantId, status: 'synced' })
        .sort({ updatedAt: -1 })
        .lean();

      return {
        total,
        pending,
        synced,
        failed,
        lastSyncTime: lastSynced?.updatedAt,
      };
    } catch (error) {
      logger.error('Failed to get sync statistics:', error);
      throw error;
    }
  }

  /**
   * Clear old synced operations (older than 30 days)
   */
  async cleanupOldSyncedOperations(tenantId, daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await SyncQueue.deleteMany({
        tenantId,
        status: 'synced',
        updatedAt: { $lt: cutoffDate },
      });

      logger.info(`Cleaned up old synced operations: ${result.deletedCount} records removed`, {
        tenantId,
        daysOld,
      });

      return result.deletedCount;
    } catch (error) {
      logger.error('Failed to cleanup old synced operations:', error);
      throw error;
    }
  }

  /**
   * Resolve conflicts (server-authoritative)
   */
  async resolveConflict(syncId, serverVersion, clientVersion) {
    try {
      logger.info(`Resolving conflict for sync operation: ${syncId}`, {
        serverVersion,
        clientVersion,
      });

      // Server-authoritative conflict resolution
      return serverVersion;
    } catch (error) {
      logger.error('Failed to resolve conflict:', error);
      throw error;
    }
  }

  /**
   * Batch process sync operations
   */
  async processBatch(tenantId, batchSize = config.SYNC_BATCH_SIZE) {
    try {
      const operations = await SyncQueue.find({
        tenantId,
        status: 'pending',
      })
        .sort({ createdAt: 1 })
        .limit(batchSize)
        .lean();

      logger.info(`Processing sync batch: ${operations.length} operations`, {
        tenantId,
        batchSize,
      });

      return operations;
    } catch (error) {
      logger.error('Failed to process sync batch:', error);
      throw error;
    }
  }
}

export default new OfflineSyncEngine();
