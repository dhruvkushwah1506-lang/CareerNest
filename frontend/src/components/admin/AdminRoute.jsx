import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'Recruiter') {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <>
            {user && user.role === 'Recruiter' ? children : null}
        </>
    )
};

export default AdminRoute;
