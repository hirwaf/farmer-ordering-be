import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import routes from "./routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(json());

// Database initialization
AppDataSource.initialize()
  .then(() => console.log('Database connected'))
  .catch((error: any) => console.log('Database connection error:', error));

// Routes
app.use("/", routes);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

export default app;