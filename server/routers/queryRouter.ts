import express, { Request, Response } from "express";
const router = express.Router();
const queryController = require("../controllers/queryController");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/images",
  upload.single("image"),
  (req: Request, res: Response): void => {
    console.log("hello", req.file);
    if (req.file) {
      console.log("File Buffer:", req.file.buffer); // Buffer of the uploaded file
      console.log("File Original Name:", req.file.originalname);
      console.log("File MIME Type:", req.file.mimetype);
    }
    res.status(200).json();
  }
);

module.exports = router;
