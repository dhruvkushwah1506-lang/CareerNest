import { setPublicCompanies, setLoading, setPagination } from "@/redux/companySlice";
import api from "@/lib/axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetPublicCompanies = () => {
    const dispatch = useDispatch();
    const { currentPage } = useSelector(store => store.company);

    useEffect(() => {
        const fetchPublicCompanies = async () => {
            try {
                dispatch(setLoading(true));
                const res = await api.get(`/company/all?page=${currentPage}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setPublicCompanies(res.data.companies));
                    dispatch(setPagination({
                        currentPage: res.data.currentPage,
                        totalPages: res.data.totalPages,
                        totalCompanies: res.data.totalCompanies
                    }));
                }
            } catch (error) {
                console.log(error);
            } finally {
                dispatch(setLoading(false));
            }
        }
        fetchPublicCompanies();
    }, [dispatch, currentPage])
}

export default useGetPublicCompanies;
