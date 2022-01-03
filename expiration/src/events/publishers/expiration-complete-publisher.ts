import { Publisher, Subjects, ExpirationCompleteEvent } from "@wmltickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  
}

