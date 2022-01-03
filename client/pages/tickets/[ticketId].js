import Router from "next/router";
import useRequest from '../../hooks/use-request';

const TicketShow = ({ currentUser, ticket }) => {
  //console.log("TicketShow -- Load instance, User: " + currentUser.email);
  //console.log(ticket);
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: { ticketId: ticket.id },
    onSuccess: (order) => { Router.push('/orders/[orderId]', `/orders/${order.id}`) }
  });
  return (
    <div>
      <h1>Ticket Information</h1>
     <h2>{ticket.title}</h2>
     <h4>Price: {ticket.price}</h4>
     {errors}
     <button onClick={(e) => doRequest()} className='btn btn-primary'>Purchase</button>
    </div>
  );
}
TicketShow.getInitialProps = async (context, client, currentUser) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  
  return { ticket: data };  
};

export default TicketShow;