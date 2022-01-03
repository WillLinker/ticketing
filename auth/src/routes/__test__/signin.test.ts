import request from 'supertest';
import { app } from '../../app';

it('fails when email does not exist', async () => {
  console.debug("------------------ bad email ------------------");
  await request(app)
    .post('/api/users/signin')
    .send({
      email: "nouser@test.com",
      password: "password"
    })
    .expect(400); // status code expected back
});
it('fails when bad password', async () => {
  console.debug("------------------ create user first ------------------");
  let response = await request(app)
    .post('/api/users/signup')
    .send({
      email: "test2@test.com",
      password: "password"
    })
    .expect(201); 

  console.debug("[JWT] " + response.get("Set-Cookie"));
  console.debug("-------- User as created so Sign out --------------------------");
  response = await request(app)
    .post('/api/users/signout')
    .send({
      email: "test2@test.com",
      password: "password"
    })
    .expect(200); 
  console.debug(`[signout] HTTP Status: %d, Body: %s `, response.statusCode, response.body);
  console.debug("[JWT] " + response.get("Set-Cookie"));
  //console.debug("------------------ bad password ------------------");

  response = await request(app)
    .post('/api/users/signin')
    .send({
      email: "test2@test.com",
      password: "A"
    }).expect(400); 

    //console.debug(`HTTP Status: %d, Body: %s `, response.statusCode, response.body);
    //console.debug("[JWT] " + response.get("Set-Cookie"));
    
});
/*
console.debug
      Response {
        request: Test {
          _data: { email: 'test2@test.com', password: 'badpw' }
        },
        req: ClientRequest {
          res: IncomingMessage {
            statusCode: 200,
            statusMessage: 'OK',
            text: '{"email":"test2@test.com","id":"61c801427018cff06f7e4bf9"}',
          },
        },
        text: '{"email":"test2@test.com","id":"61c801427018cff06f7e4bf9"}',
        body: { email: 'test2@test.com', id: '61c801427018cff06f7e4bf9' },
        : 200
      }

*/