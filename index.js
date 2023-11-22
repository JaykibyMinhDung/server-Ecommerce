const path = require("path");
const http = require("http");

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const multer = require("multer");

var cors = require("cors");

const app = express();
const url =
  "mongodb+srv://Userdb:SgvOBym6vNUZnBoO@atlascluster.opdyakh.mongodb.net/Assignment_3";
// const url = process.env.MONGODB_URI;

const authRoutes = require("./routes/user/auth");
const productRoutes = require("./routes/user/products");
const chatRoutes = require("./routes/chat/chat");

const adminRoutesAuth = require("./routes/admin/auth");
const adminRoutesOrder = require("./routes/admin/history");
const adminRoutesManagers = require("./routes/admin/managers");
const adminRouteChat = require("./routes/chat/chat_admin");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/public");
  },
  // destination: (req, file, cb) => {
  //   cb(null, path.join(__dirname, "/images/"));
  // },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().setTime(new Date().getTime()) + "-" + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  multer({
    storage: fileStorage,
    limits: { fileSize: 1 * 1024 * 1024 },
    fileFilter: fileFilter,
  }).any()
  // multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // set cookie for this url
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Credentials", true); // accept send anything from client
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Cookie, X-Requested-With"
  ); // , Accept, X-Requested-With, Origin
  // res.setHeader("Set-Cookie", ["type=ninja", "language=javascript"]); // set cookie from server for private url
  next();
});

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://user-ecommerce.vercel.app",
      "https://admin-ecommerce-vert.vercel.app",
    ], // Sau phải đổi lại
    credentials: true,
    sameSite: "none",
  })
);

// admin
app.use(adminRoutesAuth);
app.use(adminRoutesOrder);
app.use(adminRoutesManagers);
app.use(adminRouteChat);

app.use(authRoutes);
app.use(productRoutes);
app.use(chatRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).json({ message: error, SatusCode: 500 });
});
// SET NODE_ENV=development
const port = process.env.PORT || 5000;
const serverSocket = http.createServer(app);
mongoose
  .connect(url)
  .then((results) => {
    // const server = app.listen(process.env.PORT || 5000);
    const server = serverSocket.listen(port, () => {
      console.log(`Server running on ${port}, http://localhost:${port}`);
    });
    const io = require("./socket").init(serverSocket);
    io.on("connection", (socket) => {
      console.log("Client connected");
    });
  })
  .catch((err) => {
    console.log(err.message);
  });

module.exports = app;
