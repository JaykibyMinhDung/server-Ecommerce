const Products = require("../../model/product");

exports.deletedProducts = (req, res, next) => {
  const id = req.params.id;

  Products.findOneAndDelete({ _id: id })
    .then((product) => {
      return res.json({
        meta: {
          message: "Xóa sản phẩm thành công",
          statusCode: 1,
        },
      });
    })
    .catch(() => {
      return res.json({
        meta: {
          message: "Xóa sản phẩm thất bại",
          statusCode: 0,
        },
      });
    });
};

exports.updatedProducts = (req, res, next) => {
  const id = req.params.id;
  const updatedData = req.body;
  Products.findByIdAndUpdate(id, updatedData)
    .then(() => {
      return res.json({
        meta: {
          message: "cập nhât sản phẩm thành công",
          statusCode: 1,
        },
      });
    })
    .catch(() => {
      return res.json({
        meta: {
          message: "Cập nhật sản phẩm thất bại",
          statusCode: 0,
        },
      });
    });
};

exports.updatedAllProducts = (req, res, next) => {
  const updatedData = req.body;
  Products.updateMany({}, updatedData)
    .then(() => {
      return res.json({
        meta: {
          message: "cập nhât sản phẩm thành công",
          statusCode: 1,
        },
      });
    })
    .catch((err) => {
      return res.json({
        meta: {
          message: "Cập nhật sản phẩm thất bại",
          statusCode: 0,
        },
      });
    });
};

exports.addNewProducts = (req, res, next) => {
  const { name, category, short_desc, long_desc } = req.body;
  const imageArr = [];
  // console.log(req.files);
  for (const key of req.files) {
    imageArr.push(key.path.replace(/\\/g, "/"));
  }
  const newProduct = new Products({
    name: name,
    category: category,
    long_desc: long_desc,
    short_desc: short_desc,
    image: imageArr,
    price: 0,
    amount: 10,
  });
  newProduct
    .save()
    .then((product) => {
      return res.json({
        meta: {
          message: "tạo mới sản phẩm thành công",
          statusCode: 1,
        },
      });
    })
    .catch(() => {
      return res.json({
        meta: {
          message: "tạo mới sản phẩm thất bại",
          statusCode: 0,
        },
      });
    });
};
