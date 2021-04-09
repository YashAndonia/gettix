import { CustomError } from "./custom-errors";

export class DatabaseConnectionError extends CustomError {
  //this is a property in this class
  reason = "Error connecting to db";
  statusCode = 500;

  constructor() {
    //same as public this.errors=errors
    super(" Database Connection Error");

    //since we are extending built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
