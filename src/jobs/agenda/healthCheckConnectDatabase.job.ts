import mongoose from "mongoose";
import { AGENDA_JOBS } from "utils/const";

export const checkMongoJob = (agenda: any) => {
  agenda.define(AGENDA_JOBS.CHECK_MONGO_CONNECTION, async () => {
    const isConnected = mongoose.connection.readyState === 1;
    if (isConnected) {
      console.log("✅ MongoDB is connected");
    } else {
      console.error("❌ MongoDB is disconnected!");
    }
  });
};
