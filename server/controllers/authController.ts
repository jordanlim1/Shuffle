import express, { Request, Response, NextFunction } from "express";
const Profile = require("../Models/profile");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authController = {
  hashPassword: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const saltRounds = 10;
    const { password } = req.body;

    if (!password) {
      res.locals.profile = req.body;
      return next();
    }

    bcrypt.genSalt(saltRounds, (err: Error, salt: string) => {
      if (err) {
        return next(err);
      }

      bcrypt.hash(password, salt, (err: Error, hash) => {
        if (err) {
          return next(err);
        }
        delete req.body.password;

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
    try {
      //new profile w/ hashed password into db
      const newProfile = await Profile.create(res.locals.profile);

      const accessToken = jwt.sign(
        { profileId: newProfile._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30m" }
      );

      const refreshToken = jwt.sign(
        { profileId: newProfile._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "30d" }
      );

      newProfile.refreshToken = refreshToken;
      await newProfile.save();

      const profileJWT = {
        profileId: newProfile._id,
        accessToken: accessToken,
        refreshToken: refreshToken,
      };

      res.locals.profileJWT = profileJWT;

      return next();
    } catch (err) {
      return next({
        log: "Error in creating profile middleware",
        message: { err: "Error in create profile middleware" },
      });
    }
  },
};

module.exports = authController;
