import express from 'express';
import Project from '../models/Project.js';
import User from '../models/User.js';
import { v4 as uuidv4 } from 'uuid'; 

const router = express.Router();

// POST route to create a new project
router.post('/projects', async (req, res) => {
    const { name, description, deadline, githubId, userName, projectType } = req.body; // Assume githubId is passed in the request body

    try {
        // Create a new project
        const newProject = new Project({
            name,
            description,
            deadline,
            githubId,
            userName,
            projectId: uuidv4(),
            projectType
        });

        console.log(newProject);

        // Save the project to the database
        await newProject.save();

        // Send the created project as a response
        return res.status(201).json(newProject);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});


router.get("/getProject/:githubId", async (req, res) => {
    const { githubId } = req.params;
  
    console.log(githubId);
    try {
      const project = await Project.findOne({ githubId });
  
      if (!project) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.json({
        name: project.name,
        dec: project.description,
        deadline: project.deadline,
        id: project.githubId,
        userName: project.userName,
        projectType: project.projectType
      });
      
    } catch (error) {
      console.error("Error fetching user by GitHub ID:", error);
      res
        .status(500)
        .json({ error: "Error fetching user data. Please try again later." });
    }
  });

  router.get("/getProjectAll", async (req, res) => {
    try {
        // Fetch all projects from the collection
        const projects = await Project.find();

        // Check if there are any projects
        if (!projects || projects.length === 0) {
            return res.status(404).json({ error: "No projects found" });
        }

        // Map the projects to the desired format
        const formattedProjects = projects.map(project => ({
            name: project.name,
            dec: project.description,
            deadline: project.deadline,
            userName: project.userName,
            id: project.githubId,
            projectType: project.projectType
        }));

        // Send the formatted projects as a response
        res.json(formattedProjects);
        
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ error: "Error fetching projects. Please try again later." });
    }
});


export default router;