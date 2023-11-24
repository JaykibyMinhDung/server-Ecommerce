const Order = require("../../model/order");

exports.getAllHistory = (req, res, next) => {
  Order.find()
    .then((history) => {
      const transactionHistory = history.map((order) => {
        console.log(order._doc.cart.length);
        const totalPrice = order._doc.cart.reduce((pre, after) => {
          return (
            pre.priceProduct * Number(pre.count) +
            after.priceProduct * Number(after.count)
          );
        });
        return {
          ...order._doc,
          total: totalPrice,
        };
      });
      return res.json({
        data: {
          transaction: transactionHistory,
          totalLength: transactionHistory.length,
        },
        meta: {
          message: "Nhận dữ liệu lịch sử giao dịch thành công",
          statusCode: 1,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      return res.json({
        meta: {
          message: "Nhận dữ liệu không thành công",
          statusCode: 0,
        },
      });
    });
};

exports.getMonthHistory = (req, res, next) => {
  const date = new Date();
  function getFirstDayofMonth(year, month) {
    return new Date(year, month, 2);
  }
  const firstDay = getFirstDayofMonth(date.getFullYear(), date.getMonth());
  function getLastDayofMonth(year, month) {
    return new Date(year, month, 31);
  }
  const lastDay = getLastDayofMonth(date.getFullYear(), date.getMonth());
  Order.find({
    $and: [{ dateStart: { $gt: firstDay } }, { dateEnd: { $lt: lastDay } }],
  })
    .then((history) => {
      const transactionHistory = history.map((order) => {
        const totalPrice = order._doc.cart.reduce((pre, after) => {
          return (
            pre.priceProduct * Number(pre.count) +
            after.priceProduct * Number(after.count)
          );
        });
        return {
          ...order._doc,
          total: totalPrice,
        };
      });
      return res.json({
        data: {
          transaction: transactionHistory,
          totalLength: transactionHistory.length,
        },
        meta: {
          message: "Nhận dữ liệu lịch sử giao dịch thành công",
          statusCode: 1,
        },
      });
    })
    .catch((err) => {
      return res.json({
        meta: {
          message: "Nhận dữ liệu không thành công",
          statusCode: 0,
        },
      });
    });
};
