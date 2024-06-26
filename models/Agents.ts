import mongoose, { Document, Schema } from "mongoose";

export interface IAgent extends Document {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  profilePicture?: string;
  id: string;
  licenseNumber: string;
  agencyName: string;
  agencyAddress: string;
  yearsOfExperience: number;
  specializations: string;
  governmentID: string;
  linkedInProfile: string;
  website: string;
  marketingPreferences: boolean;
  preferredCommunicationChannels: string;
  languagesSpoken: string;
  serviceAreas: string;
  professionalBio: string;
  certificationsAwards: string;
  references: string;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
}

const AgentSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    id: { type: String, unique: true, required: true },
    profilePicture: { type: String },
    phoneNumber: { type: String },
    licenseNumber: { type: String, default: "" },
    agencyName: { type: String, default: "" },
    agencyAddress: { type: String, default: "" },
    yearsOfExperience: { type: Number, default: 0 },
    specializations: { type: String, default: "" },
    governmentID: { type: String, default: "" },
    linkedInProfile: { type: String, default: "" },
    website: { type: String, default: "" },
    marketingPreferences: { type: Boolean, default: false },
    preferredCommunicationChannels: { type: String, default: "" },
    languagesSpoken: { type: String, default: "" },
    serviceAreas: { type: String, default: "" },
    professionalBio: { type: String, default: "" },
    certificationsAwards: { type: String, default: "" },
    references: { type: String, default: "" },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

const Agent = mongoose.model<IAgent>("Agent", AgentSchema);

export default Agent;
