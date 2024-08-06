import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL).then(() => {
      console.log(`db connected successfully`);
    });
  } catch (error) {
    console.log("error in db.js", error);
  }
};

export default connectDB;
