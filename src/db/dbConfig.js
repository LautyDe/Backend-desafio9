import mongoose from "mongoose";
import { URI } from "../utils.js";

try {
  await mongoose.connect(URI);
  console.log("Conectado a la base de datos");
} catch (error) {
  console.log(`Error conectando a la base de datos: ${error.message}`);
}
