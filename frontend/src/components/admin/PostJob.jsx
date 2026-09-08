import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" }
    })
};

const PostJob = () => {
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experienceYear: "",
        position: 0,
        companyId: ""
    });
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const navigate = useNavigate();

    // Pull companies to populate the dropdown
    const { adminCompanies } = useSelector(store => store.company);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const generateWithAiHandler = async () => {
        if (!input.title) {
            toast.error("Add a job title first so the AI knows what to write about");
            return;
        }
        try {
            setAiLoading(true);
            const res = await api.post('/ai/generate-job-description', {
                title: input.title,
                jobType: input.jobType,
                experienceYear: input.experienceYear,
                location: input.location
            });
            if (res.data?.success) {
                setInput(prev => ({
                    ...prev,
                    description: res.data.description || prev.description,
                    requirements: res.data.requirements || prev.requirements
                }));
                toast.success("Draft generated — feel free to edit it before posting.");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.msg || "AI generation failed. Please try again.");
        } finally {
            setAiLoading(false);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await api.post('/job/post', input);
            if (res.data) {
                toast.success(res.data.msg);
                navigate("/admin/jobs");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.msg || "Failed to post job");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />
            <div className="flex-1 max-w-4xl mx-auto w-full px-6 pt-32 pb-24">
                <motion.div
                    className="flex items-center gap-4 mb-10"
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                >
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => navigate("/admin/jobs")}
                        className="rounded-full h-10 w-10 text-muted-foreground hover:bg-muted"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Post a Job</h1>
                        <p className="text-muted-foreground mt-1 font-light">Create a new opportunity for amazing talent.</p>
                    </div>
                </motion.div>

                <motion.form
                    onSubmit={submitHandler}
                    className="max-w-2xl space-y-6"
                    initial="hidden"
                    animate="visible"
                >
                    
                    {/* Basic Details */}
                    <motion.div custom={1} variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Job Title</Label>
                            <Input
                                type="text"
                                name="title"
                                value={input.title}
                                onChange={changeEventHandler}
                                className="h-12 bg-muted/40 border border-border/50 hover:bg-muted focus:bg-background transition-all rounded-lg"
                                placeholder="E.g. Senior Frontend Engineer"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Company</Label>
                            {(adminCompanies || []).length === 0 ? (
                                <p className="text-sm text-destructive font-medium pt-3">
                                    You must create a company first!
                                </p>
                            ) : (
                                <select
                                    name="companyId"
                                    value={input.companyId}
                                    onChange={changeEventHandler}
                                    className="flex w-full h-12 rounded-lg border border-border/50 bg-muted/40 px-3 py-2 text-sm ring-offset-background hover:bg-muted focus-visible:outline-none focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
                                    required
                                >
                                    <option value="" disabled>Select a Company...</option>
                                    {(adminCompanies || []).map((c) => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </motion.div>

                    <motion.div custom={2} variants={fadeUp} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</Label>
                            <motion.button
                                type="button"
                                onClick={generateWithAiHandler}
                                disabled={aiLoading}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-border/60 bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 text-foreground transition-colors disabled:opacity-60"
                            >
                                {aiLoading ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                    <Sparkles className="h-3.5 w-3.5" />
                                )}
                                {aiLoading ? "Generating..." : "Generate with AI"}
                            </motion.button>
                        </div>
                        <textarea
                            name="description"
                            value={input.description}
                            onChange={changeEventHandler}
                            className="flex w-full rounded-lg border-border/50 border bg-muted/40 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all min-h-[120px]"
                            placeholder="Describe the role responsibilities... or fill in a title above and hit Generate with AI"
                            required
                        />
                    </motion.div>

                    <motion.div custom={3} variants={fadeUp} className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Requirements</Label>
                        <textarea
                            name="requirements"
                            value={input.requirements}
                            onChange={changeEventHandler}
                            className="flex w-full rounded-lg border-border/50 border bg-muted/40 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all min-h-[80px]"
                            placeholder="React, Node.js, NextJS... (Comma separated)"
                            required
                        />
                    </motion.div>

                    {/* Numeric / Metadata Grid */}
                    <motion.div custom={4} variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Salary Amount (LPA)</Label>
                            <Input
                                type="number"
                                name="salary"
                                value={input.salary}
                                onChange={changeEventHandler}
                                className="h-12 bg-muted/40 border border-border/50 hover:bg-muted focus:bg-background transition-all rounded-lg"
                                placeholder="E.g. 12"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                className="h-12 bg-muted/40 border border-border/50 hover:bg-muted focus:bg-background transition-all rounded-lg"
                                placeholder="E.g. Remote, Bangalore"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Job Type</Label>
                            <Input
                                type="text"
                                name="jobType"
                                value={input.jobType}
                                onChange={changeEventHandler}
                                className="h-12 bg-muted/40 border border-border/50 hover:bg-muted focus:bg-background transition-all rounded-lg"
                                placeholder="E.g. Full-time, Internship"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Experience (Years)</Label>
                            <Input
                                type="number"
                                name="experienceYear"
                                value={input.experienceYear}
                                onChange={changeEventHandler}
                                className="h-12 bg-muted/40 border border-border/50 hover:bg-muted focus:bg-background transition-all rounded-lg"
                                placeholder="E.g. 2"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Positions</Label>
                            <Input
                                type="number"
                                name="position"
                                value={input.position}
                                onChange={changeEventHandler}
                                className="h-12 bg-muted/40 border border-border/50 hover:bg-muted focus:bg-background transition-all rounded-lg"
                                placeholder="E.g. 5"
                                required
                            />
                        </div>
                    </motion.div>

                    <motion.div custom={5} variants={fadeUp} className="pt-6 border-t border-border/50">
                        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                            <Button 
                                type="submit" 
                                disabled={loading || (adminCompanies || []).length === 0}
                                className="w-full h-12 rounded-lg shadow-md mt-2"
                            >
                                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Post Job Live"}
                            </Button>
                        </motion.div>
                    </motion.div>

                </motion.form>
            </div>
        </div>
    )
}

export default PostJob;
