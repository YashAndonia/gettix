export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    //for logging purposes, since Error class provides many other func that can be helpful long term
    super(message);

    //since we are extending built in class
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  //function definition with return types definition
  abstract serializeErrors(): { message: string; field?: string }[];
}
