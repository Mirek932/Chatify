import express from 'express';
const app = express();
import { createServer } from 'http';
const server = createServer(app);
import { Server, RemoteSocket } from "socket.io";
const io = new Server(server);
import path from "path";

io.on('connection',)
socket.on("upload", (file, callback) => {
    console.log(file); // <Buffer 25 50 44 ...>

    // save the content to the disk, for example
    writeFile("/tmp/upload", file, (err) => {
      callback({ message: err ? "failure" : "success" });
    });
  });