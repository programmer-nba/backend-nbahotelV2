const mongoose = require("mongoose");

// Define the schema for the HotelUser entity
const adminSchema = new mongoose.Schema(
  {
    password: {type: String, required: true},
    username: {type: String, required: true},
    roles: {type: String, required: true},
    timestamps: {type: String, required: true}
  },
  {timestamps: true}
);

const Admin = mongoose.model("admin", adminSchema);

module.exports = Admin;
