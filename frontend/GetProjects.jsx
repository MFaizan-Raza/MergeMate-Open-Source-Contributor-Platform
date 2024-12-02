import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const GetProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [animation, setAnimation] = useState("");
  const [text, setText] = useState("");
  const [isRemoving, setIsRemoving] = useState(false);

  const fullText =
    "Our platform makes it easy for developers to find open-source projects that align with their skills and interests, simplifying the contribution process.";

  useEffect(() => {
    let timeout;
    if (!isRemoving) {
      // Typing animation
      if (text.length < fullText.length) {
        timeout = setTimeout(() => setText(fullText.slice(0, text.length + 1)), 50);
      } else {
        // Start removal after delay
        setTimeout(() => setIsRemoving(true), 2000);
      }
    } else {
      // Removing animation
      if (text.length > 0) {
        timeout = setTimeout(() => setText(fullText.slice(0, text.length - 1)), 50);
      } else {
        // Restart animation
        setIsRemoving(false);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, isRemoving, fullText]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/getProjectAll`);
        setProjects(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.error : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  const handleAction = (direction) => {
    setAnimation(direction === "left" ? "animate-swipeLeft" : "animate-swipeRight");

    setTimeout(() => {
      setAnimation("");
      setCurrentProjectIndex((prevIndex) => prevIndex + 1);
    }, 500); // Match animation duration
  };

  const requestProject = async (project) => {
    try {
      const githubId = localStorage.getItem("githubId");

      const requestData = {
        name: project.name,
        githubId: project.id,
        userName: project.userName,
        reqGithubId: githubId,
      };

      const response = await axios.post(
        "http://localhost:5000/req/reqProject",
        requestData
      );

      if (response.status === 200) {
        Swal.fire("Success!", "Project request sent successfully.", "success");
      } else {
        Swal.fire("Error", "Failed to send project request.", "error");
      }
    } catch (error) {
      console.error("Error requesting project:", error);
      Swal.fire("Error", "There was an error sending the project request.", "error");
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">Error: {error}</div>;

  const currentProject = projects[currentProjectIndex];

  if (!currentProject) {
    return (
      <div className="text-center mt-20 text-gray-800">
        <h2 className="text-2xl font-bold">No more projects available.</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Projects Available</h1>
        <p className="text-gray-600">{text}</p>
      </div>

      {/* Project Card */}
      <div className="flex justify-center">
        <div
          className={`max-w-sm w-full bg-white shadow-lg rounded-lg p-6 transform transition-transform duration-500 ${animation}`}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">{currentProject.name}</h2>
          <p className="text-gray-600 mb-2">
            <strong>User Name:</strong> {currentProject.userName}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Project Type:</strong> {currentProject.projectType}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Deadline:</strong> {formatDate(currentProject.deadline)}
          </p>
          <p className="text-gray-600 mb-8">
            <strong>Description:</strong> {currentProject.dec}
          </p>

          <div className="flex space-x-2">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition mr-36"
              onClick={() => handleAction("left")}
            >
              Ignore
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
              onClick={() => {
                handleAction("right");
                requestProject(currentProject);
              }}
            >
              Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetProjects;
