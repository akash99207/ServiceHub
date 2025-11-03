import { BookService } from "../models/bookService.model.js";
import { Order } from "../models/order.model.js";

export const orderData = async (req, res) => {
  const order = req.body;
  try {
    const orderInfo = await Order.create(order);
    console.log(orderInfo);
    const userId = orderInfo?.userId;
    const serviceId = orderInfo?.serviceId;
    res.status(201).json({ message: "Order Details: ", orderInfo });
    if (orderInfo) {
      await BookService.create({ userId, serviceId });
    }
  } catch (error) {
    console.log("Error in order: ", error);
    res.status(401).json({ errors: "Error in order creation" });
  }
};