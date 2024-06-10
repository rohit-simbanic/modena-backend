import mongoose, { Schema, Document } from "mongoose";

interface IProperty extends Document {
  listing_id: string;
  category: string;
  price: string;
  available_for: string;
  property_description: string;
  property_images: { filename: string }[];
  general_details: Record<string, any>;
  room_interior: Record<string, any>;
  exterior: Record<string, any>;
  utilities: Record<string, any>;
  at_a_glance: Record<string, any>;
  street_view: string;
  map_location: string;
  latitude: string;
  longitude: string;
  agentId: string;
}

const PropertySchema: Schema = new Schema(
  {
    listing_id: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: String, required: true },
    available_for: { type: String, required: true },
    property_description: { type: String, required: true },
    property_images: [{ filename: { type: String, required: true } }],
    general_details: { type: Object, required: true },
    room_interior: { type: Object, required: true },
    exterior: { type: Object, required: true },
    utilities: { type: Object, required: true },
    at_a_glance: { type: Object, required: true },
    street_view: { type: String, required: true },
    map_location: { type: String, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    agentId: { type: String, required: true },
  },
  { timestamps: true }
);

const Property = mongoose.model<IProperty>("Property", PropertySchema);

export default Property;
