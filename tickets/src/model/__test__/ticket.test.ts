import { Ticket } from "../ticket";

test('implements optimisitic concurrency control using verison', async () => {
  // Create Ticket
  const ticket = Ticket.build({ title: 'The Who', price: 20, userId: 'will'});

  // Save to Database
  await ticket.save();

  // Fetch the ticket twice (two variables)
  const ticket1 = await Ticket.findById(ticket.id);
  const ticket2 = await Ticket.findById(ticket.id);
  
  // Change both instances
  ticket1!.set({ price: 10 });
  ticket2!.set({ price: 15 });
  
  // Save ticket1 (Should work)
  await ticket1!.save();

  // Save ticket2 (Should fail)
  try { 
    await ticket2!.save();
  }
  catch(err) {
    return;  // We should be getting an error!
  }

  throw new Error("Should not bet to this point in test!");

});

test('increment verison on multiple saves', async () => {
  // Create Ticket
  const ticket = Ticket.build({ title: 'The Who', price: 20, userId: 'will'});
  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);

});
