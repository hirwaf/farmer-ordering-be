import { describe, beforeEach, test, expect, jest } from '@jest/globals';
import { Request, Response } from 'express';
import { OrderController } from '../controllers/OrderController';
import { OrderService } from '../services/OrderService';
import { AppDataSource } from '../config/database';

// Mock the OrderService and AppDataSource
jest.mock('../services/OrderService');
jest.mock('../config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn()
  }
}));

describe('OrderController', () => {
  let orderController: OrderController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockOrderService: jest.Mocked<OrderService>;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Initialize controller
    orderController = new OrderController();

    // Setup response mock
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mock repository methods
    const mockRepository = {
      findByIds: jest.fn()
    };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);
  });

  describe('createOrder', () => {
    beforeEach(() => {
      // Setup request mock for create order
      mockRequest = {
        body: {
          landSize: 10,
          farmerId: 1,
          fertilizerIds: [1, 2],
          seedIds: [1]
        }
      };
    });

    test('should successfully create an order', async () => {
      // Mock repository responses
      const mockFertilizers = [
        { id: 1, name: 'Fert1' },
        { id: 2, name: 'Fert2' }
      ];
      const mockSeeds = [{ id: 1, name: 'Seed1' }];

      const mockRepository = AppDataSource.getRepository as jest.Mock;
      mockRepository().findByIds.mockImplementation((ids) => {
        if (ids.includes(1) && ids.includes(2)) return Promise.resolve(mockFertilizers);
        return Promise.resolve(mockSeeds);
      });

      // Mock service response
      const mockOrder = {
        id: 1,
        landSize: 10,
        fertilizerQty: 30,
        seedQty: 10
      };
      (OrderService.prototype.createOrder as jest.Mock).mockResolvedValue(mockOrder);

      await orderController.createOrder(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockOrder);
    });

    test('should handle invalid input data', async () => {
      mockRequest.body.landSize = -1; // Invalid land size

      const error = new Error('Invalid land size');
      (OrderService.prototype.createOrder as jest.Mock).mockRejectedValue(error);

      await orderController.createOrder(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid land size' });
    });

    test('should handle unexpected errors', async () => {
      (OrderService.prototype.createOrder as jest.Mock).mockRejectedValue('Unexpected error');

      await orderController.createOrder(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'An unexpected error occurred' });
    });
  });

  describe('getOrders', () => {
    beforeEach(() => {
      // Setup request mock for get orders
      mockRequest = {
        query: {
          page: '1'
        }
      };
    });

    test('should successfully get paginated orders', async () => {
      const mockPaginatedResult = {
        orders: [
          { id: 1, landSize: 10 },
          { id: 2, landSize: 20 }
        ],
        total: 2,
        page: 1,
        totalPages: 1
      };

      (OrderService.prototype.getPaginatedOrders as jest.Mock).mockResolvedValue(mockPaginatedResult);

      await orderController.getOrders(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith(mockPaginatedResult);
    });

    test('should use default page 1 when page parameter is not provided', async () => {
      mockRequest.query = {};

      const mockPaginatedResult = {
        orders: [],
        total: 0,
        page: 1,
        totalPages: 1
      };

      (OrderService.prototype.getPaginatedOrders as jest.Mock).mockResolvedValue(mockPaginatedResult);

      await orderController.getOrders(mockRequest as Request, mockResponse as Response);

      expect(OrderService.prototype.getPaginatedOrders).toHaveBeenCalledWith(1);
    });

    test('should handle service errors', async () => {
      const error = new Error('Database error');
      (OrderService.prototype.getPaginatedOrders as jest.Mock).mockRejectedValue(error);

      await orderController.getOrders(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Database error' });
    });

    test('should handle unexpected errors', async () => {
      (OrderService.prototype.getPaginatedOrders as jest.Mock).mockRejectedValue('Unexpected error');

      await orderController.getOrders(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'An unexpected error occurred' });
    });
  });
});