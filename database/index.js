import mongoose from "mongoose";

const connectToDb = async (url) => {
  mongoose.set("strictQuery", false);
  try {
    await mongoose.connect(url);
    console.log("Database connected");
  } catch (error) {
    console.log("Database Connection failed");
  }
};

export default connectToDb;
