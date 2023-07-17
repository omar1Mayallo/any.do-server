import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.listen(process.env.PORT, () => {
  console.log(
    `App Running on PORT:${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});
