import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useSelector } from 'react-redux'

const AppliedJobTable = () => {
    const {allAppliedJobs} = useSelector(store=>store.job);
    return (
        <div className='mt-10'>
            <Table>
                <TableCaption>A list of your applied jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Job Role</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        !allAppliedJobs || allAppliedJobs.length <= 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground font-light italic">
                                    You haven't applied to any jobs yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            allAppliedJobs.map((appliedJob) => (
                            <TableRow key={appliedJob._id} className="border-border/40 hover:bg-muted/30 transition-colors">
                                <TableCell>{appliedJob?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell className="font-medium">{appliedJob?.job?.title || "N/A"}</TableCell>
                                <TableCell>{appliedJob?.job?.company?.name || "N/A"}</TableCell>
                                <TableCell className="text-right">
                                    <Badge className={`${appliedJob?.status?.toLowerCase() === "rejected" ? 'bg-destructive/10 text-destructive border-transparent' : appliedJob?.status?.toLowerCase() === 'pending' ? 'bg-muted text-muted-foreground border-transparent' : 'bg-green-500/10 text-green-600 border-transparent'} rounded-full px-3 py-1 font-medium capitalize shadow-none hover:bg-transparent cursor-default`}>
                                        {appliedJob?.status || "Pending"}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                            )
                        )
                    )
                }
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable
