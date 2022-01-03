import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: "test@test.com",
      password: "password"
    })
    .expect(201); // status code expected back
});

it('returns a 400 for an invalid email',async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: "bad-email",
      password: "password"
    })
    .expect(400); // status code expected back  
});

it('returns a 400 for a invalid password',async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: "test@test.com",
      password: "pw"
    })
    .expect(400); // status code expected back  
});

it('returns a 400 for with missing email and password',async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: "test@test.com"})
    .expect(400);

    await request(app)
    .post('/api/users/signup')
    .send({ password: "password"})
    .expect(400);

  return request(app)
    .post('/api/users/signup')
    .send({})
    .expect(400); // status code expected back  
});

it('disallows dupicate email signups', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: "test@test.com",
      password: "password"
    })
    .expect(201); // status code expected back

    return request(app)
    .post('/api/users/signup')
    .send({
      email: "test@test.com",
      password: "password"
    })
    .expect(400); // status code expected back
  });

  it('it sets a cookie after successful signup', async () => {
    const response = await request(app)
      .post('/api/users/signup')
      .send({
        email: "test@test.com",
        password: "password"
      })
      .expect(201); // status code expected back

      expect(response.get('Set-Cookie')).toBeDefined();
    });
  