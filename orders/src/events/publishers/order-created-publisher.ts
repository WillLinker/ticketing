import { Publisher, OrderCreatedEvent, Subjects } from "@wmltickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;

}
