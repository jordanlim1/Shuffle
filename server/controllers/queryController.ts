import express, { Request, Response, NextFunction } from "express";
const multer = require("multer");
require("dotenv").config();
import crypto from "crypto";
import sharp from "sharp";

import { S3Client, S3ClientConfig, PutObjectCommand } from "@aws-sdk/client-s3";

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.AWS_SECRET_ACCESS_KEY;
const secretAccessKey = process.env.AWS_ACCESS_KEY_ID;

const randomImageName = (bytes = 16) =>
  crypto.randomBytes(bytes).toString("hex");

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
} as S3ClientConfig);

const images: string[] = [];

const queryController = {
  addImages: async function (req: Request, res: Response, next: NextFunction) {
    console.log(req.files);
    if (Array.isArray(req.files)) {
      for (const img of req.files) {
        const imgName = randomImageName();
        images.push(imgName);

        const buffer = await sharp(img.buffer)
          .resize({
            height: 1000,
            width: 500,
            fit: "contain",
          })
          .toBuffer();

        const params = {
          Bucket: bucketName,
          Key: imgName,
          Body: buffer,
          ContentType: img.mimetype,
        };

        const command = new PutObjectCommand(params);

        await s3.send(command);
      }
    }

    res.locals.images = images;
    return next();
  },

  createProfile: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log(req.body);

    return next();
  },
};

module.exports = queryController;
