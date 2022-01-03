import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

declare global {
  var signin: () => Promise<string>;
}

let mongo: any;
beforeAll( async () => {

  process.env.JWT_KEY = 'a1234';
  mongo = await MongoMemoryServer.create(); //new MongoMemoryServer();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri, { });
});

beforeEach( async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll( async () => {
  await mongo.stop();
  await mongoose.connection.close();
  console.warn("**** Don't shutdown Mongo/Mongoose! ****");
});

global.signin = async () => {
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201); 
  
  console.debug(`[global.signin] HTTP Status: %d`, response.statusCode);
  //console.debug(response.body);
  const cookie = response.get('set-Cookie');
  //console.debug("[global.signin] set-Cookie: " + cookie);

  return response.get('set-Cookie');
};