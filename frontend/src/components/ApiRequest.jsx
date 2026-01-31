const API_BASE_URL = "http://localhost:8000/api";

async function apiRequest(endpoint, method = "GET", data = null, headers = {}) {
    const isFormData = data instanceof FormData;

    const config = {
        method,
        headers: {
            ...headers
        },
    };

        if (data) {
            config.body = isFormData ? data : JSON.stringify(data);
        }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const contentType = response.headers.get("content-type");
        let responseData;

        if (contentType && contentType.includes("application/json")) {
            responseData = await response.json();
        } else {
            responseData = await response.text();
        }

        if (!response.ok) {
            throw responseData;
        }

        return {
            status: response.status,
            ok: response.ok,
            data: responseData
        };

    } catch (error) {
        console.error(`API request failed [${method} ${endpoint}]`, error);

        throw error;
    }
}

export const registerUser = (userData) => apiRequest(
    "/register/",
    "POST",
    userData,
    {
        "Content-Type": "application/json",
    });

export const loginUser = (credentials) => apiRequest(
    "/login/",
    "POST",
    credentials,
    {
        "Content-Type": "application/json",
    });

export const getProfile = () => apiRequest(
    "/profile/",
    "GET",
    null,
    {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("access")}`,
    });

export const updateProfile = (profileData) => apiRequest(
    "/profile/edit/",
    "PUT",
    profileData,
    {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("access")}`,
    });

export const deleteAccount = () => apiRequest(
    "/profile/delete/",
    "DELETE",
    null,
    {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("access")}`,
    });

export const createCourse = (formData) => apiRequest(
        "/courses/create/",
        "POST",
        formData,
        {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
    });

export const getCourses = () => apiRequest(
    "/courses/",
    "GET",
    null,
    {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
    });

export const deleteCourse = (courseId) => apiRequest(
    `/courses/${courseId}/`,
    "DELETE",
    null,
    {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
    });

export const getCourseById = (courseId) => apiRequest(
    `/courses/${courseId}/`,
    "GET",
    null,
    {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
    });

export const updateCourse = (courseId, formData) => apiRequest(
    `/courses/${courseId}/`,
    "PUT",
    formData,
    {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
    });