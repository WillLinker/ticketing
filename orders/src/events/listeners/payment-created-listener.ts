import { Listener, PaymentCreatedEvent, Subjects } from "@wmltickets/common";
import { Message, Stan } from "node-nats-streaming";
import { queueGroupName } from "./queueGroupName";
import { Order, OrderStatus } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName: string = queueGroupName;

  constructor(client: Stan) {
    super(client);
    console.log(`*** PaymentCreatedListener started up!`);
  }
  
  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const { id, orderId, stripeId } = data;
    //console.warn(`[PaymentCreatedListener] id: ${id}, version: ${data.version}`);
    console.log(`[PaymentCreatedListener:onMessage] id: ${id}, orderId: ${orderId}, stripeId: ${stripeId}`);
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    order.set({ status: OrderStatus.Complete });
    await order.save();
    /*
     *  We really should publish an Order Completed event here.
     */
    msg.ack();
  }
}
