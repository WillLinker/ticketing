import express, {Request, Response}  from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validateRequest, BadRequestError } from '@wmltickets/common';

import { User } from '../models/user';
import { Password } from '../services/password';

const router = express.Router();

router.post('/api/users/signin', [
            body('email').isEmail().withMessage("e-mail must be valid!"),
            body('password').trim().notEmpty().withMessage("Password must be provided")
         ], 
         validateRequest,
         async (req: Request, res: Response) => {
            console.log("[signin]--------------------------------------");
            const { email, password } = req.body;
             const existingUser = await User.findOne({ email });
             if (!existingUser) {
               throw new BadRequestError("login failed for " + email);
             }

             const loggedIn = Password.compare(existingUser.password, password);
             if (await loggedIn) {
                // Do nothing, it is all good here!
             }
             else {
                throw new BadRequestError("Login Failure!");
             }

             console.log(`------ sign("%s", "%s") = %s ----------------`, email, password, (await loggedIn ? "Logged In" : "Failure"));
  // Generate JWT and store on session object.
  const userJwt = jwt.sign({
                              id: existingUser.id,
                              email: existingUser.email
                           }, 
                           process.env.JWT_KEY!);  // "!" is to tell TypeScript I know the variable exist!
                           req.session = { jwt: userJwt};
                           res.status(200).send(existingUser); 
                           });

export {router as signinRouter };
