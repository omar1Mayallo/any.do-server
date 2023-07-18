import {cleanEnv, port, str} from "envalid";
import dotenv from "dotenv";

//_________ENV_VARIABLES_________//
dotenv.config();

//Validation on .env variables before running sever
export default cleanEnv(process.env, {
  PORT: port(),
  NODE_ENV: str(),
  DB_NAME: str(),
  DB_PASSWORD: str(),
  DB_PORT: port(),
  DB_HOST: str(),
  DB_USERNAME: str(),
  JWT_SECRET: str(),
  JWT_EXPIRE_IN: str(),
});
