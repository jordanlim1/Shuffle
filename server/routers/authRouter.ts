import express, { Request, Response } from "express";
const router = express.Router();
const authController = require("../controllers/authController");

router.post(
  "/createProfile",
  authController.createProfile,
  (req: Request, res: Response): void => {
    res.status(200).json();
  }
);

module.exports = router;
