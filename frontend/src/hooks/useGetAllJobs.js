import { setAllJobs, setLoading, setPagination } from "@/redux/jobSlice";
import api from "@/lib/axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { searchedQuery, currentPage } = useSelector(store => store.job);

    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                dispatch(setLoading(true));
                const res = await api.get(`/job/get?keyword=${searchedQuery}&page=${currentPage}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setAllJobs(res.data.jobs));
                    dispatch(setPagination({
                        currentPage: res.data.currentPage,
                        totalPages: res.data.totalPages,
                        totalJobs: res.data.totalJobs
                    }));
                }
            } catch (error) {
                console.log(error);
            } finally {
                dispatch(setLoading(false));
            }
        }
        fetchAllJobs();
    }, [dispatch, searchedQuery, currentPage])
}

export default useGetAllJobs;
