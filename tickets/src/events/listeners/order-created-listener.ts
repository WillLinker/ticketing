import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@wmltickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from './queueGroupName';
import { Ticket } from "../../model/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener <OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;

  //onMessage(data: { id: string; version: number; status: OrderStatus; userId: string; expiresAt: string; ticket: { id: string; price: number; }; }, msg: Message): void {
    
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the Ticket be reserved
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // Mark the ticket as being reserved by setting the orderId and save the ticket
    ticket.set({ orderId: data.id });
    await ticket.save();

    const publisher = new TicketUpdatedPublisher(this.client);
    await publisher.publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version
          });

    // Ack the message.
    msg.ack();
  }

}