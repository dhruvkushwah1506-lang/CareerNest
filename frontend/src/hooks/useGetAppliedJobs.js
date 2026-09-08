import { setAllAppliedJobs, setLoading } from "@/redux/jobSlice";
import api from "@/lib/axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAppliedJobs = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            try {
                dispatch(setLoading(true));
                const res = await api.get("/application/getjobs", { withCredentials: true });
                if (res.data.success) {
                    dispatch(setAllAppliedJobs(res.data.applications));
                }
            } catch (error) {
                console.log(error);
            } finally {
                dispatch(setLoading(false));
            }
        }
        fetchAppliedJobs();
    }, [dispatch])
};

export default useGetAppliedJobs;
