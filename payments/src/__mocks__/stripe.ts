import mongoose from "mongoose";

export const stripe = {
  charges: {
    //create: jest.fn().mockResolvedValue({})
    create: jest.fn().mockImplementation(
      ({currency, amount, source}) => {
        console.log(`[mock stripe.create] currency: "${currency}", amount: ${amount}, source: ${source}`);
       return { id: new mongoose.Types.ObjectId().toHexString() }
   })
  }
}
/*
await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,   // our price is in dollars but Stripe needs it in cents.
      source: token
    });
*/