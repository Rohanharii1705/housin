import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";
export const singlePageLoader = async ({ params }) => {
    try {
        const res = await apiRequest.get(`/posts/${params.id}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching post:", error);
        return null; // Returning null to handle undefined data
    }
};
export const listPageLoader = async ({ request, params }) => {
    const query = request.url.split("?")[1];
    const postPromise =  apiRequest("/posts?" + query);
    return defer({
        postResponse:postPromise,
    });
  };
  export const ProfilePageLoader = async () => {
    const postPromise =  apiRequest("/users/profilePosts");
    const chatPromise=  apiRequest("/chats");
    return defer({
        postResponse:postPromise,
        chatResponse:chatPromise,
    });
  };
  