import express, { Request, Response, NextFunction } from "express";

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
