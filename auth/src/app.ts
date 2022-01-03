import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
/*
 * Custom middleware and errors.
 */
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { listRouter } from './routes/list';
import { errorHandler, NotFoundError } from '@wmltickets/common';
import { textChangeRangeIsUnchanged } from 'typescript';

const app = express();
//app.set('trust proxy', true);   // Required for HTTPS since we are behind the ngix proxy.

app.use(json());
app.use(cookieSession({
                        signed: false,
                        secure: false
                      }));  
                      /* 
                       * test environment must "secure: false"
                       * Use: secure: process.env.NODE_ENV !== 'test'      
                       */
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(listRouter);
app.use(currentUserRouter); 

app.all('*', async (req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);
/*
 * Connect to MongoDb no.
 */
let connectedToDatabase = false;

export  { app };