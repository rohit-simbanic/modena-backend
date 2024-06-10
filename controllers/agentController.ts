import { Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import path from "path";
import Agent from "../models/Agents";
import { uploadProfilePicture } from "../config/multer";

const SecretKey =
  process.env.SECRET_KEY ||
  "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcxNjE4ODc5NiwiaWF0IjoxNzE2MTg4Nzk2fQ.UO5TLvO9v4Tr_X7p51oCKEWqpjtix30BWrR4LFxP66M";

// Generate JWT token
const generateToken = (agentId: string) => {
  return jwt.sign({ agentId }, SecretKey, { expiresIn: "10d" });
};

export const registerAgent = async (req: Request, res: Response) => {
  const agentData = req.body;

  try {
    const existingAgent = await Agent.findOne({ email: agentData.email });

    if (existingAgent) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(agentData.password, salt);
    const agent = new Agent({
      ...agentData,
      password: hashedPassword,
      id: `agent_${Date.now()}`,
      profilePicture: req.file ? `${req.file.filename}` : null,
    });

    await agent.save();
    res.status(201).json({ message: "Agent registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error registering agent" });
  }
};

export const loginAgent = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const agent = await Agent.findOne({ email });

    if (!agent) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, agent.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(agent.id);
    res.status(200).json({ token, agentId: agent.id });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};

export const getAgent = async (req: Request, res: Response) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.status(200).json(agent);
  } catch (error) {
    res.status(500).json({ message: "Error fetching agent profile" });
  }
};

export const updateAgent = async (req: Request, res: Response) => {
  uploadProfilePicture(req, res, async (err: any) => {
    const agentID = req.params.id;
    try {
      const updateData = {
        ...req.body,
      };

      // Check if a new profile picture was uploaded
      if (req.file) {
        updateData.profilePicture = req.file.filename;
      }

      const existingProperty = await Agent.findOne({ id: agentID });
      if (!existingProperty) {
        res.status(404).json({
          status: false,
          message: "Property not found or already deleted",
        });
        return;
      }
      // If no new profile picture is provided, preserve the existing one
      if (!req.file) {
        updateData.profilePicture = existingProperty.profilePicture;
      }
      existingProperty.set(updateData);

      const updatedProperty = await existingProperty.save();

      res.status(200).json(updatedProperty);
    } catch (error) {
      res.status(500).json({ message: "Error updating agent profile" });
    }
  });
};

export const resetAgentPassword = async (req: Request, res: Response) => {
  const { password } = req.body;
  const agentId = req.params.id;
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    const agent = await Agent.findOne({ id: agentId });

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }
    // Compare new password with the old password
    const isSamePassword = await bcrypt.compare(password, agent.password);
    if (isSamePassword) {
      return res.status(400).json({
        message: "New password cannot be the same as the old password",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    agent.password = hashedPassword;
    await agent.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password" });
  }
};

export const getAllAgents = async (req: Request, res: Response) => {
  try {
    const agents = await Agent.find();
    res.status(200).json(agents);
  } catch (error) {
    res.status(500).json({ message: "Error reading agents file" });
  }
};

export const getAgentById = async (req: Request, res: Response) => {
  const agentId = req.params.id;

  try {
    const agent = await Agent.findOne({ id: agentId });
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }
    res.status(200).json(agent);
  } catch (error) {
    res.status(500).json({ message: "Error reading agents file" });
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const agent = await Agent.findOne({ email });
    if (!agent) {
      return res.status(404).json({ message: "Email not found" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    agent.resetPasswordToken = token;
    agent.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await agent.save();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: agent.email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
      Please click on the following link, or paste this into your browser to complete the process:
      ${process.env.FRONTEND_URL}/admin/signup/reset-password-client/${token}
      If you did not request this, please ignore this email and your password will remain unchanged.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ message: "Error sending password reset email" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const agent = await Agent.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!agent) {
      return res
        .status(400)
        .json({ message: "Password reset token is invalid or has expired" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    agent.password = hashedPassword;
    agent.resetPasswordToken = null;
    agent.resetPasswordExpires = null;
    await agent.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password" });
  }
};

export const verifyOldPassword = async (req: Request, res: Response) => {
  const { password } = req.body;
  const user = req.params.id;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const agent = await Agent.findOne({ id: user });

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    const isMatch = await bcrypt.compare(password, agent.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Old password is incorrect" });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Error verifying password" });
  }
};
