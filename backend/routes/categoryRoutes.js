import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  listCategories,
  readCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.route("/").post(authenticate, authorizeAdmin, createCategory);
router
  .route("/:categoryId")
  .get(readCategory)
  .put(authenticate, authorizeAdmin, updateCategory)
  .delete(authenticate, authorizeAdmin, deleteCategory);

router.route("/categories").get(listCategories);

export default router;
