const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String },
  age: { type: String, required: true },
  gender: { type: String, required: true },
  bio: { type: String },
  artists: { type: Object, required: true },
  images: { type: Object, required: true },
  verified: { type: Boolean, default: false },
  orientation: { type: String, required: true },
  verificationToken: String,
  crushes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  receivedLikes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  matches: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

//later: profileSchema.pre to hash password

module.exports = mongoose.model("Profile", profileSchema);
