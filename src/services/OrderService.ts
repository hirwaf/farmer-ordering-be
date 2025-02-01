import { AppDataSource } from '../config/database';
import { Order } from '../entities/Order';
import { Farmer } from '../entities/Farmer';
import { Fertilizer } from '../entities/Fertilizer';
import { Seed } from '../entities/Seed';
import { ValidationService } from './ValidationService';

export class OrderService {
  private orderRepository = AppDataSource.getRepository(Order);
  private farmerRepository = AppDataSource.getRepository(Farmer);

  async createOrder(
    landSize: number,
    farmerId: number,
    fertilizers: Fertilizer[],
    seeds: Seed[]
  ) {
    const farmer = await this.farmerRepository.findOneBy({ id: farmerId });
    if (!farmer) throw new Error('Farmer not found');

    ValidationService.validateLandSize(landSize, farmer.landSize);
    ValidationService.validateCompatibility(fertilizers, seeds);

    const quantities = this.calculateQuantities(landSize);

    const order = this.orderRepository.create({
      landSize,
      ...quantities,
      farmer,
      fertilizers,
      seeds
    });

    return this.orderRepository.save(order);
  }

  private calculateQuantities(landSize: number) {
    return {
      fertilizerQty: Math.min(landSize * 3, 3000),
      seedQty: Math.min(landSize * 1, 1000)
    };
  }

  async getPaginatedOrders(page: number = 1) {
    const take = 5;
    const [orders, total] = await this.orderRepository.findAndCount({
      take,
      skip: (page - 1) * take,
      order: { createdAt: 'DESC' },
      relations: ['farmer', 'fertilizers', 'seeds']
    });

    return { orders, total, page, totalPages: Math.ceil(total / take) };
  }
}
