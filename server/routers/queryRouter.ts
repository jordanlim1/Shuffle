import express, { Request, Response } from "express";
const router = express.Router();
const queryController = require("../controllers/queryController");
const authController = require("../controllers/authController");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/images",
  upload.array("images"),
  queryController.addImages,
  (req: Request, res: Response): void => {
    res.status(200).json(res.locals.images);
  }
);

module.exports = router;
