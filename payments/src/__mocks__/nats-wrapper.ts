import nats, { Stan } from 'node-nats-streaming';


export const natsWrapper = {
  client: {
    // publish: (subject: string, data: string, callback: () => void) => {
    //   console.log(`[mock publish] subject: "${subject}", data: ${data}`);
    //   callback();
    // },
    publish: jest.fn().mockImplementation(
       (subject: string, data: string, callback: () => void) => {
         console.log(`[mock publish] subject: "${subject}", data: ${data}`);
         callback();
    })
  },
};
/*

 */