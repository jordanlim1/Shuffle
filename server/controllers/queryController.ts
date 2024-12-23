import express, { Request, Response, NextFunction } from "express";
require("dotenv").config();
import crypto from "crypto";
import sharp from "sharp";
const Profile = require("../Models/profile");

import {
  S3Client,
  S3ClientConfig,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

const queryController = {
  uploadImages: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const images: string[] = [];

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

  getProfile: async function (req: Request, res: Response, next: NextFunction) {
    try {
      const { profile_id } = req.params;

      const profile = await Profile.findOne({ _id: profile_id });

      const {
        name,
        age,
        height,
        gender,
        location,
        distance,
        race,
        artists,
        images,
        spotifyId,
      } = profile;

      for (let i = 0; i < images.length; i++) {
        const getObjectParams = {
          Bucket: bucketName,
          Key: images[i],
        };

        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command);

        images[i] = url; // Update the array element directly
      }

      res.locals.profile = {
        name,
        age,
        height,
        gender,
        location,
        distance,
        race,
        artists,
        images,
        spotifyId,
      };

      return next();
    } catch (error) {
      return next({
        log: `${error}, Error in finding profile`,
        message: `${error}, Error in finding profile`,
      });
    }
  },
};

module.exports = queryController;
