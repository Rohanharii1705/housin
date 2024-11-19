import './SinglePage.css';
import Slider from '../../components/Slider/Slider';
import { useLoaderData, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { useState, useContext } from 'react';

function SinglePage() {
    const post = useLoaderData();
    const [saved, setSaved] = useState(post.isSaved);
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSave = async () => {
        if (!currentUser) {
            navigate("/login");
            return;
        }
        
        try {
            await apiRequest.post("/users/save", { postId: post.id });
            setSaved(!saved);
        } catch (err) {
            console.log(err);
        }
    };

    const handleSendMessage = async () => {
        if (!currentUser) {
            navigate("/login");
            return;
        }

        // Don't allow users to message themselves
        if (post.userId === currentUser.id) {
            console.log("Cannot send message to yourself");
            return;
        }

        try {
            // First check if a chat already exists
            const chatsResponse = await apiRequest.get("/chats");
            const existingChat = chatsResponse.data.find(chat => 
                chat.userIDs.includes(post.userId) && chat.userIDs.includes(currentUser.id)
            );

            let chatId;
            if (existingChat) {
                chatId = existingChat.id;
            } else {
                // Create a new chat with the post owner
                const newChatResponse = await apiRequest.post("/chats", {
                    receiverId: post.userId  // Send the post owner's ID
                });
                chatId = newChatResponse.data.id;
            }

            // Navigate to profile page with chat info
            navigate("/profile", { 
                state: { 
                    openChat: true, 
                    chatId: chatId,
                    receiver: {
                        id: post.userId,
                        username: post.user.username,
                        avatar: post.user.avatar
                    }
                } 
            });
        } catch (err) {
            console.error("Error initiating chat:", err);
        }
    };

    return (
        <div className="SinglePage">
            <div className="details">
                <div className="wrapper">
                    <Slider images={post.images} />
                    <div className="info">
                        <div className="top">
                            <div className="postinfo">
                                <h1>{post.title}</h1>
                                <div className="address">
                                    <img src="/address.png" alt="Address icon" />
                                    <span>{post.address}</span>
                                </div>
                                <div className="price">₹{post.price}</div>
                            </div>
                            <div className="userinfo">
                                <img src={post.user.avatar} alt="User avatar" />
                                <span>{post.user.username}</span>
                            </div>
                        </div>
                        <div className="bottom" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.postDetail.desc) }}>
                        </div>
                    </div>
                </div>
            </div>
            <div className="features">
                <div className="wrapper">
                    <p className="title">General</p>
                    <div className="listVertical">
                        <div className="feature">
                            <img src="/utility.png" alt="" />
                            <div className="featureText">
                                <span>Utilities</span>
                                {post.postDetail.utilities === "owner" ? (
                                    <p>Owner is responsible</p>
                                ) : (
                                    <p>Tenant is responsible</p>
                                )}
                            </div>
                        </div>
                        <div className="feature">
                            <img src="/pet.png" alt="" />
                            <div className="featureText">
                                <span>Pet Policy</span>
                                {post.postDetail.pet === "allowed" ? (
                                    <p>Pets Allowed</p>
                                ) : (
                                    <p>Pets Not Allowed</p>
                                )}
                            </div>
                        </div>
                        <div className="feature">
                            <img src="/fee.png" alt="" />
                            <div className="featureText">
                                <span>Income Policy</span>
                                <p>{post.postDetail.income}</p>
                            </div>
                        </div>
                    </div>
                    <p className="title">Sizes</p>
                    <div className="sizes">
                        <div className="size">
                            <img src="/size.png" alt="" />
                            <span>{post.postDetail.size} sqft</span>
                        </div>
                        <div className="size">
                            <img src="/bed.png" alt="" />
                            <span>{post.bedroom} beds</span>
                        </div>
                        <div className="size">
                            <img src="/bath.png" alt="" />
                            <span>{post.bathroom} bathroom</span>
                        </div>
                    </div>
                    <p className="title">Nearby Places</p>
                    <div className="feature">
                        <img src="/school.png" alt="" />
                        <div className="featureText">
                            <span>School</span>
                            <p>{post.postDetail.school > 999 ? post.postDetail.school / 1000 + "km" : post.postDetail.school + "m"} away</p>
                        </div>
                    </div>
                    <div className="feature">
                        <img src="/bus.png" alt="" />
                        <div className="featureText">
                            <span>Bus stop</span>
                            <p>{post.postDetail.bus} m away</p>
                        </div>
                    </div>
                    <div className="feature">
                        <img src="/hotel.png" alt="" />
                        <div className="featureText">
                            <span>Restaurant</span>
                            <p>{post.postDetail.restaurant} m away</p>
                        </div>
                    </div>
                    <p className="title">Actions</p>
                    <div className="buttons">
                        <button onClick={handleSendMessage}>
                            <img src="/chat.png" alt="" />
                            Send a Message
                        </button>
                        <button onClick={handleSave} style={{ backgroundColor: saved ? "red" : " #007bff" }}>
                            <img src="/save.png" alt="" />
                            {saved ? "Place Saved" : "Save the Place"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SinglePage;