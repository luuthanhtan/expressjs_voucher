import mongoose from "mongoose";
import { AGENDA_JOBS } from "utils/const";
import logger from 'jet-logger';

export const checkMongoJob = async (agenda: any) => {
  agenda.define(AGENDA_JOBS.CHECK_MONGO_CONNECTION, async () => {
    const isConnected = mongoose.connection.readyState === 1;
    if (isConnected) {
      logger.info("✅ MongoDB is connected");
    } else {
      logger.err("❌ MongoDB is disconnected!");
    }
  });
  await agenda.start();
  await agenda.every(AGENDA_JOBS.TIME_CHECK_MONGO_CONNECTION, AGENDA_JOBS.CHECK_MONGO_CONNECTION);
};

