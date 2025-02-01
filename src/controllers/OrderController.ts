import { Request, Response } from 'express';
import { OrderService } from '../services/OrderService';
import { AppDataSource } from '../config/database';
import { Fertilizer } from '../entities/Fertilizer';
import { Seed } from '../entities/Seed';

export class OrderController {
  private orderService = new OrderService();

  async createOrder(req: Request, res: Response) {
    try {
      const { landSize, farmerId, fertilizerIds, seedIds } = req.body;

      const fertilizerRepository = AppDataSource.getRepository(Fertilizer);
      const seedRepository = AppDataSource.getRepository(Seed);

      const [fertilizers, seeds] = await Promise.all([
        fertilizerRepository.findByIds(fertilizerIds),
        seedRepository.findByIds(seedIds)
      ]);

      const order = await this.orderService.createOrder(
        landSize,
        farmerId,
        fertilizers,
        seeds
      );

      res.status(201).json(order);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unexpected error occurred' });
      }
    }
  }

  async getOrders(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const result = await this.orderService.getPaginatedOrders(page);
      res.json(result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  }
}