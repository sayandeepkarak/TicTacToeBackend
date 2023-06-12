import http from "http";
import express from "express";
import { DBURL, PORT } from "./config";
import createSocketServer from "./events";
import connectToDb from "./database";
import cors from "cors";
import router from "./routes";
import ErrorHandle from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";

const app = express();
const port = PORT || 6000;

app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/", router);
app.use(ErrorHandle);

connectToDb(DBURL);

const server = http.createServer(app);
createSocketServer(server);

server.listen(port, () => {
  console.log("Server started at port - " + port);
});
