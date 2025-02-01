import { Fertilizer } from '../entities/Fertilizer';
import { Seed } from '../entities/Seed';

export class ValidationService {
  static validateCompatibility(fertilizers: Fertilizer[], seeds: Seed[]) {
    for (const fertilizer of fertilizers) {
      const incompatibleSeeds = seeds.filter(seed =>
        !fertilizer.compatibleSeeds.some(s => s.id === seed.id)
      );

      if (incompatibleSeeds.length > 0) {
        throw new Error(
          `Fertilizer ${fertilizer.name} incompatible with: ` +
          `${incompatibleSeeds.map(s => s.name).join(', ')}`
        );
      }
    }
  }

  static validateLandSize(requestedSize: number, farmerLandSize: number) {
    if (requestedSize > farmerLandSize) {
      throw new Error('Requested land size exceeds farmer\'s available land');
    }
  }
}
