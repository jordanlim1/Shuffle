import express, { Request, Response, NextFunction } from "express";
const Profile = require("../Models/profile");
const bcrypt = require("bcrypt");

const authController = {
  hashPassword: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const saltRounds = 10;
    const { password } = req.body;

    bcrypt.genSalt(saltRounds, (err: Error, salt: string) => {
      if (err) {
        return next(err);
      }

      bcrypt.hash(password, salt, (err: Error, hash) => {
        if (err) {
          return next(err);
        }
        delete req.body.password;

        console.log("Hashed password:", hash);
        const newProfile = { ...req.body, password: hash };
        res.locals.profile = newProfile;
        return next();
      });
    });
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
        console.log("we are in exisitng profile", res.locals.profile);

        const newProfile = await Profile.create(res.locals.profile);

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
