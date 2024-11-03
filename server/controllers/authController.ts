import express, { Request, Response, NextFunction } from "express";
const Profile = require("../Models/profile");

const authController = {
  hashPassword: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { password } = req.body;
  },

  createProfile: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log(req.body);

    const { email } = req.body;

    try {
      const profile = await Profile.findOne({ email: email });

      console.log("found profile?", profile);

      if (profile === null) {
        console.log("we are in exisitng profile");

        const newProfile = await Profile.create(req.body);

        console.log("new profile:", newProfile);

        res.locals.profile = newProfile;
        return next();
      }
    } catch (err) {
      console.log("Error in creating profile", err);
    }

    return next();
  },
};

module.exports = authController;
