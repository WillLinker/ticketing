import { Publisher, Subjects, TicketUpdatedEvent } from "@wmltickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  
}
