import axios from "axios";

const apiRequest = axios.create({
    baseURL: "https://housin-backend.onrender.com/api",
    withCredentials: true,  // Ensure cookies (like JWT tokens) are sent with requests
});

// Axios Interceptor to handle token refresh
apiRequest.interceptors.response.use(
    (response) => response,  // If the response is successful, return it
    async (error) => {
        const originalRequest = error.config;

        // If the error is due to token expiry (403) and the request hasn't been retried yet
        if (error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh the access token
                const response = await axios.post(
                    '/refresh-token',  // Endpoint to refresh the token
                    {},                // Send a blank body
                    { withCredentials: true }  // Ensure the refresh token cookie is sent
                );

                const { accessToken } = response.data;  // Get the new access token

                // Store the new access token in the Authorization header for future requests
                apiRequest.defaults.headers['Authorization'] = `Bearer ${accessToken}`;

                // Retry the original request with the new access token
                return apiRequest(originalRequest);
            } catch (refreshError) {
                // If refreshing the token fails, redirect the user to the login page
                window.location.href = '/login';
            }
        }

        // If the error is not related to token expiry, reject it
        return Promise.reject(error);
    }
);

export default apiRequest;
