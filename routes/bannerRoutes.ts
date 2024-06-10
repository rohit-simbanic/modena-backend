import express from "express";
import { getBanner } from "../controllers/bannerController";

const router = express.Router();

router.get("/banner", getBanner);

export default router;
