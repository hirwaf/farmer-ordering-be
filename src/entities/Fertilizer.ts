import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, UpdateDateColumn, JoinTable} from 'typeorm';
import { Seed } from './Seed';
import { Order } from './Order';

@Entity()
export class Fertilizer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('float')
  maxPerAcre: number; // kg/acre

  @ManyToMany(() => Seed, (seed) => seed.compatibleFertilizers)
  compatibleSeeds: Seed[];

  @ManyToMany(() => Order, (order) => order.fertilizers)
  orders: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}