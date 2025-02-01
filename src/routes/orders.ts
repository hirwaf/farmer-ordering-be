import express from 'express';
import { OrderController } from '../controllers/OrderController';

const router = express.Router();
const orderController = new OrderController();

router.post('/', orderController.createOrder.bind(orderController));
router.get('/', orderController.getOrders.bind(orderController));

export default router;