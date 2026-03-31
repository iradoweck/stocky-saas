import { Batch, StockMovement } from '../models/index.js';
import { Logger } from '../utils/logger.js';

const logger = new Logger('FIFOCostingEngine');

class FIFOCostingEngine {
  /**
   * Allocate cost for a sale using FIFO method
   */
  async allocateCostForSale(tenantId, productId, quantityToSell) {
    try {
      const batches = await Batch.find({
        tenantId,
        productId,
        status: 'active',
      }).sort({ createdAt: 1 });

      if (batches.length === 0) {
        throw new Error('No active batches found for product');
      }

      const allocations = [];
      let remainingQuantity = quantityToSell;

      for (const batch of batches) {
        if (remainingQuantity <= 0) break;

        const availableQuantity = await this.getAvailableBatchQuantity(tenantId, batch._id);

        if (availableQuantity > 0) {
          const allocatedQuantity = Math.min(remainingQuantity, availableQuantity);

          allocations.push({
            batchId: batch._id,
            quantity: allocatedQuantity,
            costPerUnit: batch.costPerUnit,
            totalCost: allocatedQuantity * batch.costPerUnit,
          });

          remainingQuantity -= allocatedQuantity;
        }
      }

      if (remainingQuantity > 0) {
        throw new Error('Insufficient stock available');
      }

      const totalQuantity = allocations.reduce((sum, a) => sum + a.quantity, 0);
      const totalCost = allocations.reduce((sum, a) => sum + a.totalCost, 0);

      logger.info(`Cost allocated for sale: ${totalQuantity} units, total cost: ${totalCost}`, {
        productId,
        allocations,
      });

      return {
        allocations,
        totalQuantity,
        totalCost,
      };
    } catch (error) {
      logger.error('Failed to allocate cost for sale:', error);
      throw error;
    }
  }

  /**
   * Get available quantity for a batch
   */
  async getAvailableBatchQuantity(tenantId, batchId) {
    try {
      const batch = await Batch.findById(batchId);

      if (!batch) {
        throw new Error('Batch not found');
      }

      // Get all stock movements for this batch
      const movements = await StockMovement.find({
        tenantId,
        batchId,
      });

      let available = batch.quantity;

      for (const movement of movements) {
        if (movement.movementType === 'OUT' || movement.movementType === 'RETURN') {
          available -= movement.quantity;
        } else if (movement.movementType === 'IN') {
          available += movement.quantity;
        }
      }

      return Math.max(0, available);
    } catch (error) {
      logger.error('Failed to get available batch quantity:', error);
      throw error;
    }
  }

  /**
   * Calculate weighted average cost for a product
   */
  async calculateWeightedAverageCost(tenantId, productId) {
    try {
      const batches = await Batch.find({
        tenantId,
        productId,
        status: 'active',
      });

      if (batches.length === 0) {
        return 0;
      }

      let totalQuantity = 0;
      let totalCost = 0;

      for (const batch of batches) {
        const available = await this.getAvailableBatchQuantity(tenantId, batch._id);
        totalQuantity += available;
        totalCost += available * batch.costPerUnit;
      }

      if (totalQuantity === 0) {
        return 0;
      }

      const avgCost = totalCost / totalQuantity;

      logger.info(`Weighted average cost calculated: ${avgCost}`, {
        productId,
        totalQuantity,
        totalCost,
      });

      return avgCost;
    } catch (error) {
      logger.error('Failed to calculate weighted average cost:', error);
      throw error;
    }
  }

  /**
   * Validate batch has sufficient quantity
   */
  async validateBatchQuantity(tenantId, batchId, requiredQuantity) {
    try {
      const available = await this.getAvailableBatchQuantity(tenantId, batchId);
      return available >= requiredQuantity;
    } catch (error) {
      logger.error('Failed to validate batch quantity:', error);
      return false;
    }
  }

  /**
   * Allocate cost for a sales return
   */
  async allocateCostForReturn(tenantId, productId, quantityToReturn, originalAllocation) {
    try {
      // For returns, we reverse the allocation from the original sale
      const returnAllocations = originalAllocation.allocations.map(allocation => ({
        batchId: allocation.batchId,
        quantity: (allocation.quantity / originalAllocation.totalQuantity) * quantityToReturn,
        costPerUnit: allocation.costPerUnit,
        totalCost: ((allocation.quantity / originalAllocation.totalQuantity) * quantityToReturn) * allocation.costPerUnit,
      }));

      const totalQuantity = returnAllocations.reduce((sum, a) => sum + a.quantity, 0);
      const totalCost = returnAllocations.reduce((sum, a) => sum + a.totalCost, 0);

      logger.info(`Cost allocated for return: ${totalQuantity} units, total cost: ${totalCost}`, {
        productId,
        returnAllocations,
      });

      return {
        allocations: returnAllocations,
        totalQuantity,
        totalCost,
      };
    } catch (error) {
      logger.error('Failed to allocate cost for return:', error);
      throw error;
    }
  }

  /**
   * Get batch cost history
   */
  async getBatchCostHistory(tenantId, batchId) {
    try {
      const movements = await StockMovement.find({
        tenantId,
        batchId,
      }).sort({ createdAt: 1 });

      let runningQuantity = 0;
      const history = movements.map(movement => {
        runningQuantity += movement.movementType === 'OUT' ? -movement.quantity : movement.quantity;

        return {
          movementType: movement.movementType,
          quantity: movement.quantity,
          costPerUnit: movement.costPerUnit,
          totalCost: movement.totalCost,
          runningQuantity,
          timestamp: movement.createdAt,
        };
      });

      return history;
    } catch (error) {
      logger.error('Failed to get batch cost history:', error);
      throw error;
    }
  }
}

export default new FIFOCostingEngine();
