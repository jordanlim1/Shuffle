import express, { Request, Response, NextFunction } from "express";

const queryController = {
  addImages: async function (req: Request, res: Response, next: NextFunction) {
    console.log("in add images", req.body);

    return next();
  },
};

module.exports = queryController;
