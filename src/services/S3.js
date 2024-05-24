const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const bucketName = process.env.BUCKET_NAME;
const bucketRegion= process.env.BUCKET_REGION;
const accessKey= process.env.ACCESS_KEY;
const secretAccessKey= process.env.SECRET_ACCESS_KEY;

const S3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});

const getObjectSignedUrl = async (key) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: key,
    }
  
    const command = new GetObjectCommand(params);
    const seconds = 3600;
    const url = await getSignedUrl(S3, command, { expiresIn: seconds });
  
    return url;
  } catch (error) {
    throw new Error(error);
  }
}

const uploadImage = (imageName, imageBuffer, mimeType) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: imageName,
      Body: imageBuffer,
      ContentType: mimeType,
    }
  
    return S3.send(new PutObjectCommand(params));
  } catch (error) {
    throw new Error(error);
  }
}

const deleteImage = (imageName) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: imageName,
    }
  
    return S3.send(new DeleteObjectCommand(params));
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = { getObjectSignedUrl, uploadImage, deleteImage };