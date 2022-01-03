import { Listener, Subjects, ExpirationCompleteEvent, OrderStatus } from "@wmltickets/common";
import { Message, Stan } from 'node-nats-streaming';
import { natsWrapper } from "../../nats-wrapper";
import { queueGroupName } from "./queueGroupName";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { OrderCreatedPublisher } from "../publishers/order-created-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;


  constructor(client: Stan) {
    super(client);
    console.log(`*** ExpirationCompleteListener started up!`);
  }
  
  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    console.log(`[ExpirationCompleteListener:onMessage] **************************************`);
    console.log(data.orderId);
    const order = await Order.findById(data.orderId).populate('ticket');

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === OrderStatus.Complete) {
      // We are done here so Ack the message and exit
      msg.ack();
      return;
    }
    
    order.set({ status: OrderStatus.Cancelled });
    await order.save();
    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: { id: order.ticket.id }
    });
    console.log("[ExpirationCompleteListener] published Order Cancelled Event");

    msg.ack();
  }

}