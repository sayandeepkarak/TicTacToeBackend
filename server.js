import http from "http";
import express from "express";
import { DBURL, FRONTEND_URL, PORT } from "./config";
import createSocketServer from "./events";
import connectToDb from "./database";
// import cors from "cors";
import router from "./routes";
import ErrorHandle from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();
const port = PORT || 6000;

// app.use(cookieParser());
// app.use(
//   cors({
//     origin: ["*"],
//     credentials: true,
//   })
// );
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api/", router);
app.use(ErrorHandle);

app.use(express.static(path.join("./public")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

connectToDb(DBURL);

const server = http.createServer(app);
createSocketServer(server);

server.listen(port, () => {
  console.log("Server started at port - " + port);
});
