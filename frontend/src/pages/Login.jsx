import "../styles/Register.css";
import textLogoPic from "../assets/ONeon_Text.png";
import { useState } from "react";
import { loginUser } from "../components/ApiRequest.jsx";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await loginUser(formData);

            localStorage.setItem("access_token", result.access_token);
            
            navigate("/");

        } catch (error) {
            alert("Login failed: " + error.message);
        }
    };

    return (
        <div className="register-container">
            <img className="register-logo" src={textLogoPic} alt="O'Neon Text Logo"/>
            <form className="register-form" onSubmit={handleSubmit}>
                <input
                    className="form-row"
                    type="text"
                    name="username"
                    placeholder="Username"
                    onChange={handleChange}
                />
                <input
                    className="form-row"
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                />

                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;