import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TicketCreatedEvent } from "@wmltickets/common";
//import { Subjects } from './subjects';
//import { TicketCreatedEvent } from './TicketCreatedEvent';

export class TicketedCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = 'payments-service';

  onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
    console.log('[onMessage]', data);
    console.log(data.title);

    msg.ack();
  }
}