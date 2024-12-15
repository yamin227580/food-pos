import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import QRCode from "qrcode";
import { config } from "./config";

const s3Client = new S3Client({
  endpoint: config.spaceEndpoint, //website's address
  region: "sgp1",
  credentials: {
    accessKeyId: config.spaceAccessKeyId,
    secretAccessKey: config.spaceSecretAccessKey,
  },
});

export const fileUpload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: "my-project-image-storage",
    acl: "public-read",
    key: (request, file, cb) => {
      cb(null, `foodie-pos/nilar/${Date.now()}_${file.originalname}`);
    },
  }),
}).array("files", 1);

export const generateLinkForQRCode = (tableId: number) => {
  return `${config.orderAppUrl}?tableId=${tableId}`;
};

export const qrCodeImageUpload = async (tableId: number) => {
  try {
    //scale is the size of qr image and its default is 4
    const qrImageData = await QRCode.toDataURL(generateLinkForQRCode(tableId), {
      scale: 20,
    });

    const input = {
      Bucket: "my-project-image-storage",
      Key: `foodie-pos/nilar/qrcode/tableId-${tableId}.png`,
      ACL: "public-read",
      Body: Buffer.from(
        qrImageData.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      ),
    };
    // @ts-ignore
    const command = new PutObjectCommand(input);
    await s3Client.send(command);
  } catch (err) {
    console.error(err);
  }
};

export const getQrCodeUrl = (tableId: number) => {
  return `https://my-project-image-storage.sgp1.digitaloceanspaces.com/foodie-pos/nilar/qrcode/tableId-${tableId}.png`;
};
