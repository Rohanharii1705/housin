import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";
import video2 from "../../videos/video1.mp4"

function Register() {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.target);
        const username = formData.get("username");
        const email = formData.get("email");
        const password = formData.get("password");

        try {
            const res = await apiRequest.post("/auth/register", {
                username,
                email,
                password,
            });
            // Navigate to login on successful registration
            navigate("/login");
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message);
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    return (
        <div className="registerPage">
            <video className="backgroundVideo" autoPlay loop muted>
                <source src={video2}type="video/mp4" />
                Your browser does not support HTML5 video.
            </video>
            <div className="formContainer">
                <h1 className="formTitle">Create an Account</h1>
                <form onSubmit={handleSubmit}>
                    <div className="formGroup">
                        <input
                            name="username"
                            type="text"
                            placeholder="Username"
                            required
                            className="formInput"
                        />
                    </div>
                    <div className="formGroup">
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            required
                            className="formInput"
                        />
                    </div>
                    <div className="formGroup">
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            required
                            className="formInput"
                        />
                    </div>
                    <button type="submit" className="submitButton" disabled={isLoading}>
                        {isLoading ? "Loading..." : "Register"}
                    </button>
                    {error && <span className="errorMessage">{error}</span>}
                    <Link to="/login" className="loginLink">
                        Do you have an account?
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default Register;
