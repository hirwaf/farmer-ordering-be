import "reflect-metadata";
import { DataSource } from "typeorm";
import {Farmer} from "../entities/Farmer";
import {Fertilizer} from "../entities/Fertilizer";
import {Seed} from "../entities/Seed";
import {Order} from "../entities/Order";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  port: parseInt(process.env.POSTGRES_PORT || "5432"),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: process.env.NODE_ENV !== "production",
  logging: false,
  entities: [Farmer, Fertilizer, Seed, Order],
  migrations: [],
  subscribers: [],
  ssl: false
});
