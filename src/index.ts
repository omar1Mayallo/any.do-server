import {
  uncaughtException,
  unhandledRejection,
} from "./middlewares/error/errors";
//______UNCAUGHT_EXCEPTIONS______//
process.on("uncaughtException", uncaughtException);
import app from "./app";
import {connectToDB} from "./config/database";
import env from "./config/env";
import setupCronJobs from "./utils/cronJobs";

// _DATABASE_CONNECTION_ //
connectToDB();

// _AUTOMATICALLY_RUN_SCHEDULE_EVERY_SPECIFIC_PERIOD_ //
setupCronJobs();

export const server = app.listen(env.PORT, () => {
  console.log(
    `App Running on http://localhost:${env.PORT} in ${env.NODE_ENV} mode`
  );
});

//______UNHANDLED_REJECTIONS______//
process.on("unhandledRejection", unhandledRejection);
