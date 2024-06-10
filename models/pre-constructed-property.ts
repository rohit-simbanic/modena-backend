import { url } from "inspector";
import mongoose, { Document, Schema } from "mongoose";

// Define interfaces for various sections of the property details
interface GeneralDetails {
  Price: string;
  Address: string;
  Rooms: string;
  Bedrooms: string;
}

// Interface for the main property document
interface IProperty extends Document {
  name: string;
  category: string;
  price: string;
  available_for: string;
  listing_id: string;
  property_description: string;
  property_image?: { filename: string };
  general_details: GeneralDetails;
  agentId: string;
}

// Schema definition for the property
const PropertySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: String, required: true },
    available_for: { type: String, required: true },
    listing_id: { type: String, required: true, unique: true },
    property_description: { type: String, required: true },
    property_image: {
      filename: { type: String },
      url: { type: String },
    },
    general_details: {
      Price: { type: String, required: true },
      Address: { type: String, required: true },
      Rooms: { type: String, required: true },
      Bedrooms: { type: String, required: true },
    },
    agentId: { type: String, required: true },
  },
  { timestamps: true }
);

const PreConstructedProperty = mongoose.model<IProperty>(
  "PreConstructedProperty",
  PropertySchema
);

export default PreConstructedProperty;
