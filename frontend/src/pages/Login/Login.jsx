import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Login.css';
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import video1 from "./../../videos/signin.mp4";

function Login() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const res = await apiRequest.post("/auth/login", {
        username,
        password,
      });
      
      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(res.data));
      updateUser(res.data);
      
      // Check if user is admin and redirect accordingly
      if (res.data.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <video autoPlay muted loop className="video-background">
        <source src={video1} type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>
      
      <div className="login-container">
        <h1>Welcome Back</h1>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Login"}
          </button>
          {error && <div className="error-message">{error}</div>}
        </form>
        
        <span>
          Don't have an account? <Link to="/register">Register</Link>
        </span>
      </div>
    </div>
  );
}

export default Login;