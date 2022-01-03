"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listener = void 0;
class Listener {
    constructor(client) {
        this.ackWait = (5 * 1000); // Default to 5 seconds.
        this.client = client;
    }
    subscriptionOptions() {
        return this.client.subscriptionOptions()
            .setManualAckMode(true)
            .setDeliverAllAvailable()
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName);
    }
    listen() {
        const subscription = this.client.subscribe(this.subject, this.queueGroupName, this.subscriptionOptions());
        console.log(`[base-listener] Subscribed to Subject: "${this.subject}" with Queue Group: "${this.queueGroupName}"`);
        subscription.on('message', (msg) => {
            const messageDate = msg.getTimestamp();
            //console.log(`[Received Message:] Subject: "${msg.getSubject()}", Queue Group: "${this.queueGroupName}", Seq:${msg.getSequence()}`);
            const parsed = this.parseMessage(msg);
            try {
                this.onMessage(parsed, msg);
            }
            catch (err) {
                console.error(`[base-listener:onMessage] Caugh Error:`, err);
            }
        });
    }
    parseMessage(msg) {
        const data = msg.getData();
        return JSON.parse(typeof data === 'string' ? data : data.toString('utf-8'));
    }
}
exports.Listener = Listener;
