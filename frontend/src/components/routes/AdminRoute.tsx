import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminRoute = () => {
    const { user } = useAuth();

    console.log('User trong AdminRoute:', user);

    if (!user || user.role !== 'admin') {
        console.log('Chuyển hướng về /login vì user là null hoặc không phải admin:', user?.role);
        return <Navigate to="/login" replace />;
    }

    console.log('Render Outlet cho admin');
    return <Outlet />;
};

export default AdminRoute;