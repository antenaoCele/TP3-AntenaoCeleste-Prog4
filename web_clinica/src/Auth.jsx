import { createContext, useContext } from "react";
import { useState } from "react";


//contexto para compartir el estado de auth
const AuthContext = createContext(null)
export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(null);
    const [error, setError] = useState(null);

    const login = async (nombre, password) => {
        setError(null);
        try {
            const response = await fetch("http://localhost:4000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, password })
            });

            const session = await response.json();
            if (!response.ok && response.status === 401) {
                throw new Error(session.error);
            }

            setToken(session.token);
            return { sucess: true }
        } catch (error) {
            setError(error.message);
            return { sucess: false, error: error.message }
        }
    }

    const logout = () => {
        setToken(null)
        setError(null)
    }

    const fecthAuth = async (url, options = {}) => {
        if (!token) {
            throw new Error("No hay token");
        }

        return fetch(url, {
            ...options,
            headers: { ...options.headers, Authorization: `Bearer ${token}` },
        });


    };


    return (
        <AuthContext.Provider value={{ token, error, login, logout, fecthAuth }}>
            {children}
        </AuthContext.Provider>
    )

}