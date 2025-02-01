import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, UpdateDateColumn, JoinTable} from 'typeorm';
import { Fertilizer } from './Fertilizer';
import { Order } from './Order';

@Entity()
export class Seed {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('float')
  maxPerAcre: number; // kg/acre

  @ManyToMany(() => Fertilizer, (fertilizer) => fertilizer.compatibleSeeds)
  compatibleFertilizers: Fertilizer[];

  @ManyToMany(() => Order, (order) => order.seeds)
  orders: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}