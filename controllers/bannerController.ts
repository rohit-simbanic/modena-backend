import { Request, Response } from "express";

const bannerData = {
  banner_header: "FIND YOUR NEXT REAL ESTATE PROPERTY",
  banner_details_text: "WE HAVE THE RIGHT PROPERTY FOR YOU",
};

export const getBanner = (req: Request, res: Response) => {
  res.json(bannerData);
};
