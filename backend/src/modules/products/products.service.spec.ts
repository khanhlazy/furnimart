import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ProductsService } from './products.service';
import { Product } from './schemas/product.schema';

describe('ProductsService', () => {
  let service: ProductsService;
  let mockModel: any;

  const mockProduct = {
    _id: '507f1f77bcf86cd799439011',
    name: 'Test Product',
    description: 'Test Description',
    price: 1000000,
    discount: 10,
    stock: 50,
    category: 'sofa',
    rating: 4.5,
    reviewCount: 10,
    images: [],
    isActive: true,
  };

  beforeEach(async () => {
    mockModel = {
      create: jest.fn().mockResolvedValue(mockProduct),
      find: jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          skip: jest.fn().mockResolvedValue([mockProduct]),
        }),
      }),
      findById: jest.fn().mockResolvedValue(mockProduct),
      findByIdAndUpdate: jest.fn().mockResolvedValue(mockProduct),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 1000000,
        stock: 50,
        category: 'sofa',
      };

      const result = await service.create(createProductDto);

      expect(result).toEqual(mockProduct);
      expect(mockModel.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('findAll', () => {
    it('should return array of products', async () => {
      const result = await service.findAll();

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toEqual(mockProduct);
    });

    it('should filter by category', async () => {
      await service.findAll({ category: 'sofa' });

      expect(mockModel.find).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a product by id', async () => {
      const result = await service.findById('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockProduct);
      expect(mockModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });
  });

  describe('decreaseStock', () => {
    it('should decrease stock', async () => {
      await service.decreaseStock('507f1f77bcf86cd799439011', 5);

      expect(mockModel.findByIdAndUpdate).toHaveBeenCalled();
    });
  });
});
