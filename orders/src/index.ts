
import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';

const start = async () => {
  console.log("[orders] Starting....");
  if (!process.env.JWT_KEY) {
    throw new Error("Missing JWT Key variable!") 
  }
  if (!process.env.MONGO_URI) {
    throw new Error("Missing MONGO_URI variable!") 
  }
  if (!process.env.NATS_URL) {
    throw new Error("Missing NATS_URL variable!") 
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("Missing NATS_CLUSTER_ID variable!") 
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("Missing NATS_CLIENT_ID variable!") 
  }

  try {
//    await natsWrapper.connect('ticketing', 'abc', 'http://nats-srv:4222' );
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL );
    natsWrapper.client.on('close', () => {
      console.log("NATS conneciton closed");
      process.exit();
    });
  
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());
    /*
     * Start the listeners now!
     */
    console.log("index.ts updated -- 1");
    new ExpirationCompleteListener(natsWrapper.client).listen();
    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();
    /*
     */
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB: " + process.env.MONGO_URI);
  }
  catch(err) {
    console.error(err);
  }
  app.listen(3000, () => {
    console.log("Listening on port 3000!!!!");
  } );
};

start();
