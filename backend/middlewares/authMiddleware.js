import jwt from "jsonwebtoken";
import Users from "../models/userModel.js";

//Authenticate User

const authenticate = async (req, res, next) => {
  try {
    let token;
    token = req.cookies.jwt;
    if (token) {
      const decodedJWT = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await Users.findById(decodedJWT.userId).select("-password");
      next();
    } else {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

//Authorize Admin

const authorizeAdmin = async (req, res, next) => {
  if (req.user && req.user.isAdmin) next();
  else {
    res.status(401).send("Not authorized as admin");
  }
};

export { authenticate, authorizeAdmin };
