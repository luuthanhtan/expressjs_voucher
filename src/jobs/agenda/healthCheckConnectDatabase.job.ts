import mongoose from "mongoose";

export const checkMongoJob = (agenda: any) => {
  agenda.define("check mongo connection", async () => {
    const isConnected = mongoose.connection.readyState === 1;
    if (isConnected) {
      console.log("✅ MongoDB is connected");
    } else {
      console.error("❌ MongoDB is disconnected!");
    }
  });
};
