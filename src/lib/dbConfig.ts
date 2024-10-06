import mongoose from "mongoose";

type connectionObject = {
  isConnected?: number;
};
const connection: connectionObject = {};

export async function dbConnect() {
  if (connection.isConnected) {
    console.log("already Connected");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.DB_URL || "");

    // IF SERVER IS NOT CONNECTED TO DATABASE THEN MAKE A CONNECTION TO THE DATABASE
    connection.isConnected = db.connections[0].readyState;
    console.log("DB Connected Sucessfully");
  } catch (e: any) {
    console.log(` DB Connection Failed ${e.message}`);
    process.exit(1);
  }
}
