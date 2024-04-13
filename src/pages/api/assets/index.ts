import { fileUpload } from "@/utils/fileUpload";
import { Request, Response } from "express";

//don't want to use bodyParser from nextjs because want to use Multer here
// bodyParser and Multer has the same action that both handle the request body
export const config = {
  api: {
    bodyParser: false,
  },
};

//req and res types are used from express not from nextjs here
export default function handler(req: Request, res: Response) {
  try {
    fileUpload(req, res, (error) => {
      if (error) {
        console.log("here one");
        console.log(error);
        return res.status(500).send("Internal Server Error");
      }
      const files = req.files as Express.MulterS3.File[];
      const file = files[0];
      const assetUrl = file.location;
      res.status(200).json({ assetUrl });
    });
  } catch (err) {
    console.log("here two");
    res.status(500).send("Internal Server Error");
  }
}
