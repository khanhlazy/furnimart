import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Warehouse, WarehouseDocument, WarehouseTransaction } from './schemas/warehouse.schema';
import { CreateWarehouseDto, WarehouseTransactionDto, AdjustStockDto } from './dtos/warehouse.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectModel(Warehouse.name) private warehouseModel: Model<WarehouseDocument>,
    @Inject(forwardRef(() => ProductsService)) private productsService: ProductsService,
  ) {}

  async create(createWarehouseDto: CreateWarehouseDto, userId: string): Promise<WarehouseDocument> {
    const existing = await this.warehouseModel.findOne({ productId: createWarehouseDto.productId }).exec();
    if (existing) {
      throw new BadRequestException('Sản phẩm đã có trong kho');
    }

    // Get product to get productName
    const product = await this.productsService.findById(createWarehouseDto.productId);
    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    const warehouse = await this.warehouseModel.create({
      ...createWarehouseDto,
      productName: product.name,
      availableQuantity: createWarehouseDto.quantity,
      reservedQuantity: 0,
    });

    // Add initial transaction
    if (createWarehouseDto.quantity > 0) {
      await this.addTransaction(warehouse._id.toString(), {
        productId: createWarehouseDto.productId,
        quantity: createWarehouseDto.quantity,
        type: 'import',
        userId,
      });
    }

    return warehouse;
  }

  async findAll(): Promise<WarehouseDocument[]> {
    return this.warehouseModel.find({ isActive: true }).sort({ productName: 1 }).exec();
  }

  async findById(id: string): Promise<WarehouseDocument> {
    const warehouse = await this.warehouseModel.findById(id).exec();
    if (!warehouse) {
      throw new NotFoundException('Kho không tồn tại');
    }
    return warehouse;
  }

  async findByProductId(productId: string): Promise<WarehouseDocument | null> {
    return this.warehouseModel.findOne({ productId, isActive: true }).exec();
  }

  async addTransaction(warehouseId: string, transaction: WarehouseTransactionDto & { userId: string }): Promise<WarehouseDocument> {
    const warehouse = await this.findById(warehouseId);
    
    const newTransaction: WarehouseTransaction = {
      productId: transaction.productId,
      productName: warehouse.productName,
      quantity: transaction.quantity,
      type: transaction.type as any,
      orderId: transaction.orderId,
      userId: transaction.userId,
      note: transaction.note,
      createdAt: new Date(),
    };

    warehouse.transactions.push(newTransaction);

    // Update quantities based on transaction type
    if (transaction.type === 'import') {
      warehouse.quantity += transaction.quantity;
      warehouse.availableQuantity += transaction.quantity;
    } else if (transaction.type === 'export') {
      if (warehouse.availableQuantity < Math.abs(transaction.quantity)) {
        throw new BadRequestException('Không đủ hàng trong kho');
      }
      warehouse.quantity += transaction.quantity; // quantity is negative
      warehouse.availableQuantity += transaction.quantity;
    } else if (transaction.type === 'adjustment') {
      warehouse.quantity = transaction.quantity;
      warehouse.availableQuantity = warehouse.quantity - warehouse.reservedQuantity;
    } else if (transaction.type === 'damaged' || transaction.type === 'returned') {
      warehouse.quantity += transaction.quantity; // negative
      warehouse.availableQuantity += transaction.quantity;
    }

    return warehouse.save();
  }

  async reserveStock(productId: string, quantity: number): Promise<WarehouseDocument> {
    const warehouse = await this.findByProductId(productId);
    if (!warehouse) {
      throw new NotFoundException('Sản phẩm không có trong kho');
    }

    if (warehouse.availableQuantity < quantity) {
      throw new BadRequestException('Không đủ hàng trong kho');
    }

    warehouse.reservedQuantity += quantity;
    warehouse.availableQuantity -= quantity;
    return warehouse.save();
  }

  async releaseReservedStock(productId: string, quantity: number): Promise<WarehouseDocument> {
    const warehouse = await this.findByProductId(productId);
    if (!warehouse) {
      throw new NotFoundException('Sản phẩm không có trong kho');
    }

    warehouse.reservedQuantity = Math.max(0, warehouse.reservedQuantity - quantity);
    warehouse.availableQuantity = warehouse.quantity - warehouse.reservedQuantity;
    return warehouse.save();
  }

  async adjustStock(warehouseId: string, adjustStockDto: AdjustStockDto, userId: string): Promise<WarehouseDocument> {
    const warehouse = await this.findById(warehouseId);
    
    await this.addTransaction(warehouseId, {
      productId: warehouse.productId.toString(),
      quantity: adjustStockDto.quantity - warehouse.quantity,
      type: 'adjustment',
      userId,
      note: adjustStockDto.note,
    });

    return this.findById(warehouseId);
  }

  async getLowStockItems(threshold?: number): Promise<WarehouseDocument[]> {
    const minStock = threshold || 10;
    return this.warehouseModel
      .find({
        isActive: true,
        availableQuantity: { $lte: minStock },
      })
      .sort({ availableQuantity: 1 })
      .exec();
  }
}

