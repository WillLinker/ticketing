import mongoose  from 'mongoose';
import request from 'supertest';
import { couldStartTrivia } from 'typescript';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';
import { OrderStatus } from '@wmltickets/common';
import { Order } from '../../models/order';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

jest.mock('../../stripe');

test('can only be accessed if the user is signed in',async () => {
  const response = await request(app).post('/api/payments').send({});
  expect(response.statusCode).toEqual(401);
});

test('Returns a 404 when attempting to purchase an Order that does not exist.', async () => {
  const orderId = new mongoose.Types.ObjectId();
  const response = await request(app).post('/api/payments')
                                     .set('Cookie', global.signin())
                                     .send({ token: 'asdfasfdsa', orderId })
                                     .expect(404); 
});

test('Returns a 401 when attempting to purchase an Order that does not belong to the user.', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created
  });
  await order.save();  const ticketId = new mongoose.Types.ObjectId();

  const response = await request(app).post('/api/payments')
                                     .set('Cookie', global.signin())
                                     .send({ token: 'asdfasfdsa', orderId: order.id })
                                     .expect(401); 
});

test('Returns a 400 when attempting to purchase an Order that has been cancelled', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled
  });
  await order.save();  const ticketId = new mongoose.Types.ObjectId();

  const response = await request(app).post('/api/payments')
                                     .set('Cookie', global.signin(userId))
                                     .send({ token: 'asdfasfdsa', orderId: order.id })
                                     .expect(400); 
});

test('Returns a 201 with valid inputs', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    price: 20,
    status: OrderStatus.Created
  });
  await order.save();  
  const ticketId = new mongoose.Types.ObjectId();

  const response = await request(app).post('/api/payments')
                                     .set('Cookie', global.signin(userId))
                                     .send({ token: 'tok_visa', orderId: order.id })
                                     .expect(201); 

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

  expect(chargeOptions.source).toEqual('tok_visa');
  expect(chargeOptions.amount).toEqual(order.price * 100);
  expect(chargeOptions.currency).toEqual('usd');

});

test('Verify the payment was recorded', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    price: 20,
    status: OrderStatus.Created
  });
  await order.save();  
  const ticketId = new mongoose.Types.ObjectId();

  const response = await request(app).post('/api/payments')
                                     .set('Cookie', global.signin(userId))
                                     .send({ token: 'tok_visa', orderId: order.id })
                                     .expect(201); 

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

  expect(chargeOptions.source).toEqual('tok_visa');
  expect(chargeOptions.amount).toEqual(order.price * 100);
  expect(chargeOptions.currency).toEqual('usd');

  //console.log(response.body);  
  const { success } = response.body;
  //console.log(`[new.test.ts] success: ${success}`);
  expect(success).toEqual(true);
  
  const newPayment = await Payment.findOne({ orderId: order.id });
  // console.log("------ payment found-----------------")
  // console.log(newPayment);
  /*
   * {
        orderId: '61d25f176a9beba720d0cbd9',
        stripeId: '61d25f176a9beba720d0cbde',
   * }
   */
  expect(newPayment).not.toBeNull();
  expect(newPayment!.orderId).toEqual(order.id);
  expect(newPayment!.stripeId).not.toBeNull();
});