import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
    name: "application",
    initialState: {
        applicants: [],
        loading: false,
    },
    reducers: {
        setApplicants: (state, action) => {
            state.applicants = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
});

export const { setApplicants, setLoading } = applicationSlice.actions;

export default applicationSlice.reducer;
