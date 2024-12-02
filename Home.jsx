import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CLIENT_ID = "Ov23liGwHW4yIHxB6xSy";

function Home() {
  const navigate = useNavigate();

  // Corrected URL with template literals
  function loginWithGithub() {
    const githubAuthURL = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=http://localhost:5173&scope=read:user,repo&force_verify=true`;
    window.location.replace(githubAuthURL);
  }

  useEffect(() => {
    const fetchAccessToken = async () => {
      const querystring = window.location.search;
      const urlparams = new URLSearchParams(querystring);
      const codeParams = urlparams.get("code");

      if (codeParams) {
        try {
          // Corrected URL with template literals
          const { data } = await axios.get(
            `http://localhost:5000/getAccessToken?code=${codeParams}`
          );

          const token = data.access_token;

          const userResponse = await axios.post(
            "http://localhost:5000/saveUserData",
            { token }
          );

          const githubId = userResponse.data.githubId;

          // Store GitHub ID in local storage
          localStorage.setItem("githubId", githubId);

          // Navigate to the profile page
          navigate("/profile", { replace: true });
        } catch (err) {
          console.error("Error during OAuth process:", err);
        }
      }
    };

    fetchAccessToken();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="flex flex-col lg:flex-row items-center max-w-5xl w-full lg:max-w-screen-lg bg-white shadow-2xl rounded-3xl overflow-hidden transform scale-105 hover:scale-110 transition-transform duration-500 ease-in-out">
        {/* Left Side - Image */}
        <div className="flex justify-center items-center w-full lg:w-1/2 p-10 bg-gradient-to-r from-purple-200 to-purple-300">
          <img
            src="/image.jpg"
            alt="GitHub Illustration"
            className="w-64 h-auto object-cover rounded-full shadow-lg lg:w-72 xl:w-80"
          />
        </div>

        {/* Right Side - Text */}
        <div className="flex flex-col items-center lg:items-start w-full lg:w-1/2 p-10 space-y-8 text-center lg:text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Effortless GitHub Integration
          </h1>
          <p className="text-md md:text-lg text-gray-700">
            Manage your repositories and projects seamlessly with a single click.
          </p>
          <button
            onClick={loginWithGithub}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold rounded-lg shadow-xl hover:shadow-2xl hover:scale-110 transition-transform duration-300"
          >
            Log In With GitHub
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
