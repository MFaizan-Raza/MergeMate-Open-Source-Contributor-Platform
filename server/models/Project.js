import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    deadline: {
        type: Date,
        required: true
    },
    githubId: {
        type: String,
        trim: true
    },
    userName: {
        type: String,
        trim: true
    },
    projectId: {
        type: String, // or Number, depending on your use case
        unique: true, // Ensure this field is unique
        required: true
    },
    projectType: {
        type: String,
        required: true,
        enum: ['Frontend', 'Backend', 'Data Science', 'Full Stack','Machine Learning', 'Mobile Application'] 
    }
});

// Export the model as default
const Project = mongoose.model('Project', projectSchema);
export default Project;