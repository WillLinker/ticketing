import { Listener, OrderCreatedEvent, OrderStatus, Subjects  } from "@wmltickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queueGroupName";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  //{ id: string; version: number; status: OrderStatus; userId: string; expiresAt: string; ticket: { id: string; price: number; }; }
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    console.log(`[OrderCreateListener::onMessage] id: ${data.id}, price: ${data.ticket.price}, status: ${data.status}, userId: ${data.userId}, version: ${data.version}`);
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version
    });
    await order.save();
    msg.ack();
  }

}