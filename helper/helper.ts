//@ts-nocheck

import fs from "fs";

import { promisify } from "util";

// Promisify the fs.readFile and fs.writeFile functions
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

// Define the Agent interface
export interface Agent {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  licenseNumber: string;
  agencyName: string;
  agencyAddress: string;
  yearsOfExperience: number;
  specializations: string[];
  profilePicture?: string;
  governmentID?: string;
  linkedInProfile?: string;
  website?: string;
  marketingPreferences?: boolean;
  preferredCommunicationChannels: string[];
  languagesSpoken: string[];
  serviceAreas: string[];
  professionalBio: string;
  certificationsAwards?: string[];
  references?: string[];
}

// Function to read data from a file
export const readFile = async (filePath: string): Promise<any[]> => {
  try {
    const data = await readFileAsync(filePath, "utf8");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    if (
      error instanceof Error &&
      (error as NodeJS.ErrnoException).code === "ENOENT"
    ) {
      return [];
    }
    throw error;
  }
};

// Function to write data to a file
export const writeFile = async (
  filePath: string,
  data: any[]
): Promise<void> => {
  await writeFileAsync(filePath, JSON.stringify(data, null, 2), "utf8");
};
