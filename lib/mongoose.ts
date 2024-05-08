import mongoose from "mongoose";

let isConnected = false;

/**
 * Connecte à la base de données MongoDB.
 * @returns Une promesse résolue lorsque la connexion est établie.
 */
export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) return console.log("MONGODB_URL pas trouver");
  if (isConnected) return console.log("deja connecte a MongoDB");

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
    console.log("Connecter a MongoDb");
  } catch (error) {
    console.log(error);
  }
};
