const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String },
  age: { type: String, required: true },
  height: { type: String, required: true },
  gender: { type: String, required: true },
  preference: { type: String, required: true },
  orientation: { type: String, required: true },
  location: { type: Object, required: true },
  distance: { type: Number, required: true },
  race: { type: String, required: true },
  artists: { type: Object, required: true },
  images: { type: Object, required: true },
  verified: { type: Boolean, default: false },
  refreshToken: { type: String, required: false },
  created_at: { type: String, required: true },
  verificationToken: String,
  crushes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  receivedLikes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  matches: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

//later: profileSchema.pre to hash password

module.exports = mongoose.model("Profile", profileSchema);
