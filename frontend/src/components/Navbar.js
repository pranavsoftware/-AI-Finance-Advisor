import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuthStore } from '../context/authStore';
import { useNavigate } from 'react-router-dom';
export const Navbar = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return (_jsx("nav", { className: "bg-white shadow", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between h-16", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "text-2xl font-bold text-primary-600", children: "\uD83D\uDCB0" }), _jsx("span", { className: "ml-2 text-xl font-bold text-gray-900", children: "AI Finance Advisor" })] }), user && (_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "text-sm", children: [_jsx("div", { className: "text-gray-600", children: "Welcome" }), _jsx("div", { className: "font-semibold text-gray-900", children: user.name })] }), _jsx("button", { onClick: handleLogout, className: "px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors", children: "Logout" })] }))] }) }) }));
};
