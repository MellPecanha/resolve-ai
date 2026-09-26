import { randomUUID } from "node:crypto";

import {
  CreateBucketCommand,
  GetObjectCommand,
  PutBucketCorsCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { storageConfig } from "../config/storage.js";

import type { CreateOccurrenceImageUploadDTO } from "../dtos/upload.dto.js";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const UPLOAD_EXPIRATION_SECONDS = 300;
const DOWNLOAD_EXPIRATION_SECONDS = 900;

const extensionsByContentType = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

const storageClient = new S3Client({
  endpoint: storageConfig.endpoint,
  region: "us-east-1",
  forcePathStyle: true,
  credentials: {
    accessKeyId: storageConfig.accessKey,
    secretAccessKey: storageConfig.secretKey,
  },
});

export async function ensureOccurrenceImageBucket() {
  try {
    await storageClient.send(
      new CreateBucketCommand({
        Bucket: storageConfig.bucket,
      }),
    );
  } catch (error) {
    if (
      !(error instanceof Error) ||
      ![
        "BucketAlreadyExists",
        "BucketAlreadyOwnedByYou",
      ].includes(error.name)
    ) {
      throw error;
    }
  }

  await storageClient.send(
    new PutBucketCorsCommand({
      Bucket: storageConfig.bucket,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedOrigins: [storageConfig.corsOrigin],
            AllowedMethods: ["POST", "GET", "HEAD"],
            AllowedHeaders: ["*"],
            ExposeHeaders: ["ETag"],
            MaxAgeSeconds: 300,
          },
        ],
      },
    }),
  );
}

export function isOccurrenceImageKey(
  key: string,
  userId: number,
) {
  return key.startsWith(
    `occurrence-images/${userId}/`,
  );
}

export function isManagedOccurrenceImageKey(key: string) {
  return key.startsWith("occurrence-images/");
}

export async function createOccurrenceImageUpload(
  userId: number,
  data: CreateOccurrenceImageUploadDTO,
) {
  const extension =
    extensionsByContentType[data.contentType];
  const key =
    `occurrence-images/${userId}/${randomUUID()}.${extension}`;

  const upload = await createPresignedPost(
    storageClient,
    {
      Bucket: storageConfig.bucket,
      Key: key,
      Expires: UPLOAD_EXPIRATION_SECONDS,
      Fields: {
        "Content-Type": data.contentType,
      },
      Conditions: [
        ["content-length-range", 1, MAX_IMAGE_SIZE],
        ["eq", "$Content-Type", data.contentType],
      ],
    },
  );

  return {
    key,
    ...upload,
  };
}

export async function getOccurrenceImageUrl(key: string) {
  return getSignedUrl(
    storageClient,
    new GetObjectCommand({
      Bucket: storageConfig.bucket,
      Key: key,
    }),
    {
      expiresIn: DOWNLOAD_EXPIRATION_SECONDS,
    },
  );
}
