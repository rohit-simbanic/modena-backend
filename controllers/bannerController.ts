import { Request, Response } from "express";

const bannerData = {
  banner_header: "Looking To Sell?",
  banner_details_text:
    "Wonder what your house is really worth? I provide a complimentary detailed home evaluation which will help you determine the value of your home. Even if you are not considering selling your home today, home evaluation is important because it can provide a picture of your overall financial health.",
};

export const getBanner = (req: Request, res: Response) => {
  res.json(bannerData);
};
