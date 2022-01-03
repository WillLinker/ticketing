import request from 'supertest';
import { app } from '../../app';

it('details about the current user', async () => {

  const cookie = await global.signin();
  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .expect(200); 
    console.debug(`[currentuser] HTTP Status: %d `, response.statusCode);
    console.debug(response.body);
    console.debug("[currentuser:Cookie]  " + response.get("Set-Cookie"));

    expect(response.body.currentUser.email).toEqual("test@test.com");
    
});

it('response with null if not authenticated', async () => {

  const response = await request(app)
    .get('/api/users/currentuser')
    .expect(200); 
    console.debug(`[currentuser] HTTP Status: %d `, response.statusCode);
    console.debug(response.body);
    console.debug("[currentuser:Cookie]  " + response.get("Set-Cookie"));

    expect(response.body.currentUser).toEqual(null);
    
});
