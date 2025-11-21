import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import Router from "./views/router.js";

const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));
app.use(cookieParser());
app.use(Router);

async function startServer() {
  try {
    app.listen(port, () => console.log(`🤖 Listening on Port: ${port}`));
  } catch (err) {
    console.log("🤖 Oh no something went wrong", err);
  }
}

startServer();