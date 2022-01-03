import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@wmltickets/common';

import { createOrderRouter } from './routes/new';
import { showOrderRouter }   from './routes/show';
import { indexOrderRouter }  from './routes/index';
import { deleteOrderRouter } from './routes/delete';
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

app.use(createOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export  { app };