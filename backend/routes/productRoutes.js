import express from "express";
import formidable from "express-formidable";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkValidObjectId from "../middlewares/checkId.js";

//controllers
import {
  createProduct,
  updateProduct,
  deleteProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopRatedProducts,
  fetchNewProducts,
} from "../controllers/productController.js";

const router = express.Router();

router
  .route("/")
  .get(fetchProducts)
  .post(authenticate, authorizeAdmin, formidable(), createProduct);

router.route("/allproducts").get(fetchAllProducts);
router
  .route("/:id/reviews")
  .post(authenticate, authorizeAdmin, checkValidObjectId, addProductReview);

router.route("/topRatedProducts").get(fetchTopRatedProducts);
router.route("/newProducts").get(fetchNewProducts);

router
  .route("/:id")
  .get(fetchProductById)
  .put(authenticate, authorizeAdmin, formidable(), updateProduct)
  .delete(authenticate, authorizeAdmin, deleteProduct);

export default router;
