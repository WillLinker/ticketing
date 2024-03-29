import { Publisher } from "../../../common/src/events/base-publisher";
import { Subjects } from '../../../common/src/events/subjects';
import { TicketCreatedEvent } from '../../../common/src/events/TicketCreatedEvent';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;

};