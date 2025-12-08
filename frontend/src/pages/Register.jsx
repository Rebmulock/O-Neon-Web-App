import "../styles/LoginRegister.css";
import textLogoPic from "../assets/ONeon_Text.png";
import { useState } from "react";
import { loginUser, registerUser } from "../components/ApiRequest.jsx";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        confirm_password: "",
        is_instructor: false,
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        setErrors(prev => ({
            ...prev,
            [name]: "",
        }));
    };

    const validate = () => {
        const newErrors = {};

        for (const key of ["first_name", "last_name", "username", "email", "password", "confirm_password"]) {
            if (!formData[key]) newErrors[key] = "This field is required";
        }

        if (formData.password && formData.confirm_password && formData.password !== formData.confirm_password) {
            newErrors.confirm_password = "Passwords do not match";
        }

        const usernameRegex = /^[a-zA-Z0-9_.-]+$/;
        if (formData.username && !usernameRegex.test(formData.username)) {
            newErrors.username = "Username can contain only letters, numbers, _, . or -";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const result = await registerUser(formData);

            if (result.ok) {
                const loginResult = await loginUser({
                    username: formData.username,
                    password: formData.password
                });

                localStorage.setItem("access", loginResult.data.access);
                navigate("/");
            }

        } catch (error) {
            alert("Registration failed: " + error.message);
        }
    };

    return (
        <div className="register-container">
            <img className="register-logo" src={textLogoPic} alt="O'Neon Text Logo"/>
            <form className="register-form" onSubmit={handleSubmit}>
                <input
                    className={`form-row ${errors.first_name ? "input-error" : ""}`}
                    type="text"
                    name="first_name"
                    placeholder="First name"
                    value={formData.first_name}
                    onChange={handleChange}
                />
                {errors.first_name && <p className="error-text">{errors.first_name}</p>}

                <input
                    className={`form-row ${errors.last_name ? "input-error" : ""}`}
                    type="text"
                    name="last_name"
                    placeholder="Last name"
                    value={formData.last_name}
                    onChange={handleChange}
                />
                {errors.last_name && <p className="error-text">{errors.last_name}</p>}

                <input
                    className={`form-row ${errors.username ? "input-error" : ""}`}
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                />
                {errors.username && <p className="error-text">{errors.username}</p>}

                <input
                    className={`form-row ${errors.email ? "input-error" : ""}`}
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />
                {errors.email && <p className="error-text">{errors.email}</p>}

                <input
                    className={`form-row ${errors.password ? "input-error" : ""}`}
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />
                {errors.password && <p className="error-text">{errors.password}</p>}

                <input
                    className={`form-row ${errors.confirm_password ? "input-error" : ""}`}
                    type="password"
                    name="confirm_password"
                    placeholder="Confirm Password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                />
                {errors.confirm_password && <p className="error-text">{errors.confirm_password}</p>}

                <label className="register-checkbox">
                    <input type="checkbox" name="is_instructor" checked={formData.is_instructor} onChange={handleChange}/>
                    Register as Instructor
                </label>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Register;
