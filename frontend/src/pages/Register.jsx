import "../styles/Register.css";
import textLogoPic from "../assets/ONeon_Text.png";
import { useState } from "react";
import {loginUser, registerUser} from "../components/ApiRequest.jsx";
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (formData.confirm_password !== formData.password) {
                alert("Passwords do not match!");
                return;
            }

            const result = await registerUser(formData);

            if (result.ok) {
                const loginResult = loginUser({
                username: formData.username,
                password: formData.password
                });

                localStorage.setItem("access", loginResult.access);
            }

            navigate("/");

        } catch (error) {
            alert("Registration failed: " + error.message);
        }
    };

    return (
        <div className="register-container">
            <img className="register-logo" src={textLogoPic} alt="O'Neon Text Logo"/>
            <form className="register-form" onSubmit={handleSubmit}>
                <input className="form-row" type="text" name="first_name" placeholder="First name" onChange={handleChange}/>
                <input className="form-row" type="text" name="last_name" placeholder="Last name" onChange={handleChange}/>
                <input className="form-row" type="text" name="username" placeholder="Username" onChange={handleChange}/>
                <input className="form-row" type="email" name="email" placeholder="Email" onChange={handleChange}/>
                <input className="form-row" type="password" name="password" placeholder="Password" onChange={handleChange}/>
                <input className="form-row" type="password" name="confirm_password" placeholder="Confirm Password" onChange={handleChange}/>

                <label className="register-checkbox">
                    <input type="checkbox" name="isInstructor" onChange={handleChange}/>
                    Register as Instructor
                </label>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Register;
