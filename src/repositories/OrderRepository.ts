import { EntityRepository, Repository } from 'typeorm';
import { Order } from '../entities/Order';

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
  async findOrdersWithRelations() {
    return this.createQueryBuilder('order')
      .leftJoinAndSelect('order.farmer', 'farmer')
      .leftJoinAndSelect('order.fertilizers', 'fertilizer')
      .leftJoinAndSelect('order.seeds', 'seed')
      .getMany();
  }
}
