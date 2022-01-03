import React from 'react';
import { useState, useEffect } from "react";
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const OrderShow = ({ currentUser, order }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: { orderId: order.id },
    onSuccess: (payment) => Router.push('/orders')
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft/1000));
    }  
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => { clearInterval(timerId); };
  }, [order]);
  
  if (timeLeft < 0) {
    return <div>Order Expired</div>
  }
  return (
  <div>
    <h1>Order Show</h1>
    <h3>You have {timeLeft} seconds until your order expires!</h3>
    <br />
    <StripeCheckout 
      token={({ id }) => doRequest({ token: id })}
      stripeKey='pk_test_51KDdnOKeCS85z8HQUhrh2HIk7bgah5Rjj795lV2imoRcpXNqtJvqjE6jW5QoCFhr2D1HuPWmAlMaxDvBxay0g4hf00Cjuboesp'
      amount={order.ticket.price * 100}
      email={currentUser.email}
    />
    {errors}
  </div>);
}

OrderShow.getInitialProps = async (context, client, currentUser) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  
  return { order: data };  
};
export default OrderShow;