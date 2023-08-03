import "reflect-metadata";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import compression from "compression";
import env from "./config/env";
import {routeNotFoundError} from "./middlewares/error/errors";
import globalErrorMiddleware from "./middlewares/error";
import authRouter from "./modules/auth/auth.router";
import userRouter from "./modules/user/user.router";
import taskRouter from "./modules/task/task.router";
import tagRouter from "./modules/tag/tag.router";

const app = express();

//_________ MIDDLEWARES _________//
app.use(cors());
app.options("*", cors());

app.use(compression());

app.use(express.json());

if (env.NODE_ENV === "development") app.use(morgan("dev"));

//_________ ROUTES _________//
// APP_ROUTES
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/tags", tagRouter);

// 404_ROUTES
app.all("*", routeNotFoundError);

//_________ GLOBAL_ERROR_MIDDLEWARE _________//
app.use(globalErrorMiddleware);

export default app;
