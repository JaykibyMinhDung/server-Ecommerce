const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
const bcrypt = require("bcryptjs");

const User = require("../../model/user");

exports.signup = (req, res, next) => {
  const email = req.query.email;
  const password = req.query.password;
  const fullName = req.query.fullname;
  const phone = req.query.phone;
  User.findOne({ email: email }).then((account) => {
    if (account) {
      return res.json({ message: "Email đã tồn tại" });
    }
    bcrypt
      .hash(password, 12)
      .then((hasBcryptPW) => {
        const user = new User({
          email: email,
          password: hasBcryptPW,
          role: 0,
          fullName: fullName,
          phone: phone,
        });
        return user.save();
      })
      .then((sucessful) => {
        return res.status(200).json({ message: "Bạn đã đăng kí thành công" });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let AddCookieUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!email && !password) {
        return res.json({ message: "Hãy điền email và mật khẩu" });
      }
      if (!user) {
        return res.status(401).json({ message: "Đăng nhập thất bại" });
      }
      AddCookieUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((account) => {
      if (!account) {
        const error = new Error("Mật khẩu đăng nhập không đúng");
        throw error;
      }
      const token = jwt.sign({ id: 7, role: "client" }, "ASSIGNMENT3");

      return (
        res
          .cookie("client_token", token, {
            maxAge: 86400 * 1000,
            httpOnly: true, // Chặn đọc cookie bên client
            secure: process.env.NODE_ENV === "Assignment",
          })
          .status(200)
          // .json([
          //   { message: "Đăng nhập thành công", email: email, cookie: token },
          // ]);
          .json({
            meta: [
              {
                message: "Đăng nhập thành công",
                id: AddCookieUser._id,
                fullname: AddCookieUser.fullName,
                role: AddCookieUser?.role,
                email: email,
                cookie: token,
              },
            ],
          })
      );
    })
    .catch(() => {
      // res.json({
      //   meta: {
      //     message: "Đăng nhập thất bại",
      //     statusCode: 0,
      //   },
      // });
      console.log(err);
    });
};

exports.getUser = (req, res, next) => {
  const id = req.params.id;
  User.findById(id)
    .then((user) => {
      return res.json({
        data: {
          user: user,
        },
        meta: {
          messgae: "Nhận dữ liệu người dùng thành công",
          statusCode: 1,
        },
      });
    })
    .catch(() => {
      res.json({
        meta: {
          messgae: "Không có dữ liệu người dùng",
          statusCode: 0,
        },
      });
    });
};

exports.logout = (req, res, next) => {
  return res
    .status(200)
    .clearCookie("client_token")
    .json({
      meta: { message: "Tài khoản đã đăng xuất", statusCode: 1 },
    });
};
