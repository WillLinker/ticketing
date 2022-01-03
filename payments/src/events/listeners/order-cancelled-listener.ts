import { Listener, OrderCancelledEvent, OrderStatus, Subjects  } from "@wmltickets/common";
import { Message, Stan } from "node-nats-streaming";
import { queueGroupName } from "./queueGroupName";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

//  {
//     id: string;
//     version: number;
//     ticket: {
//         id: string;
//     };
// }
  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    console.log(`[OrderCreateListener::onMessage] id: ${data.id}, version: ${data.version}, ticket.id: ${data.ticket.id}`);
    const order = await Order.findOne({ id: data.id, version: data.version - 1 });
    if (!order) {
      //throw new Error('Order not found!');
      console.error(`[OrderCreateListener::onMessage] Order ${data.id} was not found, what shoud I really do with it.  ACK for now!!!`);
      msg.ack();
      return;
    }
    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}