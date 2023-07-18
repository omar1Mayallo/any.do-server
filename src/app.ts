import "reflect-metadata";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import compression from "compression";
import env from "./config/env";
import {routeNotFoundError} from "./middlewares/error/errors";
import globalErrorMiddleware from "./middlewares/error";
import tagRouter from "./routes/tag.router";

const app = express();

//_________ MIDDLEWARES _________//
app.use(cors());
app.options("*", cors());

app.use(compression());

app.use(express.json());

if (env.NODE_ENV === "development") app.use(morgan("dev"));

//_________ ROUTES _________//
// APP_ROUTES
app.use("/tags", tagRouter);
// 404_ROUTES
app.all("*", routeNotFoundError);

//_________ GLOBAL_ERROR_MIDDLEWARE _________//
app.use(globalErrorMiddleware);

export default app;
