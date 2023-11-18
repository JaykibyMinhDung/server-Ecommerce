const User = require("../../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let AddCookieUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!email && !password) {
        return res.json({
          meta: { message: "Hãy điền email và mật khẩu", statusCode: 0 },
        });
      }
      if (user?.role < 1) {
        return res.json({
          meta: { message: "Tài khoản không phải admin", statusCode: 0 },
        });
      }
      if (!user) {
        return res
          .status(403)
          .json({ meta: { message: "Đăng nhập thất bại", statusCode: 0 } });
      }
      AddCookieUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((account) => {
      // console.log(account);
      if (!account) {
        const error = new Error("Mật khẩu đăng nhập không đúng");
      }
      const token = jwt.sign({ id: 7, role: "admin" }, "ASSIGNMENT3$");

      return res
        .cookie("admin_token", token, {
          maxAge: 86400 * 1000,
          httpOnly: true, // Chặn đọc cookie bên client
          secure: true,
          sameSite: 'None',
        })
        .status(200)
        .json({
          data: {
            id: AddCookieUser._id,
            fullname: AddCookieUser.fullName,
            role: AddCookieUser?.role,
            email: email,
            cookie: token,
          },
          meta: {
            message: "Đăng nhập thành công",
            statusCode: 1,
          },
        });
    })
    .catch((err) => {
      // if (!err) {
      //   return res.json({
      //     meta: {
      //       message: "Đăng nhập thất bại",
      //       statusCode: 0,
      //     },
      //   });
      // }
      console.log(err);
    });
};

exports.getAllUser = (req, res, next) => {
  User.find()
    .then((user) => {
      return res.json({
        data: {
          inforUser: user,
          amountUser: user.length,
        },
        meta: {
          message: "Nhận dữ liệu từ tất cả người dùng thành công",
          statusCode: 1,
        },
      });
    })
    .catch(() => {
      res.json({
        meta: {
          message: "Nhận dữ liệu thất bại",
          statusCode: 0,
        },
      });
    });
};

exports.logout = (req, res, next) => {
  return res
    .status(200)
    .clearCookie("admin_token")
    .json({
      meta: { message: "Tài khoản đã đăng xuất", statusCode: 1 },
    });
};
