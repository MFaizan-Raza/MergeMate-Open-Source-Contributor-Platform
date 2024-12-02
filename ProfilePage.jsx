
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
// import GetProjects from "./GetProjects";

function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    experienceLevel: "",
    expertise: "",
    techStack: "",
    nickname: "",
  });
  const navigate = useNavigate();

  // Fetch user profile data when the component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      const githubId = localStorage.getItem("githubId");

      if (!githubId) {
        console.error("GitHub ID not found. Redirecting to home...");
        navigate("/");
        return;
      }

      try {
        const { data } = await axios.get(
          `http://localhost:5000/getUserByGithubId/${githubId}`
        );
        setUserData(data); // Set the fetched user data
        setFormData({
          experienceLevel: data.experienceLevel || "",
          expertise: data.expertise || "",
          techStack: data.techStack || "",
          nickname: data.nickname || "",
        }); // Prepopulate the form data
      } catch (err) {
        console.error("Error fetching profile data:", err);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("githubId"); // Remove GitHub ID from localStorage
    navigate("/"); // Navigate to the home page
  };

  const githubId = localStorage.getItem("githubId");
  const handleProfileUpdate = async () => {
    // Send the formData to update the profile
    try {
      await axios.put(
        `http://localhost:5000/updateUserProfile/${githubId}`,
        formData
      );
      alert("Profile updated successfully!");

      // Fetch the updated data after successful update
      const { data } = await axios.get(
        `http://localhost:5000/getUserByGithubId/${githubId}`
      );
      setUserData(data); // Update state with the new data
      setFormData({
        experienceLevel: data.experienceLevel || "",
        expertise: data.expertise || "",
        techStack: data.techStack || "",
        nickname: data.nickname || "",
      }); // Update formData with new values
      setIsModalOpen(false); // Close the modal
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }



  const handleAddProject = async () => {
    try {
      // Show the Swal popup
      const result = await Swal.fire({
        title: 'Add New Project',
        html: ` 
                <input id="projectName" class="swal2-input" placeholder="Project Name" required>
                <textarea id="description" class="swal2-textarea" placeholder="Project Description" required></textarea>
                <input id="deadline" class="swal2-input" type="date" required>
                <select id="projectType" class="swal2-select" required>
                    <option value="">Select Project Type</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Full Stack">Full Stack</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Mobile Application">Mobile Application</option>
                </select>
                <input id="githubId" class="swal2-input" value="${userData ? userData.githubId : ''}" disabled hidden>
            `,
        focusConfirm: false,
        preConfirm: () => {
          const projectName = document.getElementById('projectName').value;
          const description = document.getElementById('description').value;
          const deadline = document.getElementById('deadline').value;
          const projectType = document.getElementById('projectType').value;

          // Validate input
          if (!projectName || !description || !deadline || !projectType) {
            Swal.showValidationMessage('Please fill in all fields');
            return false;
          }

          // Return the project data for further processing
          return { projectName, description, deadline, projectType };
        }
      });

      if (result.isConfirmed) {
        const { projectName, description, deadline, projectType } = result.value;

        // Retrieve githubId from localStorage or wherever it's stored
        const githubId = localStorage.getItem("githubId");

        // Fetch user data based on githubId
        const { data } = await axios.get(`http://localhost:5000/getUserByGithubId/${githubId}`);
        setUserData(data); // Update state with the new data

        // Ensure userData is available before using it
        const userName = data.name || ""; // Access nickname after state update
        console.log("userName", userName); // Log to check if nickname is available

        // Generate a unique projectId (you can customize this logic)
        const projectId = `${githubId}-${Date.now()}`; // Example: "githubId-1634567890123"

        // Prepare the project data
        const projectData = {
          name: projectName,
          description,
          deadline,
          userName, // Correctly accessed nickname
          githubId: githubId, // Ensure you are using the correct githubId
          projectId, // Unique project ID
          projectType // Project type from the select input
        };

        console.log(projectData);

        // Send the project data to the backend using async/await
        await axios.post("http://localhost:5000/api/projects", projectData);
        Swal.fire('Success!', 'Project added successfully.', 'success');
      }
    } catch (error) {
      console.error('Error adding project:', error);
      Swal.fire('Error', 'There was an error adding the project.', 'error');
    }
  };

  const seeproject = () => {
    navigate('/projects')
  }


  return (
    <div className="container mx-auto p-8 bg-gradient-to-r from-blue-400 via-white to-blue-200 min-h-screen font-sans">
      {/* Welcome Back Message */}
      <div className="mb-8">
        <h1 className="text-4xl font-semibold text-gray-800">
          <span className="inline-block overflow-hidden whitespace-nowrap border-r-4 border-gray-800 pr-2 animate-typewriter">
            Welcome back!
          </span>
        </h1>
      </div>

      {/* Button Section */}
      <div className="flex flex-wrap justify-end mb-6 gap-4">
        <button
          onClick={handleAddProject}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-lg hover:scale-105 hover:rotate-1 transition-transform duration-300"
        >
          Add Project
        </button>
        <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-lg hover:scale-105 hover:rotate-1 transition-transform duration-300">
          Todo's
        </button>
        <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-lg hover:scale-105 hover:rotate-1 transition-transform duration-300">
          See Requests
        </button>
        <button
          onClick={seeproject}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-lg hover:scale-105 hover:rotate-1 transition-transform duration-300"
        >
          See Available Projects
        </button>
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow-lg hover:scale-105 hover:rotate-1 transition-transform duration-300"
        >
          Logout
        </button>
      </div>

      {/* Profile Section */}
      <div className="flex flex-wrap items-center space-x-6 mb-8 bg-gradient-to-r from-gray-50 to-white p-6 rounded-lg shadow-lg relative">
        <img
          src={userData.avatarUrl}
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-indigo-300 shadow-md hover:scale-110 transition-transform duration-300"
        />
        <div>
          <h2 className="text-4xl font-semibold text-gray-800">{userData.name}</h2>
          <a
            href={userData.profileUrl}
            className="text-indigo-600 hover:underline hover:text-indigo-800 transition-colors duration-200"
          >
            View Profile
          </a>
        </div>

        {/* Update Button Positioned */}
        <button
          onClick={handleModalToggle}
          className="absolute top-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:scale-105 hover:bg-blue-700 transition-transform duration-300"
        >
          Update Profile
        </button>
      </div>


      {/* Experience, Expertise, and Tech Stack */}
      <div className="mb-6 text-lg font-semibold text-gray-800 flex flex-wrap gap-4">
        {userData.experienceLevel && (
          <span className="px-4 py-2 bg-blue-200 text-blue-800 rounded-full shadow-lg">
            {userData.experienceLevel}
          </span>
        )}
        {userData.expertise && (
          <span className="px-4 py-2 bg-green-200 text-green-800 rounded-full shadow-lg">
            {userData.expertise}
          </span>
        )}
        {userData.techStack && (
          <span className="px-4 py-2 bg-yellow-200 text-yellow-800 rounded-full shadow-lg">
            {userData.techStack}
          </span>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 animate-fade-in">
            <h3 className="text-2xl font-semibold mb-4">Update Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Experience Level</label>
                <input
                  type="text"
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 shadow-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Expertise</label>
                <input
                  type="text"
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 shadow-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Tech Stack</label>
                <input
                  type="text"
                  name="techStack"
                  value={formData.techStack}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 shadow-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 shadow-md"
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleProfileUpdate}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg shadow-lg hover:scale-105 hover:bg-blue-700 transition-transform duration-300"
                >
                  Update
                </button>
                <button
                  onClick={handleModalToggle}
                  className="ml-4 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Repositories */}
      <div>
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Repositories</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userData.repositories.map((repo) => (
            <li
              key={repo.full_name}
              className="bg-white border p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 hover:scale-105"
            >
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl font-semibold text-blue-600 hover:underline"
              >
                {repo.name}
              </a>
              <p className="mt-2 text-gray-700">{repo.description}</p>
              <div className="mt-2 text-sm text-gray-600">
                <p>Language: {repo.language || "N/A"}</p>
                <p>Stars: {repo.stars || 0} | Forks: {repo.forks || 0}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );



}

export default ProfilePage;

