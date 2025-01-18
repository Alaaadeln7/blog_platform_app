import mongoose from "mongoose";

const connection_DB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("connection database");
  } catch (error) {
    console.error(error);
  }
};
export default connection_DB;
