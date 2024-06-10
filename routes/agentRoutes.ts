import express from "express";
import {
  getAgent,
  getAgentById,
  getAllAgents,
  loginAgent,
  registerAgent,
  requestPasswordReset,
  resetAgentPassword,
  resetPassword,
  updateAgent,
  verifyOldPassword,
} from "../controllers/agentController";
import { uploadProfilePicture } from "../config/multer";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register-agent", uploadProfilePicture, registerAgent);
router.post("/login", loginAgent);
router.get("/agent/:id", getAgent);
router.put("/agents/:id", updateAgent);
router.put("/agent/:id/reset-password", resetAgentPassword);
router.get("/agents", getAllAgents);
router.get("/agents/:id", getAgentById);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password/:token", resetPassword);
router.post("/verify-password/:id", verifyOldPassword);

export default router;
