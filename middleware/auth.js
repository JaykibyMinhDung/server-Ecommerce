// sẽ có một số API không cần phải đăng nhập cũng có thể lấy được dữ liệu như API trả về dữ liệu cho Homepage hay lấy thông tin cụ thể một sản phẩm.
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // console.log(req.headers);
  // const authHeader = req.get("Authorization");
  // const token = authHeader.split(" ")[1];
  // const nameToken = req.headers?.cookie.split(";")[1];
  const nameToken = req.headers?.cookie;
  const arrCookies = nameToken
    .split(";")
    .find((e) => e.split("=")[0].trim() === "client_token");
  const [name, value] = nameToken.split("=");
  const valueCookie =
    nameToken.split(";").length > 1 ? arrCookies.split("=")[1] : value;
  // || !authHeader
  if (!valueCookie) {
    return res.status(403).json({ message: "bạn chưa đăng nhập tài khoản" });
  }
  try {
    const data = jwt.verify(valueCookie, "ASSIGNMENT3");
    // const vetifyToken = jwt.verify(token, "ASSIGNMENT3$");
    // || !vetifyToken
    if (!data) {
      throw Error;
    }
    req.userId = data.id;

    next();
  } catch (err) {
    console.log(err);
    return res
      .status(403)
      .json({ message: "Mật khẩu đăng nhập chưa đúng, vui lòng thử lại" });
  }
};
