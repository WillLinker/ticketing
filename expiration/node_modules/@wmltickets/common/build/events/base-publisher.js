"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Publisher = void 0;
;
class Publisher {
    constructor(client) {
        this.ackWait = (5 * 1000); // Default to 5 seconds.
        this.client = client;
    }
    publish(data) {
        return new Promise((resolve, reject) => {
            console.log(`[base-publisher] publish("${JSON.stringify(data)}")  Subject: ${this.subject}`);
            this.client.publish(this.subject, JSON.stringify(data), (err) => {
                if (err) {
                    return reject(err);
                }
                //console.log("[base-publisher]    Event published!");
                resolve();
            });
        });
    }
    ;
}
exports.Publisher = Publisher;
