import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  var signin: () => string[];
}
/*
 * Use a mock version of the nats-wrapper 
 */
jest.mock('../nats-wrapper');

let mongo: any;
beforeAll( async () => {
  process.env.JWT_KEY = 'a1234';

  if (mongo == null) {
    mongo = await MongoMemoryServer.create(); //new MongoMemoryServer();
  }

  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, { });
});

beforeEach( async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});


afterAll( async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  // Build a JWT payload {id, email, iat } and generate the JWT into the session { jwt: value }
  const session = { 
      jwt: jwt.sign({ id, email: "test@inline-testing.com" }
                    ,  process.env.JWT_KEY!) 
    };

  // Turn that session into JSON and Base64 encode it.
  const base64Encoded = Buffer.from(JSON.stringify(session)).toString('base64');

  // Return a string that is the cookie with the encoded data.
  return [`session=${base64Encoded}`];
};