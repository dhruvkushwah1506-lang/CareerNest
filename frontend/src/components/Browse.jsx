import React, { useEffect } from 'react';
import Navbar from './shared/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from './ui/button';
import { setCurrentPage, setSearchCompanyByText } from '@/redux/companySlice';
import useGetPublicCompanies from '@/hooks/useGetPublicCompanies';
import { ExternalLink, MapPin, Loader2 } from 'lucide-react';

const Browse = () => {
    useGetPublicCompanies();
    const { publicCompanies, searchCompanyByText, currentPage, totalCompanies, totalPages, loading } = useSelector(store => store.company);
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(setSearchCompanyByText(""));
        }
    }, [dispatch]);

    const filteredCompanies = (publicCompanies || []).filter(company => {
        if (!searchCompanyByText) return true;
        return company.name.toLowerCase().includes(searchCompanyByText.toLowerCase()) || 
               company.location?.toLowerCase().includes(searchCompanyByText.toLowerCase());
    });

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />
            <main className="pt-32 px-6 max-w-7xl mx-auto w-full pb-20">
                <div className="mb-12">
                    <h1 className="text-4xl font-semibold tracking-tight text-foreground">
                        Browse Companies ({filteredCompanies.length})
                    </h1>
                    <p className="text-muted-foreground mt-2 font-light text-lg">
                        Discover top organizations hiring on our platform.
                    </p>
                </div>

                {loading ? (
                    <div className="h-64 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
                    </div>
                ) : filteredCompanies.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center border border-dashed border-border rounded-2xl bg-muted/5">
                        <p className="text-muted-foreground font-light mb-4">
                            No companies found matching your criteria.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCompanies.map((company) => (
                                <div 
                                    key={company._id}
                                    className="group p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/30 transition-all shadow-sm hover:shadow-md flex flex-col justify-between h-full"
                                >
                                    <div className='flex items-center gap-4 mb-6'>
                                        <div className='h-12 w-12 rounded-xl border border-border bg-background flex items-center justify-center overflow-hidden shrink-0 shadow-sm'>
                                            {company.logo ? (
                                                <img src={company.logo} alt="Logo" className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="text-lg font-medium text-muted-foreground">{company.name.charAt(0)}</span>
                                            )}
                                        </div>
                                        <div className="overflow-hidden">
                                            <h2 className='font-semibold text-lg tracking-tight text-foreground truncate'>{company.name}</h2>
                                            <div className="flex items-center text-xs text-muted-foreground font-light gap-1 truncate">
                                                <MapPin className="h-3 w-3" />
                                                {company.location || "Remote"}
                                            </div>
                                        </div>
                                    </div>
                                    <p className='text-sm text-muted-foreground font-light line-clamp-3 leading-relaxed mb-6 flex-1'>
                                        {company.description || "No description provided for this organization."}
                                    </p>
                                    <div className='flex items-center justify-between pt-4 border-t border-border/50'>
                                        <span className="text-xs text-muted-foreground font-medium">
                                            {company.website ? (
                                                <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                                                    <ExternalLink className="h-3 w-3" /> Visit Website
                                                </a>
                                            ) : "No Website"}
                                        </span>
                                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" title="Active Hiring" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        <div className="mt-12 flex items-center justify-between border-t border-border/40 pt-8">
                            <div className="text-sm text-muted-foreground font-light">
                                Showing <span className="font-medium text-foreground">{(currentPage - 1) * 6 + 1}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * 6, totalCompanies)}</span> of <span className="font-medium text-foreground">{totalCompanies}</span> companies
                            </div>
                            <div className="flex items-center gap-2">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => dispatch(setCurrentPage(currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="rounded-lg px-4 hover:bg-muted"
                                >
                                    Previous
                                </Button>
                                <div className="flex items-center gap-1 mx-2">
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <Button
                                            key={i + 1}
                                            variant={currentPage === i + 1 ? "default" : "ghost"}
                                            size="sm"
                                            onClick={() => dispatch(setCurrentPage(i + 1))}
                                            className="h-8 w-8 rounded-md p-0"
                                        >
                                            {i + 1}
                                        </Button>
                                    ))}
                                </div>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => dispatch(setCurrentPage(currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="rounded-lg px-4 hover:bg-muted"
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default Browse;
