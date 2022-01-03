import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@wmltickets/common';
import { createChargeRouter } from './routes/new';
/*
 * Custom middleware and errors.
 */
const app = express();
//app.set('trust proxy', true);   // Required for HTTPS since we are behind the ngix proxy.

app.use(json());
app.use(cookieSession({ signed: false, secure: false }));  
                      /* 
                       * test environment must "secure: false"
                       * Use: secure: process.env.NODE_ENV !== 'test'      
                       */
app.use(currentUser);  // add middle ware to add current user

app.use(createChargeRouter);

app.get('*', async (req, res) => {
  console.log(`[payments:app.ts] app.get('*') url: ${req.url}`);
  res.send("Generic GET handler app.get('*')");
});
/*
*/
/*
*/
app.all('*', async (req, res) => {
  console.log(`[payments(app.ts)] app.all('*') url: ${req.url}`);
  res.send("Generic handler app.all('*')");
  //throw new NotFoundError();
});
app.use(errorHandler);

export  { app };