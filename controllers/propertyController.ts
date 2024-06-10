//@ts-nocheck
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import path from "path";
import { upload } from "../config/multer";
import Property from "../models/property";
import PreConstructedProperty from "../models/pre-constructed-property";
import fs from "fs";

export const addProperty = async (req: Request, res: Response) => {
  upload(req, res, async (err: { message: any }) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (!req.files || (req.files as Express.Multer.File[]).length < 5) {
      return res
        .status(400)
        .json({ message: "You must upload at least 5 images." });
    }

    const form = req.body;
    form.general_details = JSON.parse(form.general_details);
    form.room_interior = JSON.parse(form.room_interior);
    form.exterior = JSON.parse(form.exterior);
    form.utilities = JSON.parse(form.utilities);
    form.at_a_glance = JSON.parse(form.at_a_glance);

    const fileData = (req.files as Express.Multer.File[]).map((file) => ({
      filename: file.filename,
      url: (file as any).path,
    }));

    // Generate Google Maps URLs
    const latitude = form.latitude;
    const longitude = form.longitude;
    const streetViewUrl = `https://www.google.com/maps/@${latitude},${longitude},3a,73.7y,270h,90t/data=!3m6!1e1!3m4!1s2ZDYMmV3Ru7cbc6eDhnqvA!2e0!7i16384!8i8192?entry=ttu`;
    const mapLocationUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2877.1912415808292!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4d4eee6c5e2f1%3A0xbc056247af50dad9!2s41%20Blackwell%20Ct%2C%20Markham%2C%20ON%20L3R%200C5%2C%20Canada!5e0!3m2!1sen!2sin!4v1716295325520!5m2!1sen!2sin`;

    const property = new Property({
      ...form,
      agentId: req.user?.agentId,
      property_images: fileData,
      street_view: streetViewUrl,
      map_location: mapLocationUrl,
    });

    try {
      await property.save();
      res.status(201).json({ message: "Property saved successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error saving property" });
    }
  });
};

export const addPreConstructedProperty = async (
  req: Request,
  res: Response
) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ message: "A property image is required." });
    }

    const form = req.body;
    console.log("FORM", form);
    form.general_details = JSON.parse(form.general_details);

    const fileData = {
      filename: req.file.filename,
      url: req.file.path,
    };

    // Create a new property object
    const property = new PreConstructedProperty({
      ...form,
      agentId: req.user?.agentId,
      property_image: fileData,
    });

    try {
      await property.save();
      res
        .status(201)
        .json({ message: "Pre-constructed property saved successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error saving property" });
    }
  });
};

export const updateProperty = async (req: Request, res: Response) => {
  const propertyId = req.params.id;
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  upload(req, res, async (err) => {
    try {
      const property = await Property.findOne({
        listing_id: propertyId,
        agentId: user.agentId,
      });

      if (!property) {
        return res
          .status(404)
          .json({ message: "Property not found or not authorized" });
      }

      property.category = req.body.category || property.category;
      property.price = req.body.price || property.price;
      property.available_for = req.body.available_for || property.available_for;
      property.listing_id = req.body.listing_id || property.listing_id;
      property.property_description =
        req.body.property_description || property.property_description;
      property.general_details = req.body.general_details
        ? JSON.parse(req.body.general_details)
        : property.general_details;
      property.room_interior = req.body.room_interior
        ? JSON.parse(req.body.room_interior)
        : property.room_interior;
      property.exterior = req.body.exterior
        ? JSON.parse(req.body.exterior)
        : property.exterior;
      property.utilities = req.body.utilities
        ? JSON.parse(req.body.utilities)
        : property.utilities;
      property.at_a_glance = req.body.at_a_glance
        ? JSON.parse(req.body.at_a_glance)
        : property.at_a_glance;

      if (req.files && req.files.length) {
        const fileData = (req.files as Express.Multer.File[]).map((file) => ({
          filename: file.filename,
          url: (file as any).path,
        }));
        property.property_images = [...property.property_images, ...fileData];
      }

      await property.save();
      res.status(200).json({ message: "Property updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating property" });
    }
  });
};

export const updatePreConstructedProperty = async (
  req: Request,
  res: Response
) => {
  upload(req, res, async (err) => {
    const propertyId = req.params.id;

    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const property = await PreConstructedProperty.findOne({
        listing_id: propertyId,
        agentId: user.agentId,
      });

      if (!property) {
        return res
          .status(404)
          .json({ message: "Property not found or not authorized" });
      }
      console.log("console", req.body, req.file);
      property.name = req.body.name || property.name;
      property.category = req.body.category || property.category;
      property.price = req.body.price || property.price;
      property.available_for = req.body.available_for || property.available_for;
      property.listing_id = req.body.listing_id || property.listing_id;
      property.property_description =
        req.body.property_description || property.property_description;
      property.general_details = req.body.general_details
        ? JSON.parse(req.body.general_details)
        : property.general_details;

      if (req.file) {
        property.property_image = {
          filename: req.file.filename,
          url: req.file.path,
        };
      }

      await property.save();
      res
        .status(200)
        .json({ message: "Pre-constructed Property updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating property" });
    }
  });
};

export const deleteProperty = async (req: Request, res: Response) => {
  const propertyId = req.params.id;
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const property = await Property.findOneAndDelete({
      listing_id: propertyId,
      agentId: user.agentId,
    });

    if (!property) {
      return res
        .status(404)
        .json({ message: "Property not found or not authorized" });
    }

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting property" });
  }
};

export const deletePreConstructedProperty = async (
  req: Request,
  res: Response
) => {
  const propertyId = req.params.id;
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const property = await PreConstructedProperty.findOneAndDelete({
      listing_id: propertyId,
      agentId: user.agentId,
    });

    if (!property) {
      return res
        .status(404)
        .json({ message: "Property not found or not authorized" });
    }
    res
      .status(200)
      .json({ message: "Pre-constructed Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting property" });
  }
};
export const deletePreConstructedImage = async (
  req: Request,
  res: Response
) => {
  const propertyId = req.params.id;
  const { filename } = req.body;
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const property = await PreConstructedProperty.findOne({
      listing_id: propertyId,
      agentId: user.agentId,
    });

    if (!property) {
      return res
        .status(404)
        .json({ message: "Property not found or not authorized" });
    }
    // Check if the image exists in the property
    if (property.property_image.filename !== filename) {
      return res.status(404).json({ message: "Image not found" });
    }
    property.property_image = { filename: "", url: "" };
    await property
      .save()
      .then(() =>
        res.status(200).json({ message: "Image deleted successfully" })
      )
      .catch((saveError) => {
        console.error(
          "Failed to save property after deleting image:",
          saveError
        );
        res
          .status(500)
          .json({ message: "Error saving property after deleting image" });
      });
  } catch (error) {
    console.error("Error during deletion process:", error);
    res.status(500).json({ message: "Error deleting image" });
  }
};
export const deletePropertiesImage = async (req: Request, res: Response) => {
  const propertyId = req.params.id;
  const { filename } = req.body;
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const property = await Property.findOne({
      listing_id: propertyId,
      agentId: user.agentId,
    });

    if (!property) {
      return res
        .status(404)
        .json({ message: "Property not found or not authorized" });
    }

    // Remove the image reference from property
    property.property_images = property.property_images.filter(
      (img) => img.filename !== filename
    );

    property
      .save()
      .then(() =>
        res.status(200).json({ message: "Image deleted successfully" })
      )
      .catch((saveError) => {
        console.error(
          "Failed to save property after deleting image:",
          saveError
        );
        res
          .status(500)
          .json({ message: "Error saving property after deleting image" });
      });
  } catch (error) {
    console.error("Error during deletion process:", error);
    res.status(500).json({ message: "Error deleting image" });
  }
};
export const getAllProperties = async (req: Request, res: Response) => {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: "Error reading properties file" });
  }
};

export const getPropertyById = async (req: Request, res: Response) => {
  const propertyId = req.params.id;

  try {
    const property = await Property.findOne({ listing_id: propertyId });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: "Error reading properties file" });
  }
};

export const getAllPreConstructedProperties = async (
  req: Request,
  res: Response
) => {
  try {
    const properties = await PreConstructedProperty.find();
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: "Error reading properties file" });
  }
};

export const getPreConstructedPropertyById = async (
  req: Request,
  res: Response
) => {
  const propertyId = req.params.id;

  try {
    const property = await PreConstructedProperty.findOne({
      listing_id: propertyId,
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: "Error reading properties file" });
  }
};

export const getMyProperties = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const properties = await Property.find({ agentId: user.agentId });
    const preConstructedProperties = await PreConstructedProperty.find({
      agentId: user.agentId,
    });

    const allProperties = [...properties, ...preConstructedProperties];
    const sortedProperties = allProperties.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    res.status(200).json(sortedProperties);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving properties" });
  }
};
