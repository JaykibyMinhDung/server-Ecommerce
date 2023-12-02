const Orders = require("../../model/order");
const Users = require("../../model/user");

exports.historyOrder = (req, res, next) => {
  const idUser = req.query.idUser;
  // Users.findById(idUser).then(user)
  Orders.find({ user: idUser })
    .then(async (order) => {
      const purchaseHistory = order.map((e) => {
        const totalPrice = e.cart.reduce((pre, after) => {
          console.log(pre, after);
          return pre + after.priceProduct * Number(after.count);
        }, 0);
        // console.log(totalPrice);
        return {
          ...e._doc,
          total: totalPrice,
        };
      });
      return await res.json({
        data: {
          historyOrder: purchaseHistory,
          //   totalBill: totalBill,
          totalOrder: purchaseHistory.length,
        },
        meta: {
          message: "Nhận dữ liệu thành công",
          statusCode: 1,
        },
      });
    })
    .catch((err) => {
      res.json({
        meta: {
          message: "Nhận dữ liệu thất bại",
          statusCode: 0,
        },
      });
    });
};

exports.detailHistory = (req, res, next) => {
  const idOrder = req.params.id;
  Orders.findById(idOrder)
    .then((detail) => {
      const purchaseDetailHistory = (e) => {
        const totalPrice = detail.cart.reduce((pre, after) => {
          return (
            pre.priceProduct * Number(pre.count) +
            after.priceProduct * Number(after.count)
          );
        });
        return {
          ...detail._doc,
          total: totalPrice,
        };
      };
      return res.json({
        data: {
          detailOrder: purchaseDetailHistory(),
          totalCart: purchaseDetailHistory().cart.length,
        },
        meta: {
          message: "Nhận chi tiết đơn hàng thành công",
          statusCode: 1,
        },
      });
    })
    .catch(() => {
      return res.json({
        meta: {
          message: "Nhận chi tiết đơn hàng thất bại",
          statusCode: 0,
        },
      });
    });
};
