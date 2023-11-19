let io;

module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer, {
      cors: {
        origin: "*",
      },
    });
    console.log("socket.js", httpServer);
    io.on("connection", (socket) => {
      console.log("Đã kết nối với socket");
      socket.on("send_message", (param) => {
        console.log("socket", param);
      });
      // socket.on("disconnect", () => {
      //   console.log("Người dùng đã ngắt kết nối");
      // });
    });
    // listening for connections from clients
    // io.on("connection", (socket) => {
    //   // listening to events from client
    //   socket.on("send_order", (params, callback) => {
    //     // send data back to client by using ack callback
    //     callback("hello"); // data
    //     console.log(params);
    //     console.log(socket.id);
    //     // send data back to client by using emit
    //     socket.emit("send_order", "hello"); // data

    //     // broadcasting data to all other connected clients
    //     socket.broadcast.emit("send_order", "hello"); // data
    //   });
    // });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
};
