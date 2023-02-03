require("dotenv").config();
const express = require("express");
const app = express();
const PORT: number = 3000;
const Socket = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = Socket(server);

import { addElement, getAllTasks } from "./hepler/dbHelper";

io.on("connection", (socket: any) => {
  console.log("-------socket connected----------");

  socket.on("add", (data: any) => {
    console.log(data);
    addElement(data.task);
  });
});

app.get("/fetchAllTasks", async (req: any, res: any) => {
  const data = await getAllTasks();
  // console.log("getAllTasks", data);

  res.send({ data });
});
server.listen(PORT, () => {
  console.log("Server running on port :", PORT);
});
