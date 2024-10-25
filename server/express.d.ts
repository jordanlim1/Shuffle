import express from "express";
import { Buffer } from "buffer";

declare global {
  namespace Express {
    export interface UploadedFile {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      size: number;
      buffer: Buffer;
      destination?: string;
      filename?: string;
      path?: string;
    }

    export interface Request {
      file?: UploadedFile; // Custom type for single file upload
      files?: { [fieldname: string]: UploadedFile[] } | UploadedFile[]; // Custom type for multiple files upload
    }
  }
}
