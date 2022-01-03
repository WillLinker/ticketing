import { Publisher, OrderCancelledEvent, Subjects } from "@wmltickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

}
