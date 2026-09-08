import React, { useEffect } from 'react'
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import api from '@/lib/axios'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setApplicants, setLoading } from '@/redux/applicationSlice'
import { Loader2 } from 'lucide-react'

const Applicants = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const { applicants, loading } = useSelector(store => store.application);

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                dispatch(setLoading(true));
                const res = await api.get(`/application/getapplicants/${params.id}`);
                if (res.data.success) {
                    dispatch(setApplicants(res.data.job.applications));
                }
            } catch (error) {
                console.log(error);
            } finally {
                dispatch(setLoading(false));
            }
        }
        fetchAllApplicants();
    }, [params.id, dispatch]);

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />
            <main className="pt-32 px-6 max-w-7xl mx-auto w-full pb-20">
                <div className="mb-12">
                    <h1 className="text-4xl font-semibold tracking-tight text-foreground">
                        Applicants ({applicants?.length || 0})
                    </h1>
                    <p className="text-muted-foreground mt-2 font-light">
                        Review and manage status for all candidates who applied for this position.
                    </p>
                </div>
                
                <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="h-64 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
                        </div>
                    ) : (
                        <ApplicantsTable />
                    )}
                </div>
            </main>
        </div>
    )
}

export default Applicants
