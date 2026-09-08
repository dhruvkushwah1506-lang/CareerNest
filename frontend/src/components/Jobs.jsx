import React from 'react';
import Navbar from './shared/Navbar';
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { setSearchedQuery, setCurrentPage } from '@/redux/jobSlice';
import { Button } from './ui/button';
import FilterCard from './FilterCard';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const gridContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.07 }
    }
};

const Jobs = () => {
    const dispatch = useDispatch();
    useGetAllJobs();
    const { allJobs, searchedQuery, loading, currentPage, totalPages } = useSelector(store => store.job);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            dispatch(setCurrentPage(newPage));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // Since backend handles basic keyword search, client side filter can be minimal or removed 
    // depending on if we want double-filtering. For now, I'll keep it as-is for the searchedQuery.
    const filteredJobs = (allJobs || []).filter(job => {
        if (!searchedQuery) return true;
        const query = searchedQuery.toLowerCase();
        return (
            job?.title?.toLowerCase().includes(query) || 
            job?.description?.toLowerCase().includes(query) ||
            job?.location?.toLowerCase().includes(query) ||
            job?.company?.name?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />
            <main className="pt-32 px-6 max-w-7xl mx-auto w-full pb-20 flex-1">
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-4xl font-semibold tracking-tight text-foreground">
                        Explore Opportunities
                    </h1>
                    <p className="text-muted-foreground mt-3 font-light text-lg">
                        Find and apply to exactly what you are looking for.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filter Sidebar */}
                    <div className="w-full lg:w-64 shrink-0">
                        <FilterCard />
                    </div>

                    {/* Job Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-96 flex items-center justify-center"
                            >
                                <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
                            </motion.div>
                        ) : allJobs.length === 0 ? (
                            <div className="h-64 flex flex-col items-center justify-center border border-dashed border-border rounded-2xl bg-muted/5">
                                <p className="text-muted-foreground font-light mb-4 text-center px-4">
                                    No live jobs found right now. Check back later!
                                </p>
                            </div>
                        ) : filteredJobs.length === 0 ? (
                            <div className="h-64 flex flex-col items-center justify-center border border-dashed border-border rounded-2xl bg-muted/5 transition-all">
                                <p className="text-muted-foreground font-light mb-4 text-center px-4">
                                    No jobs found matching "{searchedQuery}".
                                </p>
                                <Button 
                                    variant="link" 
                                    onClick={() => dispatch(setSearchedQuery(""))}
                                    className="text-primary hover:underline"
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-10">
                                <motion.div
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                    variants={gridContainer}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <AnimatePresence mode="popLayout">
                                        {filteredJobs.map((job) => (
                                            <Job key={job._id} job={job} />
                                        ))}
                                    </AnimatePresence>
                                </motion.div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center space-x-2 pt-10 border-t border-border/40">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="rounded-full h-10 w-10 border-border/50"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        
                                        <div className="flex items-center space-x-1">
                                            {[...Array(totalPages)].map((_, index) => (
                                                <Button
                                                    key={index + 1}
                                                    variant={currentPage === index + 1 ? "default" : "ghost"}
                                                    size="sm"
                                                    onClick={() => handlePageChange(index + 1)}
                                                    className={`h-10 w-10 rounded-full font-medium ${currentPage === index + 1 ? 'shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
                                                >
                                                    {index + 1}
                                                </Button>
                                            ))}
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="rounded-full h-10 w-10 border-border/50"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Jobs;
