import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setSingleCompany } from '@/redux/companySlice';
import { Loader2 } from 'lucide-react';

const CompanyCreate = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const registerNewCompany = async () => {
        try {
            setLoading(true);
            const res = await api.post('/company/register', { companyName });
            if (res?.data?.company) {
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.msg);
                const companyId = res?.data?.company?._id;
                navigate(`/admin/companies/${companyId}`);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.msg || "Failed to register company.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />
            <div className="flex-1 max-w-4xl mx-auto w-full px-6 pt-32">
                <div className="mb-8">
                    <h1 className="text-4xl font-semibold tracking-tight text-foreground">New Company</h1>
                    <p className="text-muted-foreground mt-2 font-light">What is the name of your organization? Don't worry, you can change this later in settings.</p>
                </div>

                <div className="space-y-6 max-w-xl">
                    <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Company Name</Label>
                        <Input
                            type="text"
                            placeholder="e.g. Acme Corporation"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="h-14 text-lg bg-muted/30 border-transparent hover:bg-muted/50 focus:bg-background transition-all rounded-lg"
                        />
                    </div>
                    
                    <div className="flex items-center gap-4 pt-4">
                        <Button 
                            variant="outline" 
                            onClick={() => navigate("/admin/companies")}
                            className="h-12 px-8 rounded-full border-border hover:bg-muted/50"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={registerNewCompany} 
                            disabled={!companyName || loading}
                            className="h-12 px-8 rounded-full shadow-md transition-transform hover:scale-105 active:scale-95"
                        >
                            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Continue"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyCreate;
