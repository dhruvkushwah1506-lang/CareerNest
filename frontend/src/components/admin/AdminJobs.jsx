import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '@/lib/axios';
import { setAllAdminJobs, setLoading, setPagination, setCurrentPage } from '@/redux/jobSlice';
import { Loader2, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminJobs = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { allAdminJobs, loading, currentPage, totalPages, totalJobs } = useSelector(store => store.job);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchAdminJobs = async () => {
            try {
                dispatch(setLoading(true));
                const res = await api.get(`/job/getadminjobs?page=${currentPage}`);
                if (res.data.success) {
                    dispatch(setAllAdminJobs(res.data.jobs));
                    dispatch(setPagination({
                        currentPage: res.data.currentPage,
                        totalPages: res.data.totalPages,
                        totalJobs: res.data.totalJobs
                    }));
                }
            } catch (error) {
                console.log(error);
                dispatch(setAllAdminJobs([]));
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchAdminJobs();
    }, [dispatch, currentPage]);

    const filteredJobs = (allAdminJobs || []).filter((job) => 
        job?.title?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />
            <main className="pt-32 px-6 max-w-7xl mx-auto w-full pb-20">
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
                            Your Posted Jobs
                        </h1>
                        <p className="text-muted-foreground mt-2 font-light">
                            Manage your job listings and view applicants.
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Filter jobs..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 h-11 bg-muted/30 border-transparent rounded-full hover:bg-muted/50 focus:bg-background transition-all"
                            />
                        </div>
                        <Button 
                            onClick={() => navigate("/admin/jobs/create")}
                            className="h-11 px-6 rounded-full shadow-sm"
                        >
                            Post New Job
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="h-64 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center border border-dashed border-border rounded-xl bg-muted/5">
                        <p className="text-muted-foreground font-light mb-4">
                            You haven't posted any jobs yet.
                        </p>
                        <Button variant="outline" onClick={() => navigate("/admin/jobs/create")} className="h-10 px-6 rounded-full">
                            Create your first job
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredJobs.map((job) => (
                                <div 
                                    key={job._id}
                                    className="group p-6 rounded-2xl border border-border/50 bg-card transition-all shadow-sm hover:shadow-md flex flex-col h-full"
                                >
                                    <div className="mb-4">
                                        <h2 className="text-xl font-semibold tracking-tight">{job.title}</h2>
                                        <p className="text-sm text-muted-foreground font-light mt-1">
                                            {job.location} • {job.jobType}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 mb-6 flex-wrap">
                                        <span className="inline-flex items-center rounded-full border border-border bg-muted/30 px-2.5 py-0.5 text-xs font-semibold text-foreground">
                                            {job.position} Positions
                                        </span>
                                        <span className="inline-flex items-center rounded-full border border-border bg-muted/30 px-2.5 py-0.5 text-xs font-semibold text-foreground">
                                            {job.salary} LPA
                                        </span>
                                        <span className="inline-flex items-center rounded-full border border-border bg-muted/30 px-2.5 py-0.5 text-xs font-semibold text-foreground">
                                            {job.experienceYear}y Exp
                                        </span>
                                    </div>
                                    
                                    <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between gap-2">
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(job.createdAt).toLocaleDateString()}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <Button 
                                                onClick={() => navigate(`/admin/jobs/${job._id}/edit`)}
                                                variant="outline" 
                                                className="h-8 text-xs font-medium px-3 rounded-lg"
                                            >
                                                Edit
                                            </Button>
                                            <Button 
                                                onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                                                variant="ghost" 
                                                className="h-8 text-xs font-medium px-3 text-primary hover:bg-primary/10 hover:text-primary rounded-lg"
                                            >
                                                Applicants
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-border/40">
                                <p className="text-sm text-muted-foreground font-light">
                                    Showing <span className="font-medium text-foreground">{(currentPage - 1) * 6 + 1}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * 6, totalJobs)}</span> of <span className="font-medium text-foreground">{totalJobs}</span> posted jobs
                                </p>
                                <div className="flex items-center gap-2">
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
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminJobs;
