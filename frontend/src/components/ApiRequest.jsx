const API_BASE_URL = "http://localhost:8000/api";
const token = localStorage.getItem("access");

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
            return {
                status: response.status,
                ok: false,
                data: responseData || { message: "An error occurred" }
            };
        }

        return {
            status: response.status,
            ok: response.ok,
            data: responseData
        };

    } catch (error) {
        return {
            status: null,
            ok: false,
            data: { message: error.message || "Network error" }
        };
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
        "Authorization": `Bearer ${token}`,
    });

export const updateProfile = (profileData) => apiRequest(
    "/profile/edit/",
    "PUT",
    profileData,
    {
        "Authorization": `Bearer ${token}`,
    });

export const deleteAccount = () => apiRequest(
    "/profile/delete/",
    "DELETE",
    null,
    {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    });

export const createCourse = (formData) => apiRequest(
        "/courses/create/",
        "POST",
        formData,
        {
            "Authorization": `Bearer ${token}`,
    });

export const getCourses = () => apiRequest(
    "/courses/",
    "GET",
    null,
    {
            ...(token && { Authorization: `Bearer ${token}` }),
    });

export const deleteCourse = (courseId) => apiRequest(
    `/courses/${courseId}/`,
    "DELETE",
    null,
    {
        "Authorization": `Bearer ${token}`,
    });

export const getCourseById = (courseId) => apiRequest(
    `/courses/${courseId}/`,
    "GET",
    null,
    {
        ...(token && { Authorization: `Bearer ${token}` }),
    });

export const updateCourse = (courseId, formData) => apiRequest(
    `/courses/${courseId}/`,
    "PUT",
    formData,
    {
        "Authorization": `Bearer ${token}`,
    });

export const listUsers = () => apiRequest(
    "/users/list/",
    "GET",
    null,
    {
        "Authorization": `Bearer ${token}`,
    });

export const deleteUser = (userId) => apiRequest(
    `/users/${userId}/`,
    "DELETE",
    null,
    {
        "Authorization": `Bearer ${token}`,
    });

export const updateRole = (userId, data) => apiRequest(
    `/users/${userId}/`,
    "PUT",
    data,
    {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    });

export const listPendingInstructors = () => apiRequest(
    "/instructor-approvals/",
    "GET",
    null,
    {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    });

export const approveInstructor = (userId, data) => apiRequest(
    `/instructor-approvals/${userId}/`,
    "PUT",
    data,
    {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    });

export const listPendingCourses = () => apiRequest(
    "/course-approvals/",
    "GET",
    null,
    {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    });

export const approveCourse = (courseId, data) => apiRequest(
    `/course-approvals/${courseId}/`,
    "PUT",
    data,
    {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    });

export const enrollInCourse = (courseId) => apiRequest(
    `/courses/${courseId}/enroll/`,
    "POST",
    {
        course: Number(courseId),
    },
    {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    });

export const getConversation = (userId) => apiRequest(
    `/messages/${userId}/`,
    "GET",
    null,
    {
        "Authorization": `Bearer ${token}`,
    });

export const sendMessage = (recipientId, messageData) => apiRequest(
    `/messages/${recipientId}/`,
    "POST",
    messageData,
    {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    });

export const listActiveConversations = () => apiRequest(
    "/active-conversations/",
    "GET",
    null,
    {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    });

export const getUserProfileById = (userId) => apiRequest(
    `/profile/${userId}/`,
    "GET",
    null,
    {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    });

export const sendRating = (courseId, ratingData) => apiRequest(
    `/courses/${courseId}/rating/`,
    "PUT",
    ratingData,
    {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    });

export const markSlideViewed = (courseId, slideId) => apiRequest(
    `/courses/${courseId}/slides/${slideId}/viewed/`,
    "PUT",
    null,
    {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    });

export const getStudentPortfolio = () => apiRequest(
    `/portfolio/`,
    "GET",
    null,
    {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    });

export const updateEnrollmentComment = (enrollmentId, comment) => apiRequest(
    `/enrollments/${enrollmentId}/comment/`,
    "PATCH",
    { comment },
    {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    });

export const getStudentPortfolioByUserId = (userId) => apiRequest(
    `/portfolio/${userId}/`,
    "GET",
    null,
    {
        ...(token && { Authorization: `Bearer ${token}` }),
    });
