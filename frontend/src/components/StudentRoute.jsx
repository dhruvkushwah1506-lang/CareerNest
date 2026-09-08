import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const StudentRoute = ({ children }) => {
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'Student') {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <>
            {user && user.role === 'Student' ? children : null}
        </>
    )
};

export default StudentRoute;
