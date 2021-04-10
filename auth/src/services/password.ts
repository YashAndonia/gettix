import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

//sunce scrypt is a callback fn
const scryptAsync = promisify(scrypt);

export class Password {
  //because we want a method we can access without making an instance of the class
  static async toHash(password: string) {
    const salt = randomBytes(8).toString("hex");
    //as b8uffer because we want it to be treated as such by ts
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
  }
  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split(".");

    //new hashed password
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buf.toString("hex") === hashedPassword;
  }
}
