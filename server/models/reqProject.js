import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    githubId: {
        type: String,
        trim: true
    },
    userName: {
        type: String,
        trim: true
    },
    reqGithubId:{
        type: String, 
        trim: true
    }
});

// Export the model as default
const Project = mongoose.model('reqProject', projectSchema);
export default Project;