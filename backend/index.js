import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/router.js";
import pool from "./config/config.js";

const app = express();

try {
  pool.connect((err, client, release) => {
    if (err) throw err;
    console.log("connected");
    release();
  });
} catch (error) {
  console.error(error)
}

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

app.use(router);

app.listen(8000, () => {
  console.log("server is running at port 8000");
});
