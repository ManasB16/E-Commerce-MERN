import { isValidObjectId } from "mongoose";

const checkValidObjectId = (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(404);
    throw new Error(`Invalid Object of: ${req.params.id}`);
  }
  next();
};

export default checkValidObjectId;
