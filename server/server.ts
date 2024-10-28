import { NextFunction } from "connect";
import express, {
  Request,
  Response,
  ErrorRequestHandler,
  Router,
} from "express";
const app: any = express();
const cors = require("cors");
const PORT = 3000;
app.use(express.json());
app.use(cors());
const mongoose = require("mongoose");
const authRouter = require("./routers/authRouter");
const queryRouter = require("./routers/queryRouter");
require("dotenv").config();

const dbURL = process.env.MONGO_URI;

import { S3Client, S3ClientConfig, PutObjectCommand } from "@aws-sdk/client-s3";

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.AWS_SECRET_ACCESS_KEY;
const secretAccessKey = process.env.AWS_ACCESS_KEY_ID;
// mongoose
//   .connect(MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     dbName: "shuffle",
//   })
//   .then(() => console.log("Connected to MongoDB..."))
//   .catch((err) => console.log("MongoDB error: ", err));

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
} as S3ClientConfig);

app.use("/auth", authRouter);
app.use("/query", queryRouter);

app.get("/", (req: Request, res: Response) => {
  return res.send("the server works!!");
});

//unknown path handler
app.use("*", (req: Request, res: Response) => {
  return res.status(404).send("404 page does not exist");
});

//global error handler
app.use(
  (
    err: ErrorRequestHandler,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const defaultErr = {
      log: "Express error handler caught unknown middleware error",
      status: 500,
      message: { err: "An error occurred" },
    };
    const errorObj = Object.assign({}, defaultErr, err);
    console.log(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
  }
);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
