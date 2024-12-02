import { useEffect, useState } from "react";
import axios from "axios";

const AcceptedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMemberForm, setShowMemberForm] = useState(false); // State to toggle member form
  const [showFileForm, setShowFileForm] = useState(false); // State to toggle file form
  const [selectedProject, setSelectedProject] = useState(null); // Track selected project
  const [formData, setFormData] = useState({
    username: "",
    expertise: "",
  }); // Member form data
  const [file, setFile] = useState(null); // File upload data

  const githubId = localStorage.getItem("githubId"); // Get the GitHub ID from localStorage

  useEffect(() => {
    if (!githubId) {
      setError("GitHub ID not found in localStorage");
      setLoading(false);
      return;
    }

    // Fetch the accepted projects from the backend API
    axios
      .get(`http://localhost:5000/acc/allacceptedTodos/${githubId}`)
      .then((response) => {
        setProjects(response.data); // Set the fetched projects
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching projects");
        setLoading(false);
      });
  }, [githubId]); // Dependency on githubId

  const handleMemberButtonClick = (project) => {
    setSelectedProject(project); // Set the selected project
    setShowMemberForm(true); // Show the member form
  };

  const handleFileButtonClick = (project) => {
    setSelectedProject(project); // Set the selected project
    setShowFileForm(true); // Show the file upload form
  };

  const handleMemberFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleMemberFormSubmit = (e) => {
    e.preventDefault();
    console.log("Member Form submitted for project:", selectedProject);
    console.log("Form Data:", formData);

    setShowMemberForm(false); // Close the form after submission
    setFormData({ username: "", expertise: "" }); // Reset form data
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileFormSubmit = (e) => {
    e.preventDefault();
    console.log("File submitted for project:", selectedProject);
    console.log("Selected File:", file);

    // Here, you can send the file to the server using FormData
    // const formData = new FormData();
    // formData.append("file", file);
    // formData.append("projectId", selectedProject._id);
    // axios.post("http://localhost:5000/upload", formData);

    setShowFileForm(false); // Close the form after submission
    setFile(null); // Reset file
  };

  if (loading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-center mb-6">Accepted Projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <h5 className="text-xl font-semibold mb-2">
                Project Title: {project.name}
              </h5>
              <p className="text-gray-700 mb-2">
                Accepted by: {project.userName}
              </p>
              <button
                onClick={() => handleMemberButtonClick(project)}
                className="px-6 mb-2 py-2 text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300 ease-in-out hover:from-indigo-500 hover:to-purple-500"
              >
                Add Team Members
              </button>
              <button
                onClick={() => handleFileButtonClick(project)}
                className="px-6 py-2 text-white bg-gradient-to-r from-green-500 to-teal-500 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300 ease-in-out hover:from-teal-500 hover:to-emerald-500"
              >
                Submit File
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Popup for Adding Team Members */}
      {showMemberForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-xl font-semibold mb-4">Add Team Member</h3>
            <form onSubmit={handleMemberFormSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Member Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleMemberFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="expertise"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Member Expertise
                </label>
                <input
                  type="text"
                  id="expertise"
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleMemberFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowMemberForm(false)}
                  className="px-4 py-2 mr-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Popup for Submitting File */}
      {showFileForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-xl font-semibold mb-4">Submit File</h3>
            <form onSubmit={handleFileFormSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="file"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Choose File
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  className="w-full"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowFileForm(false)}
                  className="px-4 py-2 mr-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcceptedProjects;
