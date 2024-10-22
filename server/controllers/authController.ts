import express, { Request, Response, NextFunction } from "express";
require("dotenv").config();

const client = process.env.CLIENT_ID;
const redirectUri = "http://localhost:8080";
const scope = "user-read-private user-read-email";
const authUrl = new URL("https://accounts.spotify.com/authorize?");

const authController = {
  authorizeUser: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("in verifyUser");

    return next();
  },
};

module.exports = authController;
