import { StockMovement, Batch, Product } from '../models/index.js';
import { Logger } from '../utils/logger.js';

const logger = new Logger('StockMovementEngine');

class StockMovementEngine {
  /**
   * Record a stock movement
   */
  async recordMovement(movementData) {
    try {
      const movement = new StockMovement(movementData);
      await movement.save();

      logger.info(`Stock movement recorded: ${movementData.movementType} ${movementData.quantity} units`, {
        productId: movementData.productId,
        batchId: movementData.batchId,
        movementId: movement._id,
      });

      return movement;
    } catch (error) {
      logger.error('Failed to record stock movement:', error);
      throw error;
    }
  }

  /**
   * Record purchase inbound movement
   */
  async recordPurchaseInbound(tenantId, batchId, productId, quantity, costPerUnit, purchaseOrderId, userId) {
    try {
      const totalCost = quantity * costPerUnit;

      const movement = await this.recordMovement({
        tenantId,
        productId,
        batchId,
        movementType: 'IN',
        quantity,
        costPerUnit,
        totalCost,
        referenceType: 'purchase',
        referenceId: purchaseOrderId,
        userId,
      });

      return movement;
    } catch (error) {
      logger.error('Failed to record purchase inbound movement:', error);
      throw error;
    }
  }

  /**
   * Record sale outbound movement
   */
  async recordSaleOutbound(tenantId, batchId, productId, quantity, costPerUnit, saleId, userId) {
    try {
      const totalCost = quantity * costPerUnit;

      const movement = await this.recordMovement({
        tenantId,
        productId,
        batchId,
        movementType: 'OUT',
        quantity,
        costPerUnit,
        totalCost,
        referenceType: 'sale',
        referenceId: saleId,
        userId,
      });

      return movement;
    } catch (error) {
      logger.error('Failed to record sale outbound movement:', error);
      throw error;
    }
  }

  /**
   * Record return movement (inbound)
   */
  async recordReturnInbound(tenantId, batchId, productId, quantity, costPerUnit, returnId, userId) {
    try {
      const totalCost = quantity * costPerUnit;

      const movement = await this.recordMovement({
        tenantId,
        productId,
        batchId,
        movementType: 'RETURN',
        quantity,
        costPerUnit,
        totalCost,
        referenceType: 'return',
        referenceId: returnId,
        userId,
      });

      return movement;
    } catch (error) {
      logger.error('Failed to record return inbound movement:', error);
      throw error;
    }
  }

  /**
   * Record stock adjustment
   */
  async recordAdjustment(tenantId, batchId, productId, quantity, costPerUnit, reason, userId) {
    try {
      const totalCost = quantity * costPerUnit;

      const movement = await this.recordMovement({
        tenantId,
        productId,
        batchId,
        movementType: 'ADJUST',
        quantity,
        costPerUnit,
        totalCost,
        referenceType: 'adjustment',
        referenceId: null,
        notes: reason,
        userId,
      });

      return movement;
    } catch (error) {
      logger.error('Failed to record stock adjustment:', error);
      throw error;
    }
  }

  /**
   * Record warehouse transfer
   */
  async recordTransfer(tenantId, batchId, productId, quantity, costPerUnit, fromWarehouse, toWarehouse, userId) {
    try {
      const totalCost = quantity * costPerUnit;

      const movement = await this.recordMovement({
        tenantId,
        productId,
        batchId,
        movementType: 'TRANSFER',
        quantity,
        costPerUnit,
        totalCost,
        referenceType: 'transfer',
        referenceId: null,
        notes: `Transfer from ${fromWarehouse} to ${toWarehouse}`,
        userId,
      });

      return movement;
    } catch (error) {
      logger.error('Failed to record warehouse transfer:', error);
      throw error;
    }
  }

  /**
   * Get stock movements for a product
   */
  async getProductMovements(tenantId, productId, filters = {}) {
    try {
      const query = {
        tenantId,
        productId,
      };

      if (filters.movementType) {
        query.movementType = filters.movementType;
      }

      if (filters.startDate || filters.endDate) {
        query.createdAt = {};
        if (filters.startDate) {
          query.createdAt.$gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          query.createdAt.$lte = new Date(filters.endDate);
        }
      }

      const movements = await StockMovement.find(query)
        .sort({ createdAt: -1 })
        .populate('userId', 'firstName lastName email')
        .lean();

      return movements;
    } catch (error) {
      logger.error('Failed to get product movements:', error);
      throw error;
    }
  }

  /**
   * Get batch movements
   */
  async getBatchMovements(tenantId, batchId) {
    try {
      const movements = await StockMovement.find({
        tenantId,
        batchId,
      })
        .sort({ createdAt: 1 })
        .populate('userId', 'firstName lastName email')
        .lean();

      return movements;
    } catch (error) {
      logger.error('Failed to get batch movements:', error);
      throw error;
    }
  }

  /**
   * Calculate current stock level for a product
   */
  async calculateCurrentStock(tenantId, productId) {
    try {
      const movements = await StockMovement.find({
        tenantId,
        productId,
      });

      let currentStock = 0;

      for (const movement of movements) {
        if (movement.movementType === 'IN' || movement.movementType === 'RETURN') {
          currentStock += movement.quantity;
        } else if (movement.movementType === 'OUT') {
          currentStock -= movement.quantity;
        } else if (movement.movementType === 'ADJUST') {
          currentStock += movement.quantity; // Can be positive or negative
        }
      }

      return Math.max(0, currentStock);
    } catch (error) {
      logger.error('Failed to calculate current stock:', error);
      throw error;
    }
  }

  /**
   * Calculate inventory value
   */
  async calculateInventoryValue(tenantId, productId) {
    try {
      const movements = await StockMovement.find({
        tenantId,
        productId,
      });

      let totalValue = 0;
      let totalQuantity = 0;

      for (const movement of movements) {
        if (movement.movementType === 'IN' || movement.movementType === 'RETURN') {
          totalValue += movement.totalCost;
          totalQuantity += movement.quantity;
        } else if (movement.movementType === 'OUT') {
          totalValue -= movement.totalCost;
          totalQuantity -= movement.quantity;
        }
      }

      return {
        totalValue: Math.max(0, totalValue),
        totalQuantity: Math.max(0, totalQuantity),
        averageCost: totalQuantity > 0 ? totalValue / totalQuantity : 0,
      };
    } catch (error) {
      logger.error('Failed to calculate inventory value:', error);
      throw error;
    }
  }

  /**
   * Get movement audit trail
   */
  async getAuditTrail(tenantId, filters = {}) {
    try {
      const query = { tenantId };

      if (filters.productId) {
        query.productId = filters.productId;
      }

      if (filters.userId) {
        query.userId = filters.userId;
      }

      if (filters.movementType) {
        query.movementType = filters.movementType;
      }

      if (filters.startDate || filters.endDate) {
        query.createdAt = {};
        if (filters.startDate) {
          query.createdAt.$gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          query.createdAt.$lte = new Date(filters.endDate);
        }
      }

      const movements = await StockMovement.find(query)
        .sort({ createdAt: -1 })
        .populate('productId', 'name sku')
        .populate('userId', 'firstName lastName email')
        .lean();

      return movements;
    } catch (error) {
      logger.error('Failed to get audit trail:', error);
      throw error;
    }
  }
}

export default new StockMovementEngine();
