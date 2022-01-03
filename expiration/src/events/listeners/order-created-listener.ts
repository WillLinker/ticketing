import { Listener, OrderCreatedEvent, Subjects } from "@wmltickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from './queueGroupName';
import { expirationQueue } from "../../queues/expiration.queue";

export class OrderCreatedListener extends Listener <OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;

  constructor(client: any) {
    super(client);
    console.log(`[OrderCreatedListener] Starting Listener Subject: ${this.subject}, Queue Group: ${this.queueGroupName}`);
  }
  
  //onMessage(data: { id: string; version: number; status: OrderStatus; userId: string; expiresAt: string; ticket: { id: string; price: number; }; }, msg: Message) 
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    console.log(`[OrderCreatedListener::onMessage] Timestamp: ${msg.getTimestamp()}`);
    console.log(data);

    try {
      const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
      console.log(`[OrderCreatedListener::onMessage] queue the event to Redis now, delay ${delay}ms`);

      await expirationQueue.add({ orderId: data.id }, { delay });
      msg.ack();
    }
    catch(err) {
      console.error(`[OrderCreatedListener::onMessage] Error: `);
      console.error(err);
    }
  }

}