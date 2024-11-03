import express, { Request, Response } from "express";
const router = express.Router();
const authController = require("../controllers/authController");

router.post(
  "/createProfile",
  authController.hashPassword,
  authController.createProfile,
  (req: Request, res: Response): void => {
    console.log("res.locals.profile", res.locals.profile);
    res.status(200).json(res.locals.profile);
  }
);
module.exports = router;
