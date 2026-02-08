import { useState, useEffect, useContext, useMemo } from "react";
import { Outlet, Link, useNavigate  } from "react-router-dom";
import { AuthContext } from "../components/AuthContext.jsx";
import { listUsers, listActiveConversations } from "../components/ApiRequest.jsx";
import { useIsMobile } from "../hooks/useIsMobile.jsx";
import "../styles/Chats.css";
import guestPic from "../assets/Guest.png";

const normalizeString = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const Chats = () => {
    const { userId } = useContext(AuthContext);
    const [activeChats, setActiveChats] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [recipientPic, setRecipientPic] = useState("");
    const [recipientName, setRecipientName] = useState("");
    const [error, setError] = useState("");
    const isMobile = useIsMobile(1100);
    const [showChatContent, setShowChatContent] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        listUsers()
            .then(res => {
                const others = res.data
                    .filter(u => u.id !== userId)
                    .map(u => ({
                        ...u,
                        name: `${u.first_name} ${u.last_name}`
                    }));
                setAllUsers(others);
            })
            .catch(err => {
                const msg =
                    err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    Object.values(err?.response?.data || {})[0] ||
                    "Failed to load users";

                setError(msg);
            });

        listActiveConversations()
            .then(res => {
                const active = res.data
                    .map(conv => ({
                        id: conv.id,
                        name: conv.name,
                        profile_pic: conv.profile_pic
                    }));
                setActiveChats(active);
            })
            .catch(err => {
                const msg =
                    err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    Object.values(err?.response?.data || {})[0] ||
                    "Failed to load conversations";

                setError(msg);
            });

    }, [userId]);

    const searchResults = useMemo(() => {
        if (!searchTerm.trim()) return [];

        const normalizedSearch = normalizeString(searchTerm.toLowerCase());

        return allUsers.filter(user => {
            const normalizedName = normalizeString(user.name.toLowerCase());
            return normalizedName.includes(normalizedSearch);
        });
    }, [searchTerm, allUsers]);

    const openChat = (user) => {
        setRecipientName(user.name);
        setRecipientPic(user.profile_pic);

        if (isMobile) setShowChatContent(true);

        setSearchTerm("");
        navigate(`/chats/${user.id}`);
    };

    return (
        <div className="chats-container">
            {(!isMobile || !showChatContent) && (
                <div className="chats-sidebar">
                <h3>Conversations</h3>

                <div className="search-wrapper">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />

                    {searchTerm.trim() && searchResults.length > 0 && (
                        <ul className="search-dropdown">
                            {searchResults.map(user => (
                                <li key={user.id} className="search-item">
                                    <Link
                                        to={`/chats/${user.id}`}
                                        onClick={() => {
                                            setRecipientName(user.name);
                                            setRecipientPic(user.profile_pic);
                                            setSearchTerm("");
                                            openChat(user);
                                        }}
                                    >
                                        <img
                                            src={user.profile_pic || guestPic}
                                            alt="User picture"
                                            className="user-avatar"
                                        />
                                        <span className="user-name">{user.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <ul className="active-chats">
                    {activeChats.map(user => (
                        <Link
                            key={user.id}
                            className="chat-item"
                            to={`/chats/${user.id}`}
                            onClick={() => {
                                setRecipientName(user.name);
                                setRecipientPic(user.profile_pic);
                                openChat(user);
                            }}
                        >
                            <div className="chat-item-info" >
                                <img
                                    src={user.profile_pic || guestPic}
                                    alt={user.name}
                                    className="user-avatar"
                                />
                                <span className="user-name">{user.name}</span>
                            </div>
                        </Link>
                    ))}
                </ul>

                {error && <p style={{ color: "red" }}>{error}</p>}

            </div>
            )}

            {(!isMobile || showChatContent) && (
                <div className="chat-content">
                <Outlet context={{
                    recipient_pic: recipientPic,
                    recipient_name: recipientName,
                    setShowChatContent
                }}/>
            </div>
            )}
        </div>
    );
};

export default Chats;
