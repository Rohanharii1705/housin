import { format } from "timeago.js";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import './Chat.css'; // Import the CSS file

function Chat({ chats: initialChats }) {
  const [chat, setChat] = useState(null);
  const [chats, setChats] = useState(initialChats);
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const messageEndRef = useRef();
  const decreaseNotifications = useNotificationStore((state) => state.decrease);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await apiRequest(`/chats/${id}`);
      if (!res.data.seenBy.includes(currentUser.id)) {
        decreaseNotifications();
      }
      setChat({ ...res.data, receiver });
    } catch (err) {
      console.error("Error opening chat:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get("text").trim();

    if (!text) return;

    try {
      const res = await apiRequest.post(`/messages/${chat.id}`, { text });
      const newMessage = {
        ...res.data,
        chatId: chat.id
      };

      setChat(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage]
      }));

      setChats(prevChats =>
        prevChats.map(c => {
          if (c.id === chat.id) {
            return {
              ...c,
              lastMessage: text,
              updatedAt: new Date().toISOString()
            };
          }
          return c;
        })
      );

      e.target.reset();
      socket.emit("sendMessage", {
        receiverId: chat.receiver.id,
        data: newMessage
      });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  useEffect(() => {
    const readChat = async () => {
      if (chat) {
        try {
          await apiRequest.put(`/chats/read/${chat.id}`);
        } catch (err) {
          console.error("Error marking chat as read:", err);
        }
      }
    };

    if (chat && socket) {
      const handleNewMessage = (data) => {
        if (chat.id === data.chatId) {
          setChat(prev => ({
            ...prev,
            messages: [...prev.messages, data]
          }));
          readChat();
        }

        setChats(prevChats =>
          prevChats.map(c => {
            if (c.id === data.chatId) {
              return {
                ...c,
                lastMessage: data.text,
                updatedAt: data.createdAt
              };
            }
            return c;
          })
        );
      };

      socket.on("getMessage", handleNewMessage);

      return () => {
        socket.off("getMessage", handleNewMessage);
      };
    }
  }, [socket, chat?.id]);

  return (
    <div className="chat">
      <div className="messages">
        <h1 className="messages-title">Messages</h1>
        {chats?.map((c) => (
          <div
            className={`message ${!c.seenBy.includes(currentUser.id) && chat?.id !== c.id ? 'unread' : ''}`}
            key={c.id}
            onClick={() => handleOpenChat(c.id, c.receiver)}
          >
            <div className="message-header">
              <img 
                className="message-avatar"
                src={c.receiver.avatar || "/60111.jpg"} 
                alt={`${c.receiver.username}'s avatar`} 
              />
              <span className="message-username">{c.receiver.username}</span>
            </div>
            <div className="message-content">
              <p className="message-text">{c.lastMessage}</p>
              <span className="message-time">{format(c.updatedAt)}</span>
            </div>
          </div>
        ))}
      </div>

      {chat && (
        <div className="chatBox">
          <div className="chatBox-top">
            <div className="chatBox-user">
              <img 
                src={chat.receiver.avatar || "/60111.jpg"} 
                alt={`${chat.receiver.username}'s avatar`} 
                className="chatBox-avatar"
              />
              <span className="chatBox-username">{chat.receiver.username}</span>
            </div>
            <span 
              className="chatBox-close" 
              onClick={() => setChat(null)}
            >
              &times;
            </span>
          </div>

          <div className="chatBox-center">
            {chat.messages.map((message) => (
              <div
                className={`chatMessage ${message.userId === currentUser.id ? 'sent' : 'received'}`}
                key={message.id}
              >
                <div className="chatMessage-header">
                  <img 
                    className="chatMessage-avatar" 
                    src={message.userId === currentUser.id ? currentUser.avatar : chat.receiver.avatar || "/60111.jpg"} 
                    alt={`${message.userId === currentUser.id ? 'You' : chat.receiver.username}'s avatar`} 
                  />
                  <span className="chatMessage-username">
                    {message.userId === currentUser.id ? 'You' : chat.receiver.username}
                  </span>
                </div>
                <p className="chatMessage-text">{message.text}</p>
                <span className="chatMessage-time">{format(message.createdAt)}</span>
              </div>
            ))}
            <div ref={messageEndRef}></div>
          </div>

          <form onSubmit={handleSubmit} className="chatBox-bottom">
            <textarea 
              name="text" 
              className="chatBox-input" 
              placeholder="Type a message..." 
              required
            />
            <button type="submit" className="chatBox-sendButton">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
