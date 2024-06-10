//@ts-nocheck
import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import fs from "fs";
import cors from "cors";
import path from "path";
import agentRoutes from "./routes/agentRoutes";
import propertyRoutes from "./routes/propertyRoutes";
import bannerRoutes from "./routes/bannerRoutes";
import dotenv from "dotenv";
import { connectToDB } from "./db/db";

dotenv.config();

const app = express();

// Connect to MongoDB
connectToDB();

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const isUserWithAgentId = (user: any): user is { agentId: string } => {
  return user && typeof user === "object" && "agentId" in user;
};

// Routes
app.use("/api/property", propertyRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api", bannerRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
