import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  getUserById,
  deleteUserById,
  updateUserById,
} from "../controllers/userController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
const router = express.Router();

//User Routes
router
  .route("/")
  .post(createUser)
  .get(authenticate, authorizeAdmin, getAllUsers);

router.post("/auth", loginUser);
router.post("/logout", logoutUser);

router
  .route("/profile")
  .get(authenticate, getUserProfile)
  .put(authenticate, updateUserProfile);

//Admin routes
router
  .route("/:id")
  .get(authenticate, authorizeAdmin, getUserById)
  .put(authenticate, authorizeAdmin, updateUserById)
  .delete(authenticate, authorizeAdmin, deleteUserById);

export default router;
