import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name: "job",
    initialState: {
        allJobs: [],
        allAdminJobs: [],
        singleJob: null,
        searchJobByText: "",
        allAppliedJobs: [],
        searchedQuery: "",
        loading: false,
        currentPage: 1,
        totalPages: 1,
        totalJobs: 0,
    },
    reducers: {
        setAllJobs: (state, action) => {
            state.allJobs = action.payload;
        },
        setSingleJob: (state, action) => {
            state.singleJob = action.payload;
        },
        setAllAdminJobs: (state, action) => {
            state.allAdminJobs = action.payload;
        },
        setSearchJobByText: (state, action) => {
            state.searchJobByText = action.payload;
        },
        setAllAppliedJobs: (state, action) => {
            state.allAppliedJobs = action.payload;
        },
        setSearchedQuery: (state, action) => {
            state.searchedQuery = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setPagination: (state, action) => {
            state.currentPage = action.payload.currentPage;
            state.totalPages = action.payload.totalPages;
            state.totalJobs = action.payload.totalJobs;
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        }
    }
});

export const {
    setAllJobs,
    setSingleJob,
    setAllAdminJobs,
    setSearchJobByText,
    setAllAppliedJobs,
    setSearchedQuery,
    setLoading,
    setPagination,
    setCurrentPage
} = jobSlice.actions;

export default jobSlice.reducer;
