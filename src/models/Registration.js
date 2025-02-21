// src/models/Registration.js
import mongoose from "mongoose";

const RegistrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  course: { type: String, required: true },
  branch: { type: String, required: true },
  college: { type: String, required: true },
  contact: { type: String, required: true },
  event: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Registration || mongoose.model("Registration", RegistrationSchema);