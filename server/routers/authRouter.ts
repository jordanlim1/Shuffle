import express, { Request, Response } from "express";
const router = express.Router();
const authController = require("../controllers/authController");

router.post(
  "/createProfile",
  authController.createProfile,
  (req: Request, res: Response): void => {
    res.status(200).json(res.locals.profileJWT);
  }
);

router.get(
  "/refresh-token/:profile_id",
  authController.refreshToken,
  (req: Request, res: Response): void => {
    res.status(200).json(res.locals.token);
  }
);
module.exports = router;
