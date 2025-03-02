"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  },
});

async function uploadImageToS3(formData) {
  try {
    // Get the image file from FormData
    const imageFile = formData.get("media");

    if (!imageFile) {
      throw new Error("No image file found in FormData");
    }

    // Generate a unique filename with original extension
    const fileExtension = imageFile.name.split(".").pop();
    const fileName = `uploaded_image_${Date.now()}.${fileExtension}`;

    // Convert file to buffer
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Set up S3 upload parameters
    const params = {
      Bucket: "very-deep-thoughts",
      Key: fileName,
      Body: buffer,
      ContentType: imageFile.type, // Uses the actual image MIME type
    };

    // Upload to S3
    await s3Client.send(new PutObjectCommand(params));
    const url = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;

    return url;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    return { success: false, error: error.message };
  }
}

export { uploadImageToS3 };
