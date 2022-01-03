import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@wmltickets/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Order } from "../models/order";
import { stripe } from '../stripe';
import { Payment } from "../models/payment";
import { natsWrapper } from "../nats-wrapper";
import { PaymentCreatedPublisher } from "../events/publishers/payment-create-publisher";

const router = express.Router();

router.post('/api/payments', 
  requireAuth, 
  [
    body('token').not().isEmpty(),
    body('orderId').not().isEmpty(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    console.log(`[createChargeRouter(new.ts)] orderId: ${orderId}`);
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for a Cancelled order!");
    }

    const charge = await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100,   // our price is in dollars but Stripe needs it in cents.
        source: token
      });

    // console.log("---------------------------------------------------------------------")
    // console.log(charge); 
    // console.log("---------------------------------------------------------------------")
    const { id } = charge;
    console.log(`[new.ts] orderId: ${orderId}, stripeId ${id}`);
    const payment = Payment.build({ orderId, stripeId: id });
    await payment.save();

    // leave off the await if we don't want to make sure the publish worked!
    await new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            orderId: payment.orderId,
            stripeId: payment.stripeId
          });

    res.status(201).send({ success: true, id: payment.id });    
});

export { router as createChargeRouter };