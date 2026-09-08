import { createSlice } from "@reduxjs/toolkit";

const companySlice = createSlice({
    name: "company",
    initialState: {
        singleCompany: null,
        adminCompanies: [],
        publicCompanies: [],
        searchCompanyByText: "",
        loading: false,
        currentPage: 1,
        totalPages: 1,
        totalCompanies: 0,
    },
    reducers: {
        setSingleCompany: (state, action) => {
            state.singleCompany = action.payload;
        },
        setAdminCompanies: (state, action) => {
            state.adminCompanies = action.payload;
        },
        setPublicCompanies: (state, action) => {
            state.publicCompanies = action.payload;
        },
        // For compatibility during transition, keeping setCompanies
        setCompanies: (state, action) => {
            state.adminCompanies = action.payload;
            state.publicCompanies = action.payload;
        },
        setSearchCompanyByText: (state, action) => {
            state.searchCompanyByText = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setPagination: (state, action) => {
            state.currentPage = action.payload.currentPage;
            state.totalPages = action.payload.totalPages;
            state.totalCompanies = action.payload.totalCompanies;
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        }
    }
});

export const { 
    setSingleCompany, 
    setAdminCompanies,
    setPublicCompanies,
    setCompanies, 
    setSearchCompanyByText, 
    setLoading, 
    setPagination, 
    setCurrentPage 
} = companySlice.actions;
export default companySlice.reducer;
