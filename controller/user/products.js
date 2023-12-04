const Products = require("../../model/product");
const Users = require("../../model/user");
const Orders = require("../../model/order");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  //
  sendgridTransport({
    auth: {
      api_key: process.env.API_KEY_SENDGRID, // ,
    },
  })
);

exports.getProducts = (req, res, next) => {
  Products.find()
    .then((products) => {
      return res.json({
        data: { products: products, totalItem: products?.length },
        meta: { message: "Nhận sản phẩm thành công", statusCode: 1 },
      });
    })
    .catch((err) => {
      return {
        meta: {
          message: "Không tìm thấy sản phầm",
          statusCode: 0,
        },
      };
    });
};

exports.getDetailProducts = (req, res, next) => {
  const idProduct = req.params.id;
  Products.findById(idProduct)
    .then((detail) => {
      return res.json({
        data: {
          detailProduct: detail,
        },
        meta: {
          message: "Nhận dữ liệu thành công",
          statuscode: 1,
        },
      });
    })
    .catch((err) => {
      return res.json({
        meta: {
          message: "Không tìm thấy sản phẩm",
          statuscode: 0,
        },
      });
    });
};

exports.getPaginationProducts = (req, res, next) => {
  const params = req.query;
  // const searchName = params.search === "" ? "" : { name: params.search };
  const filterProduct =
    params.category === "all" ? {} : { category: params.category };
  Products.find(filterProduct)
    .skip(Number(params.page * params.count))
    .limit(params.count)
    // .sort({ name: "asc" })
    .then((list) => {
      const searchProduct = () => {
        return list.filter((e) => e.name === params.search);
      };
      return res.json({
        data: {
          categoryProducts: params.search ? searchProduct() : list,
          total: list.length,
        },
        meta: {
          message: "Nhận dữ liệu thành công",
          statuscode: 1,
        },
      });
    })
    .catch((err) => {
      return res.json({
        meta: {
          message: "Không tìm thấy sản phẩm",
          statuscode: 0,
        },
      });
    });
};

exports.addToCart = (req, res, next) => {
  const cart = req.query;
  Users.findById(cart.idUser)
    .then((user) => {
      Products.findById(cart.idProduct)
        .then((product) => {
          if (product?.amount < cart?.count) {
            return res.json({
              meta: {
                message:
                  "Số lượng hàng đã hết hoặc có ít hơn số lượng đặt, vui lòng mua sản phẩm khác",
                statuscode: 0,
              },
            });
          }
          const configKeyProducts = () => {
            return {
              img: product.image[0],
              idProduct: product._id,
              nameProduct: product.name,
              priceProduct: product.price,
              idUser: cart.idUser,
              count: cart.count,
            };
          };
          product.amount = product.amount - 1;
          user.order.push(configKeyProducts()); // Chỉnh sửa lại giá trị trong mảng
          product.save();
          return user.save();
        })
        .then(() => {
          return res.json({
            meta: {
              message: "Bạn đã đặt hàng thành công",
              statuscode: 1,
            },
          });
        });
    })
    .catch(() => {
      return res.json({
        meta: {
          message: "Đặt hàng chưa thành công",
          statuscode: 0,
        },
      });
    });
};

exports.updatedCart = (req, res, next) => {
  const cart = req.query;
  const idProductOrder = new mongoose.Types.ObjectId(cart.idProduct);
  Users.findOneAndUpdate(
    {
      _id: cart.idUser,
      "order.idProduct": idProductOrder,
    },
    { $set: { "order.$.count": cart.count } }
  )
    .then(() => {
      Products.findById(cart.idProduct)
        .then((product) => {
          if (product?.amount < cart?.count) {
            return res.json({
              meta: {
                message:
                  "Số lượng hàng đã hết hoặc có ít hơn số lượng đặt, vui lòng mua sản phẩm khác",
                statuscode: 0,
              },
            });
          }
          product.amount = product.amount - 1;
          return product.save();
        })
        .then(() => {
          return res.json({
            meta: {
              message: "Bạn đã cập nhật hàng thành công",
              statuscode: 1,
            },
          });
        });
    })
    .catch((err) => {
      console.log(err);
      return res.json({
        meta: {
          message: "Cập nhật hàng chưa thành công",
          statuscode: 0,
        },
      });
    });
};

exports.getCartUser = (req, res, next) => {
  const idUser = req.query.idUser;
  Users.findById(idUser)
    .then((user) => {
      return res.json({
        data: {
          cart: [...user?.order],
          totalCart: user?.order.length,
        },
        meta: {
          message: "Nhận giỏ hàng thành công",
          statusCode: 1,
        },
      });
    })
    .catch(() => {
      return res.json({
        meta: {
          message: "Không tìm thấy giỏ hàng",
          statusCode: 0,
        },
      });
    });
};

exports.deleteCartUser = (req, res, next) => {
  const idUser = req.query.idUser;
  const idProduct = req.query.idProduct;
  let amountUser;
  Users.findById(idUser)
    .exec()
    .then((user) => {
      const indexProduct = user.order.findIndex(
        (e) => e?.idProduct.toString() === idProduct
      );
      amountUser = user.order[indexProduct];
      user.order.splice(indexProduct, 1);
      return user.save();
    })
    .then((test) => {
      Products.findById(idProduct)
        .then((product) => {
          product.amount = product.amount + amountUser.count;
          return product.save();
        })
        .then(() => {
          return res.json({
            meta: {
              message: "Xóa sản phầm thành công",
              statusCode: 1,
            },
          });
        });
    })
    .catch((err) => {
      return res.json({
        meta: {
          message: "Xóa thất bại",
          statusCode: 0,
        },
      });
    });
};

exports.sendMailCheckout = (req, res, next) => {
  const information_user = req.query;
  Users.findById(information_user.idUser)
    .then(async (user) => {
      const order = new Orders({
        user: information_user.idUser,
        name: user.fullName,
        phoneNumber: information_user.phone,
        address: information_user.address,
        cart: user.order,
        date: new Date(),
        methodPay: "waiting for pay",
        progressingDelivery: "waiting for progressing",
      });
      await order.save();
      const totalBill = await user.order.reduce((pre, after) => {
        return pre + after.priceProduct * Number(after.count);
      }, 0);
      let message = `
      <h2>Xin chào ${information_user.fullname}</h2>
      <p>Phone: ${information_user.phone}</p>
      <p>Address: ${information_user.address}</p>
      <table style="border: 1px solid #333;">
      <tr>
      <td>Tên sản phẩm</td>
      <td>Hình ảnh</td>
      <td>Giá</td>
      <td>Số lượng</td>
      <td>Thành tiền</td>
      </tr>
      `;
      for (const product of user.order) {
        message += `
        <tr>
        <th>${product.nameProduct}</th>
        <th><img width=20 src='${product.img}' alt='Ảnh lỗi' /></th>
        <th>${product.priceProduct.toLocaleString("de-DE")} VND</th>
        <th>${product.count}</th>
        <th>${(product.priceProduct * product.count).toLocaleString(
          "de-DE"
        )} VND</th>
        </tr>
        `;
      }
      return await transporter
        .sendMail({
          to: information_user.to,
          from: "dungdmfx16748@funix.edu.vn", //
          subject: "Xác nhận đặt đơn hàng",
          html:
            message +
            ` <table/>
          <h2 wi>Tổng thanh toán: </h2> <span>${totalBill.toLocaleString(
            "de-DE"
          )} VND</span>
          <p>Cảm ơn bạn</p>`,
        })
        .then(async () => {
          user.order = [];
          await user.save();
          return await res.json({
            meta: {
              messgae:
                "Thanh toán thành công, quý khách vào mail để xác minh đơn hàng",
              statusCode: 1,
            },
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        meta: {
          message:
            "Quá trình gửi email bị lỗi, xin vui lòng gửi lại hoặc liên hệ phòng chăm sóc khách hàng",
          statusCode: 0,
        },
      });
    });
};
