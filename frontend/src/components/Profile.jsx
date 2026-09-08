import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Contact, Mail, Pen } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { useSelector } from 'react-redux'
import UpdateProfileDialog from './ProfileUpdateDialog'
import AppliedJobTable from './AppliedJobTable'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'

// const skills = ["Html", "Css", "Javascript", "Reactjs"]
const isResume = true;

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className='max-w-4xl mx-auto bg-card border border-border/50 rounded-2xl my-5 p-8 mt-24 mb-16 shadow-sm'>
                <div className='flex justify-between items-start'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="h-24 w-24 border border-border">
                            <AvatarImage src={user?.profile?.profilePhoto || ""} alt="profile" />
                            <AvatarFallback className="bg-muted text-muted-foreground text-2xl font-semibold">
                                {user?.fullname?.[0]?.toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className='font-bold text-2xl tracking-tight'>{user?.fullname}</h1>
                            <p className='text-muted-foreground mt-1 font-light'>{user?.profile?.bio || "No bio added yet."}</p>
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} variant="outline" className="rounded-xl h-10 w-10 p-0" title="Edit Profile">
                        <Pen className="h-4 w-4" />
                    </Button>
                </div>
                <div className='my-8'>
                    <div className='flex items-center gap-3 my-3 text-muted-foreground'>
                        <Mail className='h-4 w-4' />
                        <span className='text-sm'>{user?.email}</span>
                    </div>
                    <div className='flex items-center gap-3 my-3 text-muted-foreground'>
                        <Contact className='h-4 w-4' />
                        <span className='text-sm'>{user?.phoneNumber}</span>
                    </div>
                </div>
                {user?.role !== 'Recruiter' && (
                    <div className='my-8'>
                        <h1 className='font-semibold text-lg mb-3 tracking-tight'>Skills</h1>
                        <div className='flex items-center gap-2 flex-wrap'>
                            {
                                user?.profile?.skills.length !== 0 ? user?.profile?.skills.map((item, index) => <Badge key={index} variant="secondary" className="px-3 py-1 bg-muted/50 hover:bg-muted font-medium transition-colors">{item}</Badge>) : <span className="text-muted-foreground text-sm font-light">NA</span>
                            }
                        </div>
                    </div>
                )}
                {user?.role !== 'Recruiter' && (
                    <div className='grid w-full max-w-sm items-center gap-2 pt-6 border-t border-border/50'>
                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Resume</Label>
                        {
                            user?.profile?.resume ? (
                                <a target='_blank' rel='noopener noreferrer' href={user?.profile?.resume} className='text-primary text-sm hover:underline flex items-center gap-2 font-medium cursor-pointer'>
                                    {user?.profile?.resumeOriginalName || "Download Resume"}
                                </a>
                            ) : (
                                <span className="text-muted-foreground text-sm font-light">None added</span>
                            )
                        }
                    </div>
                )}
            </div>
            {user?.role !== 'Recruiter' && (
                <div className='max-w-4xl mx-auto bg-card border border-border/50 rounded-2xl p-8 mb-16 shadow-sm'>
                    <h1 className='font-bold text-xl mb-6 tracking-tight'>Applied Jobs</h1>
                    <AppliedJobTable />
                </div>
            )}
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile
