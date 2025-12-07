const API_BASE_URL = "http://localhost:8000/api";

async function apiRequest(endpoint, method = "GET", data = null, headers = {}) {
    const config = {
        method,
        headers: {
            "Content-Type": "application/json",
            ...headers
        },
    };

    if (data) {
        config.body = JSON.stringify(data);
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
            throw new Error(JSON.stringify(responseData));
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

export const registerUser = (userData) => apiRequest("/register/", "POST", userData);
export const loginUser = (credentials) => apiRequest("/login/", "POST", credentials);
export const getProfile = () => apiRequest("/profile/", "GET");