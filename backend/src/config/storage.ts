export const storageConfig = {
  endpoint:
    process.env.S3_PUBLIC_ENDPOINT ??
    "http://localhost:9001",
  bucket:
    process.env.S3_BUCKET ??
    "occurrence-images",
  accessKey:
    process.env.S3_ACCESS_KEY ??
    "resolveai",
  secretKey:
    process.env.S3_SECRET_KEY ??
    "resolveai-rustfs-password",
  corsOrigin:
    process.env.S3_CORS_ORIGIN ??
    "http://localhost:5173",
};
