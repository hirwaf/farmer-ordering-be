import app from './app';
import { AppDataSource } from './config/database';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received: closing server');
  server.close(async () => {
    await AppDataSource.destroy();
    console.log('Server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received: closing server');
  server.close(async () => {
    await AppDataSource.destroy();
    console.log('Server closed');
  });
});
