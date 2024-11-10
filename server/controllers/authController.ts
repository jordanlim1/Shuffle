import express, { Request, Response, NextFunction } from "express";
const Profile = require("../Models/profile");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
      const newProfile = await Profile.create(req.body);

      // const accessToken = jwt.sign(
      //   { profileId: newProfile._id },
      //   process.env.ACCESS_TOKEN_SECRET,
      //   { expiresIn: "30m" }
      // );

      // const refreshToken = jwt.sign(
      //   { profileId: newProfile._id },
      //   process.env.REFRESH_TOKEN_SECRET,
      //   { expiresIn: "30d" }
      // );

      // newProfile.refreshToken = refreshToken;
      // await newProfile.save();

      const profileJWT = {
        profileId: newProfile._id,
        // accessToken: accessToken,
      };

      res.locals.profileJWT = profileJWT;

      return next();
    } catch (error) {
      return next({
        log: `Error in creating profile: ${error}`,
        message: `Error in creating profile: ${error}`,
      });
    }
  },

  refreshToken: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { profile_id } = req.params;
      const profile = await Profile.findOne({ _id: profile_id });

      const { refreshToken } = profile;
      const url = "https://accounts.spotify.com/api/token";
      const clientId = process.env.CLIENT_ID;

      const payload = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id: clientId!,
        }),
      };
      const body = await fetch(url, payload);
      const response = await body.json();

      profile.refreshToken = response.refresh_token;
      await profile.save();
      res.locals.token = response.access_token;

      return next();
    } catch (error) {
      return next({
        log: `Error in refreshing token: ${error}`,
        message: `Error in refreshing token: ${error}`,
      });
    }
  },
};

module.exports = authController;
