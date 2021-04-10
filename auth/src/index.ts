import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import mongoose from "mongoose";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();

//trust any proxy, since traffic is being proxied to our app through nginx
//so maintained as https
app.set("trust proxy", true);

app.use(json());

//to support sending of user jwt over cookoies:
app.use(
  cookieSession({
    signed: false, //disable encryption since jwt already enc
    secure: true, //needs to be an https connection
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

//in case none of the above routes worked for us, we will redirect to this one
app.get("*", async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

const start = async () => {
  //checking for existence of the env var:
  if (!process.env.JWT_KEY) {
    throw new Error(" JWT_KEY must be defined");
  }

  //write auth-mongo-srv instead of localhost since that is the url we will
  //refer to in the cluster IP system
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connected to mongoDb");
  } catch (error) {
    console.log(error);
  }
};
start();

app.listen(3000, () => {
  console.log("Listening on port 3000!!!!!!!!");
});
