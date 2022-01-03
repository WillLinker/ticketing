
import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  console.log('Starting up now!!!!');
  if (!process.env.JWT_KEY) {
    throw new Error("Missing JWT Key variable!") 
  }
  if (!process.env.MONGO_URI) {
    throw new Error("Missing MONGO_URI variable!") 
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB: " + process.env.MONGO_URI);
  }
  catch(err) {
    console.error(err);
  }
  app.listen(3000, () => {
    console.log("Listening on port 3000!!");
  } );
};

start();