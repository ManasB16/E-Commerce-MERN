import Users from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/createToken.js";

const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username && !email && !password)
      throw new Error("Please fill all the required fields");

    const user = await Users.findOne({ email });
    if (user) return res.status(400).json({ msg: "Email already registered" });

    // if (password.length < 6)
    //   return res
    //     .status(400)
    //     .json({ msg: "Password should be at least 6 characters" });

    //Passwrod encryption algorithm
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Users.create({
      username,
      email,
      password: hashedPassword,
    });

    // //Creating jwt for authentication and setting cookie
    const accessToken = generateTokenAndSetCookie(res, newUser._id);

    res.status(201).json({
      msg: "Registration Successfull",
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      password: newUser.password,
      accessToken,
      //   refreshToken,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const allUsers = await Users.find();
    res.json(allUsers);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      throw new Error("Please fill all the required fields");

    const existingUser = await Users.findOne({ email });

    if (!existingUser) return res.status(400).json({ msg: "User not found" });

    if (existingUser) {
      const passwordMatch = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!passwordMatch)
        return res.status(400).json({ msg: "Incorrect Password" });

      const accessToken = generateTokenAndSetCookie(res, existingUser._id);

      return res.status(201).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
        accessToken,
        msg: "Logged in",
      });
    }

    // const refreshToken = createRefreshToken({ id: user._id });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("jwt");
    // console.log(req.cookies.jwt);
    res.json({ msg: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await Users.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      throw new Error(`User not found`);
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
const updateUserProfile = async (req, res) => {
  try {
    const user = await Users.findById(req.user._id);

    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
      }
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      throw new Error(`User not updated`);
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

//admin controls
const getUserById = async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);

    if (user) res.json(user);
    else {
      throw new Error(`User not found`);
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
const updateUserById = async (req, res) => {
  try {
    const { username, email, isAdmin } = req.body;

    if (!username || !email)
      return res.json({ error: "Enter the required fields to update" });

    const user = await Users.findById(req.params.id);

    if (user) {
      user.username = username || user.username;
      user.email = email || user.email;
      user.isAdmin = isAdmin || user.isAdmin;

      const updatedUser = await user.save();

      res.status(200).json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      throw new Error(`User not found`);
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
const deleteUserById = async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    if (user) {
      if (user.isAdmin) {
        res.status(400);
        throw new Error(`Cannot delete admin user`);
      }
      await Users.deleteOne(user._id);
      res.json({ msg: `User deleted successfully` });
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export {
  createUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  getUserById,
  deleteUserById,
  updateUserById,
};
