import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { DatabaseConnectionError } from "../errors/database-connection-error";
import { RequestValidationError } from "../errors/request-validation-error";

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
  (req: Request, res: Response) => {
    //an validation errors come here;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //   throw new Error("Invalid email or password");
      throw new RequestValidationError(errors.array());
    }
    const { email, password } = req.body;
    console.log("Creating a user");

    //random error
    throw new DatabaseConnectionError();
    // res.send("Hi there!");
  }
);

export { router as signupRouter };
