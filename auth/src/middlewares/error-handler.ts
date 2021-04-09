import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-errors";
import { DatabaseConnectionError } from "../errors/database-connection-error";
import { RequestValidationError } from "../errors/request-validation-error";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //we have decided that the error object we will send will look like this:
  /*
{
    errors:{
        message:string,field?:string
    }[]
}
*/

  //no need to do this since we have a custom Error abstract class to check it
  //   if (err instanceof RequestValidationError) {
  //     //formatting into a standard error message for all error types
  //     //NO NEED TO DO NOW since it is done within the subclass we made itself
  //     // const formattedErrors = err.errors.map((error) => {
  //     //   return { message: error.msg, field: error.param };
  //     // });

  //     res.status(err.statusCode).send({ errors: err.serializeErrors() });
  //   }
  //   if (err instanceof DatabaseConnectionError) {
  //     res
  //       .status(err.statusCode)
  //       .send({ errors: [{ message: err.serializeErrors() }] });
  //   }

  //works even if the err class is extending another class
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  res.status(400).send({ errors: [{ message: "Something went wrong" }] });
};
