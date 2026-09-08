import React, { useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { MoreHorizontal } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'sonner'
import api from '@/lib/axios'
import { setApplicants } from '@/redux/applicationSlice'

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);
    const dispatch = useDispatch();
    const [openRow, setOpenRow] = useState(null);

    const statusHandler = async (status, id) => {
        try {
            const res = await api.post(`/application/update/${id}`, { status }, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message);
                const updatedApplicants = applicants.map(app => 
                    app._id === id ? { ...app, status: status } : app
                );
                dispatch(setApplicants(updatedApplicants));
                setOpenRow(null);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    }

    return (
        <div className="w-full">
            <Table>
                <TableCaption>A list of your applied users</TableCaption>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-border/50">
                        <TableHead className="font-semibold text-foreground">FullName</TableHead>
                        <TableHead className="font-semibold text-foreground">Email</TableHead>
                        <TableHead className="font-semibold text-foreground">Contact</TableHead>
                        <TableHead className="font-semibold text-foreground">Resume</TableHead>
                        <TableHead className="font-semibold text-foreground">Date</TableHead>
                        <TableHead className="font-semibold text-foreground">Status</TableHead>
                        <TableHead className="text-right font-semibold text-foreground">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        applicants && applicants?.map((item) => (
                            <TableRow key={item._id} className="border-border/40 hover:bg-muted/30 transition-colors">
                                <TableCell className="font-medium">{item?.applicant?.fullname}</TableCell>
                                <TableCell>{item?.applicant?.email}</TableCell>
                                <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                                <TableCell>
                                    {
                                        item?.applicant?.profile?.resume ? (
                                            <a 
                                                className="inline-flex items-center px-3 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium text-xs whitespace-nowrap" 
                                                href={item?.applicant?.profile?.resume} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                            >
                                                {item?.applicant?.profile?.resumeOriginalName || "View Resume"}
                                            </a>
                                        ) : <span className="text-muted-foreground italic text-sm">NA</span>
                                    }
                                </TableCell>
                                <TableCell>{item?.applicant?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item?.status === 'Accepted' ? 'bg-green-100 text-green-700' : item?.status === 'Rejected' ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'}`}>
                                        {item?.status || 'Pending'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Popover open={openRow === item._id} onOpenChange={(isOpen) => setOpenRow(isOpen ? item._id : null)}>
                                        <PopoverTrigger className="p-2 hover:bg-muted rounded-full transition-colors">
                                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32 p-1.5 rounded-xl shadow-lg border-border/40" align="end">
                                            {
                                                shortlistingStatus.map((status, index) => {
                                                    return (
                                                        <div 
                                                            onClick={() => statusHandler(status, item?._id)} 
                                                            key={index} 
                                                            className={`flex items-center w-full px-2 py-1.5 cursor-pointer rounded-md hover:bg-muted transition-colors text-sm font-medium ${status === 'Accepted' ? 'text-green-600' : 'text-red-600'}`}
                                                        >
                                                            <span>{status}</span>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default ApplicantsTable
