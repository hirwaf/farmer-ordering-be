import { EntityRepository, Repository } from 'typeorm';
import { Farmer } from '../entities/Farmer';

@EntityRepository(Farmer)
export class FarmerRepository extends Repository<Farmer> {
  async findFarmersAlphabetically() {
    return this.createQueryBuilder('farmer')
      .orderBy('farmer.name', 'ASC')
      .getMany();
  }
}
