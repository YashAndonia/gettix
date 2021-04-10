import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { BadRequestError } from "../errors/bad-request-error";
import { DatabaseConnectionError } from "../errors/database-connection-error";
import { RequestValidationError } from "../errors/request-validation-error";
import { User } from "../models/user";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    //this is express-validator
    body("email").isEmail().withMessage("EMail must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password ,must be between 4 and 20 chars"),
  ],
  async (req: Request, res: Response) => {
    //an validation errors come here;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // console.log("Email in use");?
      throw new BadRequestError("Email in use");

      // return res.send({});
    }

    //create user
    const user = User.build({ email, password });
    await user.save();

    //generate the JWT using the env var stored in kube secrets obj
    //actually should do this way before we even reach this place
    // if (!process.env.JWT_KEY) {
    //   throw new Error("JWT Key not found");
    // }

    //make the jwt here:
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY! //this ! means dont worry ts
    );
    //store jwt on session obj
    req.session = {
      //we write it like this as per def of ts
      jwt: userJwt,
    };

    //random error
    // throw new DatabaseConnectionError();
    res.status(201).send(user);
  }
);

export { router as signupRouter };
