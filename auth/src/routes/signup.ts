import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';
import { validateRequest, BadRequestError } from '@wmltickets/common';

const router = express.Router();

router.post('/api/users/signup', [
                              body('email').isEmail().withMessage("e-mail must be valid!"),
                              body('password').trim().isLength({ min: 4, max: 20 }).withMessage("Password must be between 4 and 20 characters")
                            ],
                            validateRequest,
                  async (req: Request, res: Response) => {
                    console.log("[signup]--------------------------------------")
                    const { email, password } = req.body;

                    // if (password === 'password')
                    // {
                    //   throw new BadRequestError("you cannot use \"password\"");
                    // }
                    console.log(`[signup] Creating User with email: ${email}, password: ${password}`);

                    const existingUser = await User.findOne({ email });
                    if (existingUser) {
                      console.log("eMail is already used: " + email);
                      throw new BadRequestError("eMail is already used: " + email);
                    }
                    /*
                     * Create the user now.
                     */
                    const user = User.build({email, password});
                    await user.save();

                    // Generate JWT and store on session object.
                    const userJwt = jwt.sign({
                                                id: user.id,
                                                email: user.email
                                              }, process.env.JWT_KEY!);  // "!" is to tell TypeScript I know the variable exist!
                    req.session = { jwt: userJwt};

                    res.status(201).send(user); //`[signup] email: ${email}`);
                  });

export {router as signupRouter };