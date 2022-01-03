import { Listener, TicketCreatedEvent, Subjects } from "@wmltickets/common";
import { Message, Stan } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queueGroupName";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = queueGroupName;

  constructor(client: Stan) {
    super(client);
    console.log(`*** TicketCreatedListener started up!`);
  }
  //onMessage(data: { id: string; title: string; price: number; userId: string; }, msg: Message): void {
  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;
    //console.warn(`[TicketCreatedListener] id: ${id}, version: ${data.version}`);
    console.log(`[TicketCreatedListener:onMessage] id: ${id}, title: ${title}, price:  ${price}`);
    const ticket = Ticket.build({ id, title, price });
    await ticket.save();
    msg.ack();
  }
}
