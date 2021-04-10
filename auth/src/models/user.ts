import mongoose from "mongoose";
import { Password } from "../services/password";

//2 so we create an interface
interface UserAttrs {
  email: string;
  password: string;
}

//6
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

//8 an interface for props that a single user document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  //add extra props here such as createdat
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      //ret is the object that mongoose will return
      // we are modifying it
      transform(doc, ret) {
        ret.id = ret.__id;
        delete ret.__id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

// const User = mongoose.model("User", userSchema);

//1 no info given to ts about the structure of the class
// new User({
//   email: "tes@as/.com",
//   password: "asdsadsda",
// });

//3 to implement the check of interface everytime we build an object:
//so dont call new User
//4 but this is more stressful!
// //we want to build in a method to our schema
// const buildUser = (attrs: UserAttrs) => {
//   return new User(attrs);
// };

//5> custom fn built into the model
//this wouldve worked directly in js but not in ts
//so we need to write an interface to remind it that build fn exists in the def
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

//9 auto hashing of password
userSchema.pre("save", async function (done) {
  //done is given by mongoose so once we complete the async call, we will
  //call done and then proceed further
  //we get access to the document to be saved as this
  //thats why we did not do arrow fn

  if (this.isModified("password")) {
    //we check if the document password has ever been modified
    //can happen if we get and then save
    //this includes first time creation of the field but not future updates
    const hashedPassword = await Password.toHash(this.get("password"));
    this.set("password", hashedPassword);
  }
  done();
});

//7 building a model:
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

// User.build({
//   email: "asd",
//   password: "adssa",
// });

export { User };
