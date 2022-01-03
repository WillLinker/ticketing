
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

const start = async () => {
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
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL );
    natsWrapper.client.on('close', () => {
      console.log("NATS conneciton closed");
      process.exit();
    });
  
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    //console.log(process.env); 
    console.log("[expiration::index.ts] Start the OrderCreatedListener now!"); 
    const listener = new OrderCreatedListener(natsWrapper.client).listen(); 
    //console.log(`[expiration::index.ts] Redis Environment Variable: ${process.env.REDIS_HOST}`);
  }
  catch(err) {
    console.error(err);
  }
};

start();