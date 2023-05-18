import { dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";

export const __dirname = dirname(fileURLToPath(import.meta.url));

export const URI =
  "mongodb+srv://lautydp:lautydp@cluster0.mbl12o1.mongodb.net/ecommerce?retryWrites=true&w=majority";

export const hashData = data => {
  return bcrypt.hash(data, 10);
};

export const compareData = async (data, dataDB) => {
  return bcrypt.compare(data, dataDB);
};
