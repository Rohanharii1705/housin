// Navbar.js
import { useState, useContext, useEffect } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, updateUser } = useContext(AuthContext);
  const fetchNotifications = useNotificationStore((state) => state.fetch);
  const notificationCount = useNotificationStore((state) => state.number);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && !currentUser.isAdmin) {
      fetchNotifications();
    }
  }, [currentUser, fetchNotifications]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser && currentUser) {
      updateUser(null);
    }
  }, [currentUser, updateUser]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest(".navbar-menu") && !event.target.closest(".menu-toggle")) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    updateUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {!currentUser?.isAdmin && (
          <>
            <Link to="/" className="navbar-logo">
              <img src="/logo.png" alt="Logo" className="logo-img" />
              <span className="logo-text">Housin</span>
            </Link>
            <Link to="/" className="navbar-link">Home</Link>
            <Link to="/list" className="navbar-link">List</Link>
          </>
        )}
      </div>
      <div className="navbar-right">
        {currentUser ? (
          <div className="user-profile">
            {!currentUser.isAdmin && (
              <img src={currentUser.avatar || "/60111.jpg"} alt="User" className="user-avatar" />
            )}
            <span className="user-name">{currentUser.username}</span>
            {!currentUser.isAdmin ? (
              <Link to="/profile" className="user-profile-link">
                {notificationCount > 0 && <div className="notification-badge">{notificationCount}</div>}
                <span>(Profile)</span>
              </Link>
            ) : (
              <button onClick={handleLogout} className="logout-button">Logout</button>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="login-link">Sign in</Link>
            <Link to="/register" className="signup-link">Sign up</Link>
          </>
        )}
        <div className="menu-toggle" onClick={() => setMenuOpen((prev) => !prev)}>
          <img src="/menu.png" alt="Menu" className="menu-icon" />
        </div>
        <div className={`navbar-menu ${menuOpen ? "active" : ""}`}>
          {!currentUser?.isAdmin && (
            <>
              <Link to="/" className="navbar-menu-link">Home</Link>
              <Link to="/list" className="navbar-menu-link">List</Link>
            </>
          )}
          {!currentUser && (
            <>
              <Link to="/login" className="navbar-menu-link">Sign in</Link>
              <Link to="/register" className="navbar-menu-link">Sign up</Link>
            </>
          )}
          {currentUser && (
            <button onClick={handleLogout} className="logout-mobile">Logout</button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
