import express from "express";

import { authenticateToken } from "../middleware/authMiddleware";
import {
  addPreConstructedProperty,
  addProperty,
  deletePreConstructedImage,
  deletePreConstructedProperty,
  deletePropertiesImage,
  deleteProperty,
  getAllPreConstructedProperties,
  getAllProperties,
  getMyProperties,
  getPreConstructedPropertyById,
  getPropertyById,
  updatePreConstructedProperty,
  updateProperty,
} from "../controllers/propertyController";

const router = express.Router();

router.post("/add-property", authenticateToken, addProperty);
router.post(
  "/pre-constructed-property",
  authenticateToken,
  addPreConstructedProperty
);
router.put("/properties/:id", authenticateToken, updateProperty);
router.put(
  "/pre-constructed-property/:id",
  authenticateToken,
  updatePreConstructedProperty
);
router.delete("/properties/:id", authenticateToken, deleteProperty);
router.delete(
  "/pre-constructed-property/:id",
  authenticateToken,
  deletePreConstructedProperty
);
router.delete(
  "/preconstructed/:id",
  authenticateToken,
  deletePreConstructedImage
);
router.delete(
  "/properties-image/:id",
  authenticateToken,
  deletePropertiesImage
);
router.get("/my-properties", authenticateToken, getMyProperties);
router.get("/properties", getAllProperties);
router.get("/pre-constructed-property", getAllPreConstructedProperties);
router.get("/properties/:id", getPropertyById);
router.get("/pre-constructed-property/:id", getPreConstructedPropertyById);

export default router;
