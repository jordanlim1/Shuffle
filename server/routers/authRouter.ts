import express, { Request, Response } from "express";
const router = express.Router();
const authController = require("../controllers/authController");

router.get(
  "/authorize",
  authController.authorizeUser,
  (req: Request, res: Response): void => {
    res.status(200).json();
  }
);

module.exports = router;
