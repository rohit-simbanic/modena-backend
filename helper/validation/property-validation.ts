import { check } from "express-validator";

// export const validateProperty = [
//   body("agent_id").isInt(),
//   body("category").isString().notEmpty(),
//   body("price").isString().notEmpty(),
//   body("available_for").isString().isIn(["sale", "lease"]),
//   body("listing_id").isString().notEmpty(),
//   body("property_description").isString().notEmpty(),
//   body("general_details.Price").isString().notEmpty(),
//   body("general_details.Taxes").isString().notEmpty(),
//   body("general_details.Address").isString().notEmpty(),
//   body("general_details.Lot_Size").isString().notEmpty(),
//   body("general_details.Directions").isString().notEmpty(),
//   body("room_interior.Rooms").isInt(),
//   body("room_interior.Rooms_plus").isInt(),
//   body("room_interior.Bedrooms").isInt(),
//   body("room_interior.Bedrooms_plus").isInt(),
//   body("room_interior.Kitchens").isInt(),
//   body("room_interior.Family_Room").isString().isIn(["Y", "N"]),
//   body("room_interior.Basement").isString().notEmpty(),
//   body("exterior.Property_Type").isString().notEmpty(),
//   body("exterior.Style").isString().notEmpty(),
//   body("exterior.Exterior").isString().notEmpty(),
//   body("exterior.Garage_Type").isString().notEmpty(),
//   body("exterior.Drive_Parking_Spaces").isInt(),
//   body("exterior.Pool").isString().notEmpty(),
//   body("utilities.Fireplace_Stove").isString().isIn(["Y", "N"]),
//   body("utilities.Heat_Source").isString().notEmpty(),
//   body("utilities.Heat_Type").isString().notEmpty(),
//   body("utilities.Central_Air_Conditioning").isString().notEmpty(),
//   body("utilities.Laundry_Level").isString().notEmpty(),
//   body("utilities.Sewers").isString().notEmpty(),
//   body("utilities.Water").isString().notEmpty(),
//   body("at_a_glance.Type").isString().notEmpty(),
//   body("at_a_glance.Area").isString().notEmpty(),
//   body("at_a_glance.Municipality").isString().notEmpty(),
//   body("at_a_glance.Neighbourhood").isString().notEmpty(),
//   body("at_a_glance.Style").isString().notEmpty(),
//   body("at_a_glance.LotSize").isString().notEmpty(),
//   body("at_a_glance.Tax").isString().notEmpty(),
//   body("at_a_glance.Beds").isInt(),
//   body("at_a_glance.Baths").isInt(),
//   body("at_a_glance.Fireplace").isString().isIn(["Y", "N"]),
//   body("at_a_glance.Pool").isString().notEmpty(),
//   body("street_view").isString().notEmpty(),
//   body("map_location").isString().notEmpty(),
// ];
export const validateProperty = [
  check("agent_id").isInt(),
  check("category").notEmpty(),
  check("price").isFloat(),
  check("available_for").notEmpty(),
  check("listing_id").notEmpty(),
  check("property_description").notEmpty(),
  check("general_details").isJSON(),
  check("room_interior").isJSON(),
  check("exterior").isJSON(),
  check("utilities").isJSON(),
  check("at_a_glance").isJSON(),
  check("street_view").notEmpty(),
  check("map_location").notEmpty(),
];
export const validatePreConstructedProperty = [
  check("agent_id").isInt(),
  check("category").notEmpty(),
  check("price").isFloat(),
  check("available_for").notEmpty(),
  check("listing_id").notEmpty(),
  check("property_description").notEmpty(),
  check("general_details").isJSON(),
  check("room_interior").isJSON(),
  check("exterior").isJSON(),
  check("utilities").isJSON(),
  check("at_a_glance").isJSON(),
  check("street_view").notEmpty(),
  check("map_location").notEmpty(),
];