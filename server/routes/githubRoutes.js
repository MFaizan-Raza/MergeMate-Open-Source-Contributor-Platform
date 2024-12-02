import express from "express";
import fetch from "node-fetch";
import User from "../models/User.js";

const router = express.Router();

// Use environment variables for sensitive keys
const CLIENT_ID = "Ov23liGwHW4yIHxB6xSy";
const CLIENT_SECRET = "82d2bab987864f995424483826a0558bf9c6099e";

// Endpoint to get GitHub OAuth access token
router.get("/getAccessToken", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ error: "Code is required" });
  }

  const params = `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}`;

  try {
    const response = await fetch(
      `https://github.com/login/oauth/access_token?${params}`,
      {
        method: "POST",
        headers: { Accept: "application/json" },
      }
    );

    const data = await response.json();

    if (data.access_token) {
      res.json(data);
    } else {
      res.status(400).json({ error: "Failed to exchange code for token" });
    }
  } catch (error) {
    console.error("Error fetching access token:", error);
    res.status(500).send("Error fetching access token.");
  }
});

// Endpoint to fetch and save user data
router.post("/saveUserData", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Authorization token missing" });
  }

  try {
    // Fetch user data from GitHub API
    const userResponse = await fetch("https://api.github.com/user", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const userData = await userResponse.json();

    // Fetch user's repositories
    const reposResponse = await fetch("https://api.github.com/user/repos", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const repositories = await reposResponse.json();

    // Format repositories to save in the database
    const formattedRepos = repositories.map((repo) => ({
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      url: repo.html_url,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
    }));

    // Find or create a user in the database
    const user = await User.findOneAndUpdate(
      { githubId: userData.id },
      {
        githubId: userData.id,
        name: userData.name,
        email: userData.email,
        avatarUrl: userData.avatar_url,
        profileUrl: userData.html_url,
        repositories: formattedRepos,
      },
      { upsert: true, new: true }
    );

    res.json(user);
  } catch (error) {
    console.error("Error fetching user/repository data:", error);
    res.status(500).send("Error fetching user/repository data.");
  }
});

// Endpoint to get the authenticated user's profile
router.get("/getUserProfile", async (req, res) => {
  try {
    if (!req.user || !req.user.githubId) {
      return res.status(401).json({ error: "User not authenticated." });
    }

    const userId = req.user.githubId;

    const user = await User.findOne({ githubId: userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      name: user.name,
      avatarUrl: user.avatarUrl,
      profileUrl: user.profileUrl,
      repositories: user.repositories,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Error fetching user profile." });
  }
});

router.get("/getUserByGithubId/:githubId", async (req, res) => {
  const { githubId } = req.params;

  try {
    // Find the user by GitHub ID
    const user = await User.findOne({ githubId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user's profile data
    res.json({
      name: user.name,
      avatarUrl: user.avatarUrl,
      repositories: user.repositories,
      experienceLevel: user.experienceLevel,
      expertise: user.expertise,
      techStack: user.techStack,
      nickname: user.nickname,
    });
  } catch (error) {
    console.error("Error fetching user by GitHub ID:", error);
    res
      .status(500)
      .json({ error: "Error fetching user data. Please try again later." });
  }
});

router.put("/updateUserProfile/:githubId", async (req, res) => {
  const { githubId } = req.params;
  const { experienceLevel, expertise, techStack, nickname } = req.body;

  try {
    // Find the user by GitHub ID
    const user = await User.findOne({ githubId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields only if they are provided (non-empty)
    if (experienceLevel) user.experienceLevel = experienceLevel;
    if (expertise) user.expertise = expertise;
    if (techStack) user.techStack = techStack;
    if (nickname) user.name = nickname; // This updates the name field

    // Save the updated user document
    await user.save();

    return res.status(200).json({ message: "Profile updated successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// ye dobara bnaya name k liye bas
router.get("/reqUserGithubId/:githubId", async (req, res) => {
  const { githubId } = req.params;

  try {
    // Find the user by GitHub ID
    const user = await User.findOne({ githubId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user's profile data
    res.json({
      name: user.name,
    });
  } catch (error) {
    console.error("Error fetching user by GitHub ID:", error);
    res
      .status(500)
      .json({ error: "Error fetching user data. Please try again later." });
  }
});

export default router;
