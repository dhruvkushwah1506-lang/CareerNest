import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSingleJob } from '@/redux/jobSlice';
import Navbar from './shared/Navbar';
import { ArrowLeft, ExternalLink, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/axios';

const JobDescription = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    
    const [loading, setLoading] = useState(true);
    const [isApplied, setIsApplied] = useState(false);

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await api.get(`/job/get/${id}`);
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id));
                }
            } catch (error) {
                console.log(error);
                toast.error("Failed to load job details.");
            } finally {
                setLoading(false);
            }
        };
        fetchSingleJob();
    }, [id, dispatch, user?._id]);

    const [isApplying, setIsApplying] = useState(false);

    const applyJobHandler = async () => {
        setIsApplying(true);
        try {
            const res = await api.post(`/application/apply/${id}`, {}, { withCredentials: true });
            if (res.data.success) {
                setIsApplied(true);
                toast.success(res.data.message || "Successfully applied to job!");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.response?.data?.msg || "Failed to apply");
        } finally {
            setIsApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <Navbar />
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!singleJob) return <div className="min-h-screen flex items-center justify-center"><Navbar />No Job Found</div>;

    const daysAgo = Math.floor((new Date() - new Date(singleJob.createdAt)) / (1000 * 24 * 60 * 60));

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />
            <div className="flex-1 max-w-4xl mx-auto w-full px-6 pt-32 pb-24">
                <Button 
                    variant="ghost" 
                    onClick={() => navigate(-1)}
                    className="mb-8 rounded-full text-muted-foreground hover:bg-muted/50 -ml-2"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to jobs
                </Button>

                {/* Header Section */}
                <div className="p-8 rounded-3xl border border-border/50 bg-card shadow-sm mb-8 relative overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
                        <div className="flex gap-6 items-start">
                            <div className='h-20 w-20 rounded-2xl border border-border bg-background flex items-center justify-center overflow-hidden shrink-0 shadow-sm'>
                                {singleJob?.company?.logo ? (
                                    <img src={singleJob.company.logo} alt="Logo" className="h-full w-full object-cover" />
                                ) : (
                                    <span className="text-3xl font-medium text-muted-foreground">{singleJob?.company?.name?.charAt(0) || "C"}</span>
                                )}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">{singleJob.title}</h1>
                                <div className="text-lg text-muted-foreground font-medium flex items-center gap-2">
                                    {singleJob.company?.name} 
                                    {singleJob.company?.website && (
                                        <a href={singleJob.company.website} target="_blank" rel="noreferrer" className="inline-flex text-primary hover:underline items-center gap-1 text-sm font-normal">
                                            <ExternalLink className="h-3 w-3" /> Visit website
                                        </a>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 mt-4 flex-wrap">
                                    <span className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-sm font-medium">
                                        {singleJob.location}
                                    </span>
                                    <span className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-sm font-medium">
                                        {singleJob.jobType}
                                    </span>
                                    <span className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-sm font-medium">
                                        {singleJob.salary} LPA
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 min-w-[200px]">
                            <Button 
                                onClick={isApplied ? null : applyJobHandler}
                                disabled={isApplied || isApplying || user?.role === 'Recruiter'}
                                className={`h-12 rounded-xl shadow-md text-base w-full ${isApplied ? 'bg-muted text-muted-foreground opacity-100 hover:bg-muted cursor-default' : ''}`}
                            >
                                {isApplying ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Applying...</>
                                ) : isApplied ? "Already Applied" : "Apply Now"}
                            </Button>
                            <span className="text-xs text-center text-muted-foreground/70 font-medium">
                                Posted {daysAgo === 0 ? "today" : `${daysAgo} days ago`}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-8">
                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold tracking-tight border-b border-border/50 pb-2">Job Description</h2>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap font-light text-[15px]">
                                {singleJob.description}
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold tracking-tight border-b border-border/50 pb-2">Requirements</h2>
                            <ul className="list-inside list-disc text-muted-foreground space-y-2 font-light text-[15px]">
                                {
                                    Array.isArray(singleJob.requirements) 
                                    ? singleJob.requirements.map((req, index) => <li key={index} className="pl-1">{req.trim()}</li>)
                                    : singleJob.requirements?.split(',').map((req, index) => <li key={index} className="pl-1">{req.trim()}</li>)
                                }
                            </ul>
                        </section>
                    </div>

                    {/* Meta Sidebar */}
                    <div className="space-y-6">
                        <div className="p-6 rounded-2xl border border-border/50 bg-card/50 shadow-sm space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Experience Needed</h3>
                                <p className="text-foreground font-medium">{singleJob.experienceYear} Years</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Open Positions</h3>
                                <p className="text-foreground font-medium">{singleJob.position}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Applicants</h3>
                                <p className="text-foreground font-medium">{singleJob.applications?.length || 0} applied</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDescription;
