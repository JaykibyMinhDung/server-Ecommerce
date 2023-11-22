const Session = require("../../model/session");
const io = require("../../socket");

exports.getRoomChat = (req, res, next) => {
  const idRoom = req.query.roomId;
  Session.findById(idRoom)
    .then((session) => {
      // io.getIO().emit("receive_message", {
      //   content: session.message,
      // });
      return res.json({
        data: {
          content: [{ ...session._doc }],
        },
        meta: {
          message: "Phòng đang hoạt động",
          statusCode: 1,
        },
      });
    })
    .catch(() => {
      return res.json({
        meta: {
          message: "Phòng bị lỗi hoặc chưa hoạt động",
          statusCode: 0,
        },
      });
    });
};

exports.createRoomChat = (req, res, next) => {
  const idUser = req.query.idUser;
  const newRoom = new Session({
    client: idUser,
    date: new Date(),
  });
  newRoom
    .save()
    .then(() => {
      return res.json({
        data: {
          id: newRoom._id,
        },
        meta: {
          message: "Phòng đã được tạo thành công",
          statusCode: 1,
        },
      });
    })
    .catch(() => {
      return res.json({
        meta: {
          message: "Vui lòng tạo lại phòng",
          statusCode: 0,
        },
      });
    });
};

exports.addNewMessage = (req, res, next) => {
  const params = req.body;
  let newMessage;
  Session.findById(params.roomId)
    .then((session) => {
      if (params.message === "==END ROOM==") {
        newMessage = session;
        session.message.push({
          text: "Kết thúc cuộc trò chuyện, bắt đầu sang cuộc trò chuyện mới",
          is_admin: 1,
        });
        return {
          ...session._doc,
          admin: params.idUser,
          endDate: new Date(),
        };
      }
      if (params.is_admin) {
        newMessage = session;
        session.message.push({ text: params.message, is_admin: 1 });
        return {
          ...session._doc,
          admin: params.idUser,
          endDate: new Date(),
        };
      } else {
        newMessage = session;
        session.message.push({ text: params.message, is_admin: 0 });
        return {
          ...session._doc,
          endDate: new Date(),
        };
      }
    })
    .then((newChat) => {
      io.getIO().on("connection", (socket) => {
        socket.on("send_message", async (param, callback) => {
          console.log(param); // tin nhắn
          try {
            callback({
              status: "OK",
              param,
            });
          } catch (e) {
            callback({
              status: "NOT OK",
            });
          }
        });
      });
      io.getIO().emit("receive_message", {
        content: newChat.message,
      });
      // io.getIO().emit("send_message", {
      //   content: newChat.message,
      // });
      // io.getIO().on("send_message", (message) => {
      // });
      newMessage.save();
      return res.json({
        data: newChat,
        statusCode: 1,
      });
    })
    .catch((err) => {
      console.log("Lỗi liên quan đến tìm sai id phòng");
      res.json({
        meta: "Tạm thời tin nhắn đang bị lỗi, xin vui lòng gửi lại sau",
        statusCode: 0,
      });
    });
};

exports.getAllRoomChat = (req, res, next) => {
  Session.find()
    .then((sessions) => {
      return res.json({
        data: sessions,
        meta: {
          message: "Nhận dữ liệu thành công",
          statusCode: 1,
        },
      });
    })
    .catch(() => {
      return res.json({
        meta: {
          message: "Nhận dữ liệu thất bại",
          statusCode: 0,
        },
      });
    });
};
