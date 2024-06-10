import { body } from "express-validator";

export const validateAgent = [
  body("fullName").notEmpty().withMessage("Full Name is required"),
  body("email").isEmail().withMessage("Please include a valid email"),
  body("phoneNumber").notEmpty().withMessage("Phone number is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("licenseNumber").notEmpty().withMessage("License Number is required"),
  body("agencyName").notEmpty().withMessage("Agency Name is required"),
  body("agencyAddress").notEmpty().withMessage("Agency Address is required"),
  body("yearsOfExperience")
    .isInt({ min: 0 })
    .withMessage(
      "Years of Experience is required and must be a non-negative number"
    ),
  body("specializations").isArray().withMessage("Specializations are required"),
  body("preferredCommunicationChannels")
    .isArray()
    .withMessage("Preferred Communication Channels are required"),
  body("languagesSpoken")
    .isArray()
    .withMessage("Languages Spoken are required"),
  body("serviceAreas").isArray().withMessage("Service Areas are required"),
  body("professionalBio")
    .notEmpty()
    .withMessage("Professional Bio is required"),
];
