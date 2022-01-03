import { Listener, TicketUpdatedEvent, Subjects } from "@wmltickets/common";
import { Message, Stan } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queueGroupName";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName: string = queueGroupName;

  constructor(client: Stan) {
    super(client);
    console.log(`*** TicketUpdatedListener started up!`);
  }
  //onMessage(data: { id: string; title: string; price: number; userId: string; }, msg: Message): void {
  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    console.warn(`[TicketUpdateListener] id: ${data.id}, version: ${data.version}`);
    //const ticket = await Ticket.findById(data.id);
    //const ticket = await Ticket.findOne({ _id: data.id, version: data.version - 1 });
    const ticket = await Ticket.findByEvent(data);
    if (ticket) {
      console.log(`              **** Ticket found ${data.version}`);
      const { title, price } = data;
      ticket.set({ title, price }); 
      await ticket.save();
      msg.ack();
      return;
    }

    //console.error(`***\n*** Ticket Not Found: Ticket({ _id: ${data.id}, version: ${data.version} - 1 })\n***`);
    //msg.ack();
  }
  
}