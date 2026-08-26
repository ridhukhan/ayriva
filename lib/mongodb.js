import mongoose from "mongoose";

export async  function dbConnect(){

    try {
      await mongoose.connect(process.env.MONGO_URI)
      console.log("db connect")  
    } catch (error) {
        console.error("db connection failed")
    }
}