import mongoose from "mongoose";

// Schema for storing repository information
const repositorySchema = new mongoose.Schema({
  name: String,
  full_name: String,
  description: String,
  url: String,
  language: String,
  stars: Number,
  forks: Number,
});

// Schema for storing user information
const userSchema = new mongoose.Schema(
  {
    githubId: { type: String, required: true, unique: true },
    name: { type: String },
    email: { type: String },
    avatarUrl: { type: String },
    profileUrl: { type: String },
    repositories: [repositorySchema], // Array of repositories
    experienceLevel: { type: String, default: "" }, // New field
    expertise: { type: String, default: "" }, // New field
    techStack: { type: String, default: "" }, // New field
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema); // Use ES module export
