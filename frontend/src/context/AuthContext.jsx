import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Failed to parse user data:", error);
            return null;
        }
    });

    const updateUser = (data) => {
        setCurrentUser(data);
        if (data === null) {
            localStorage.removeItem("user");
        } else {
            localStorage.setItem("user", JSON.stringify(data));
        }
    };

    // Sync localStorage with state
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === "user") {
                if (!e.newValue) {
                    setCurrentUser(null);
                } else {
                    try {
                        setCurrentUser(JSON.parse(e.newValue));
                    } catch (error) {
                        console.error("Failed to parse user data:", error);
                        setCurrentUser(null);
                    }
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};