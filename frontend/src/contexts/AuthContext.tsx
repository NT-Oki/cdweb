// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URLS, { apiRequest } from '../config/api';

type User = { email: string; userId: string; avatar: string; name: string; role: 'user' | 'admin' };

type AuthContextType = {
    user: User | null;
    login: (userData: User, token: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        console.log('Stored user:', storedUser);
        console.log('Stored token:', token);

        if (storedUser && token) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error('Lỗi khi parse user:', error);
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = (userData: User, token: string) => {
        console.log('Login called with:', userData, token);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
    };

    const logout = async () => {
        console.log('Logout called');
        try {
            await apiRequest(API_URLS.AUTH.logout, { method: 'POST' });
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Logout error:', error);
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            navigate('/login', { replace: true });
        }
    };

    if (loading) {
        return <div>Đang tải...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};