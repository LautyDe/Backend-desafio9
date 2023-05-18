import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number },
  password: { type: String },
});

export const usersModel = mongoose.model("Users", usersSchema);
