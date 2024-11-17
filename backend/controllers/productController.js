import Product from "../models/productModel.js";

const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, quantity, brand } = req.fields;
    console.log(name, description, price, category, quantity, brand);

    // Validation
    switch (true) {
      case !name:
        return res.json({ error: "Name is required" });
      case !brand:
        return res.json({ error: "Brand is required" });
      case !description:
        return res.json({ error: "Description is required" });
      case !price:
        return res.json({ error: "Price is required" });
      case !category:
        return res.json({ error: "Category is required" });
      case !quantity:
        return res.json({ error: "Quantity is required" });
    }

    const product = await Product.create({ ...req.fields });
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};
const updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, quantity, brand } = req.fields;
    console.log(name, description, price, category, quantity, brand);

    // Validation
    switch (true) {
      case !name:
        return res.json({ error: "Name is required" });
      case !brand:
        return res.json({ error: "Brand is required" });
      case !description:
        return res.json({ error: "Description is required" });
      case !price:
        return res.json({ error: "Price is required" });
      case !category:
        return res.json({ error: "Category is required" });
      case !quantity:
        return res.json({ error: "Quantity is required" });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.fields },
      { new: true }
    );
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    res.json(deletedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};
const fetchProducts = async (req, res) => {
  try {
    const pageSize = 6;
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: "i" } }
      : {};

    const totalProductsCount = await Product.countDocuments();
    const products = await Product.find({ ...keyword }).limit(pageSize);

    res.json({
      products,
      page: 1,
      pages: Math.ceil(totalProductsCount / pageSize),
      hasMore: false,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

const fetchProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      return res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Product not found" });
  }
};
const fetchAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Server Error" });
  }
};

const addProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.userId.toString() === req.user._id.toString()
      );
      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Already reviewed");
      }
      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment: comment,
        userId: req.user._id,
      };

      product.reviews.push(review);

      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};

const fetchTopRatedProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};

const fetchNewProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(5);
    res.json(products);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};
export {
  createProduct,
  updateProduct,
  deleteProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopRatedProducts,
  fetchNewProducts,
};
