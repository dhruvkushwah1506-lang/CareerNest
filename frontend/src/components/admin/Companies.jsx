import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '@/lib/axios';
import { setSearchCompanyByText, setCurrentPage } from '@/redux/companySlice';
import { Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import useGetAllCompanies from '@/hooks/useGetAllCompanies';

const Companies = () => {
    useGetAllCompanies();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { adminCompanies, loading, currentPage, totalPages, searchCompanyByText } = useSelector(store => store.company);
    const [filterText, setFilterText] = useState(searchCompanyByText);

    // Cleanup search and page on unmount
    useEffect(() => {
        return () => {
            dispatch(setSearchCompanyByText(""));
            dispatch(setCurrentPage(1));
        };
    }, [dispatch]);

    // Debounce the search input
    useEffect(() => {
        const handler = setTimeout(() => {
            if (filterText !== searchCompanyByText) {
                dispatch(setSearchCompanyByText(filterText));
                dispatch(setCurrentPage(1));
            }
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [filterText, dispatch, searchCompanyByText]);

    // Defensive check to ensure adminCompanies is always an array
    const filteredCompanies = Array.isArray(adminCompanies) ? adminCompanies : [];

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />
            <main className="pt-32 px-6 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
                            Your Companies
                        </h1>
                        <p className="text-muted-foreground mt-2 font-light">
                            Manage your organizations and view active job postings.
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Filter companies..." 
                                value={filterText}
                                onChange={(e) => setFilterText(e.target.value)}
                                className="pl-9 h-11 bg-muted/30 border-transparent rounded-full hover:bg-muted/50 focus:bg-background transition-all"
                            />
                        </div>
                        <Button 
                            onClick={() => navigate("/admin/companies/create")}
                            className="h-11 px-6 rounded-full shadow-sm"
                        >
                            New Company
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="h-64 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
                    </div>
                ) : filteredCompanies.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center border border-dashed border-border rounded-xl bg-muted/5">
                        <p className="text-muted-foreground font-light mb-4">
                            {searchCompanyByText ? "No companies found matching your search." : "You haven't registered any companies yet."}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCompanies.map((company) => (
                                <div 
                                    key={company._id} 
                                    onClick={() => navigate(`/admin/companies/${company._id}`)}
                                    className="group cursor-pointer p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/50 hover:bg-muted/20 transition-all shadow-sm hover:shadow-md flex flex-col justify-between h-48"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl border border-border bg-background flex items-center justify-center overflow-hidden shrink-0">
                                            {company.logo ? (
                                                <img src={company.logo} alt="Logo" className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="text-lg font-medium text-muted-foreground">{company.name.charAt(0)}</span>
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold tracking-tight">{company.name}</h2>
                                            <p className="text-sm text-muted-foreground font-light flex items-center gap-1">
                                                {company.location || "Location not set"}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="text-sm font-medium text-foreground/80 group-hover:text-primary transition-colors flex justify-end">
                                        Manage &rarr;
                                    </div>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-4 pb-10">
                                <Button 
                                    variant="outline" 
                                    size="icon"
                                    onClick={() => dispatch(setCurrentPage(Math.max(1, currentPage - 1)))}
                                    disabled={currentPage === 1}
                                    className="rounded-full h-10 w-10 border-border/50 hover:bg-muted/50"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="text-sm font-medium text-muted-foreground bg-muted/30 px-4 py-2 rounded-full border border-border/50">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <Button 
                                    variant="outline" 
                                    size="icon"
                                    onClick={() => dispatch(setCurrentPage(Math.min(totalPages, currentPage + 1)))}
                                    disabled={currentPage === totalPages}
                                    className="rounded-full h-10 w-10 border-border/50 hover:bg-muted/50"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}

export default Companies;
