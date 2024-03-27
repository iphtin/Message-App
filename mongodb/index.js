import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
    mongoose.set("strictQuery", true);

    if(isConnected) {
      console.log("mongodb is connected already");
      return
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL, {
          dbName: "messengerApp",
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });

        isConnected = true;

        console.log("MongoDB is Connected");
    }catch (error) {
      console.log(error)
    }

}