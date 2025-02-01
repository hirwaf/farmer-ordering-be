import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn, JoinTable
} from "typeorm";
import { Farmer } from "./Farmer";
import { Fertilizer } from "./Fertilizer";
import { Seed } from "./Seed";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("float")
  landSize: number;

  @Column("float")
  fertilizerQty: number;

  @Column("float")
  seedQty: number;

  @Column({ default: "PENDING" })
  status: "APPROVED" | "REJECTED" | "PENDING";

  @ManyToOne(() => Farmer, (farmer) => farmer.orders)
  farmer: Farmer;

  @ManyToMany(() => Fertilizer, (fertilizer) => fertilizer.orders)
  @JoinTable()
  fertilizers: Fertilizer[];

  @ManyToMany(() => Seed, (seed) => seed.orders)
  @JoinTable()
  seeds: Seed[];

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}