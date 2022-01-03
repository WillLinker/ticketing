import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error("you must connect before you can get the client!");
    }

    return this._client;
  }
  connect(clusterId: string, clientId: string, url: string) {
    console.log(`Attempting to connected to NATS, Cluster Id: "${clusterId}", Client ID: "${clientId}", URL: ${url}`); 
    //const stan = nats.connect('ticketing', 'abc', { url: 'http://localhost:4222' });
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this.client!.on('connect', ()  => { 
        console.log(`Connected to NATS, Cluster Id: "${clusterId}", Client ID: "${clientId}", URL: ${url}`); 
        resolve(); 
      });
      this.client?.on('error', (err) => { reject(err); }); 
    });
  };
}
export const natsWrapper = new NatsWrapper();

