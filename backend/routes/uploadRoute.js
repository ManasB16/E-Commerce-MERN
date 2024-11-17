import express from "express";
import path from "path";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const extName = path.extname(file.originalname);
    cb(null, `${file.fieldname} - ${Date.now()}${extName}`);
  },
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpe?g|png|webp/;
  const mimeTypes = /image\/jpe?g|image\/png|image\/webp/;

  const extName = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype;

  if (fileTypes.test(extName) && mimeTypes.test(mimeType)) {
    cb(null, true);
  } else {
    cb(new Error("Images only"), false);
  }
};

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");

router.post("/", (req, res) => {
  uploadSingleImage(req, res, (err) => {
    if (err) {
      res.status(400).send({ message: err.message });
    } else if (req.file) {
      res.status(200).send({
        message: "Image uploaded successfully",
        image: `/${req.file.path}`,
      });
    } else {
      res.status(400).send({ message: "No image file provided" });
    }
  });
});

export default router;
