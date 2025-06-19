import { Agenda } from "agenda";
import { appConfig } from "config/app";
import dotenv from "dotenv";
import { checkMongoJob } from "jobs/agenda/healthCheckConnectDatabase.job";

dotenv.config();

const mongoUri = appConfig.mongoUri;

export const agenda = new Agenda({
  db: { address: mongoUri, collection: "agendaJobs" },
});
/**
 * @param time
 *   '1 second'  
 *   '30 seconds'
 *   '1 minute'
 *   '5 minutes'
 *   '1 hour'
 *   '2 days'
 *   '1 week'
 */
// CRON:
// '*/5 * * * *'       => every 5m
// '0 0 * * *'         => every at 0h
// '0 8 * * 1'         => every Mon 8h
// '0 18 * * *'        => every day 18h

export const startAgenda = async (time: string = "1 minute") => {
  checkMongoJob(agenda);
  await agenda.start();
  await agenda.every(time, "check mongo connection");

  console.log("📅 Agenda started and job scheduled");
};
