import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ArrowLeft, Loader2, UploadCloud } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '@/lib/axios';
import { toast } from 'sonner';

const CompanySetup = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null
    });

    useEffect(() => {
        const fetchCompanyById = async () => {
            try {
                const res = await api.get(`/company/get/${params.id}`);
                if (res.data.success && res.data.company) {
                    const company = res.data.company;
                    setInput({
                        name: company.name || "",
                        description: company.description || "",
                        website: company.website || "",
                        location: company.location || "",
                        file: null
                    });
                }
            } catch (error) {
                console.log(error);
                toast.error("Failed to fetch company details");
            } finally {
                setFetching(false);
            }
        };
        fetchCompanyById();
    }, [params.id]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);
        
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            setLoading(true);
            const res = await api.put(`/company/update/${params.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (res.data.msg) {
                toast.success(res.data.msg);
                navigate("/admin/companies");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.msg || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />
            <div className="flex-1 max-w-4xl mx-auto w-full px-6 pt-32 pb-24">
                <div className="flex items-center gap-4 mb-10">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => navigate("/admin/companies")}
                        className="rounded-full h-10 w-10 text-muted-foreground hover:bg-muted"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Company Setup</h1>
                        <p className="text-muted-foreground mt-1 font-light">Provide details about your organization</p>
                    </div>
                </div>

                <form onSubmit={submitHandler} className="max-w-xl space-y-6">
                    <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Company Name</Label>
                        <Input
                            type="text"
                            name="name"
                            value={input.name}
                            onChange={changeEventHandler}
                            className="h-12 bg-muted/30 border-transparent hover:bg-muted/50 focus:bg-background transition-all rounded-lg"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</Label>
                        <textarea
                            name="description"
                            value={input.description}
                            onChange={changeEventHandler}
                            className="flex w-full rounded-lg border-transparent border bg-muted/30 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground hover:bg-muted/50 focus-visible:outline-none focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px] resize-y transition-all"
                            placeholder="What does your company do?"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Website URL</Label>
                            <Input
                                type="text"
                                name="website"
                                value={input.website}
                                onChange={changeEventHandler}
                                placeholder="https://..."
                                className="h-12 bg-muted/30 border-transparent hover:bg-muted/50 focus:bg-background transition-all rounded-lg"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                placeholder="San Francisco, CA"
                                className="h-12 bg-muted/30 border-transparent hover:bg-muted/50 focus:bg-background transition-all rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 pt-2">
                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Company Logo</Label>
                        <div className="relative group cursor-pointer mt-1">
                            <div className="flex h-14 w-full items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 hover:bg-muted/40 transition-colors">
                                <div className="flex items-center space-x-2 text-sm text-foreground/70 font-medium">
                                    <UploadCloud className="h-5 w-5 mr-1" />
                                    <span>{input.file ? input.file.name : "Upload Logo Image"}</span>
                                </div>
                            </div>
                            <input
                                accept="image/*"
                                type="file"
                                onChange={changeFileHandler}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-border/50">
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full h-12 rounded-lg shadow-md mt-2"
                        >
                            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CompanySetup;
