import { useState, useEffect, useContext, useCallback, useRef } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { AuthContext } from "./AuthContext.jsx";
import { getConversation, sendMessage } from "./ApiRequest.jsx";
import "../styles/ChatWindow.css";
import guestPic from "../assets/Guest.png";

const ChatWindow = () => {
    const { recipient_pic, recipient_name } = useOutletContext();
    const { recipientId } = useParams();
    const { userId } = useContext(AuthContext);

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    const fetchMessages = useCallback(() => {
        getConversation(recipientId)
            .then(res => {
                setMessages(res.data);
                setError(null);
            })
            .catch(err => setError("Error loading messages: " + err.message));
    }, [recipientId]);

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [fetchMessages]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await sendMessage(recipientId, { content: newMessage });
            setNewMessage("");
            fetchMessages();
            setError(null);
        } catch (err) {
            setError("Error sending message: " + err.message);
        }
    };

    return (
        <div className="chat-window-inner">
            <div className="chat-header">
                <img
                    src={recipient_pic || guestPic}
                    alt={recipient_name}
                    className="recipient-avatar"
                />
                <span className="recipient-name">{recipient_name}</span>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="messages-window">
                {messages.map(msg => (
                    <div
                        key={msg.id}
                        className={`message ${msg.sender === userId ? "own" : "other"}`}
                    >
                        <strong>{msg.sender_name}</strong>: {msg.content}
                        <div className="timestamp">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="chat-form">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default ChatWindow;