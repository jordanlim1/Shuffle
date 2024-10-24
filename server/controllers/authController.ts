import express, { Request, Response, NextFunction } from "express";
const Profile = require("../Models/profile");

const authController = {
  createProfile: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("in verifyUser", req.body);

    const { name, email, artists } = req.body;

    const newProfile = await Profile.create(req.body);
    console.log(newProfile);
    return next();
  },
};

module.exports = authController;
