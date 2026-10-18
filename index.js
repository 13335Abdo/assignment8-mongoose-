import express from "express";
import { bootstrap } from "./src/bootstrap.js";
const app = express();

bootstrap(express, app);

app.listen(process.env.server_port, () => {
  console.log(`Server is running on port ${process.env.server_port}`);
});