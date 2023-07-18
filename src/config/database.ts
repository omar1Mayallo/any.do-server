import {Sequelize} from "sequelize-typescript";
import {Tag} from "../models/tag.model";
import env from "./env";

const sequelize = new Sequelize({
  dialect: "postgres",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  models: [Tag],
});

export const connectToDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export default sequelize;
