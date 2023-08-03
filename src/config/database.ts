import {Sequelize} from "sequelize-typescript";
import env from "./env";
import User from "../modules/user/user.model";
import Task from "../modules/task/task.model";
import SubTask from "../modules/subtask/subtask.model";
import Tag from "../modules/tag/tag.model";
import List from "../modules/list/list.model";

const sequelize = new Sequelize({
  dialect: "postgres",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  models: [User, Task, SubTask, Tag, List],
  logging: false,
});

export const connectToDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Connection has been established successfully");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export default sequelize;
