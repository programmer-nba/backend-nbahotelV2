const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
  },
  {timestamps: true}
);

const Role = mongoose.model("role", roleSchema);

module.exports = Role;
