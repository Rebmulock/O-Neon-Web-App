import "../styles/LoginRegister.css";
import textLogoPic from "../assets/ONeon_Text.png";
import { useState, useContext } from "react";
import { loginUser } from "../components/ApiRequest.jsx";
import { AuthContext } from "../components/AuthContext.jsx";

const Login = () => {
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [errorMsg, setErrorMsg] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        setErrorMsg("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await loginUser(formData);

            if (!result.ok) {
                setErrorMsg(result.data.detail || "Login failed");
            }

            localStorage.setItem("access", result.data.access);
            localStorage.setItem("role", result.data.role);

            login();

            window.location.href = "/";

        } catch (error) {
            setErrorMsg(error.message);
        }
    };

    return (
        <div className="register-wrapper">
            <div className="register-container">
                <img className="register-logo" src={textLogoPic} alt="O'Neon Text Logo"/>
                <form className="register-form" onSubmit={handleSubmit}>
                    <input
                        className="form-row"
                        type="text"
                        name="username"
                        placeholder="Username"
                        onChange={handleChange}
                        required
                    />
                    <input
                        className="form-row"
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                    />

                    {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;