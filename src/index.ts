import {
  uncaughtException,
  unhandledRejection,
} from "./middlewares/error/errors";
//______UNCAUGHT_EXCEPTIONS______//
process.on("uncaughtException", uncaughtException);
import app from "./app";
import env from "./config/env";

export const server = app.listen(env.PORT, () => {
  console.log(`App Running on PORT:${env.PORT} in ${env.NODE_ENV} mode`);
});

//______UNHANDLED_REJECTIONS______//
process.on("unhandledRejection", unhandledRejection);
