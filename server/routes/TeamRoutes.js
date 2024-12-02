import express from "express"

const router = express.Router();
import Team from "../models/Team.js"

// Create a new team
router.post("/team", async (req, res) => {
  try {
    const { username, expertise } = req.body;

    // Validate data
    if (!username || !expertise) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // Create a new team member (assuming you have a schema for this)
    const teamMember = new Team({ username, expertise });

    await teamMember.save();
    res.status(201).json({ message: "Team member added successfully", teamMember });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
