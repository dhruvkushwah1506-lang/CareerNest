import React from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const Job = ({ job }) => {
    const navigate = useNavigate();
    
    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    };

    const daysAgo = daysAgoFunction(job?.createdAt);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className='p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/30 transition-colors shadow-sm hover:shadow-lg flex flex-col justify-between group h-full'
        >
            <div>
                <div className='flex items-center justify-between mb-4'>
                    <span className='text-xs font-medium px-3 py-1 bg-muted text-muted-foreground rounded-full'>
                        {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
                    </span>
                    <motion.div whileTap={{ scale: 0.85 }}>
                        <Button variant="ghost" className="rounded-full h-8 w-8 text-muted-foreground" size="icon">
                            <Bookmark className="h-4 w-4 group-hover:text-primary transition-colors"/>
                        </Button>
                    </motion.div>
                </div>

                <div className='flex items-center gap-4 mb-5'>
                    <div className='h-12 w-12 rounded-xl border border-border bg-background flex items-center justify-center overflow-hidden shrink-0'>
                        {job?.company?.logo ? (
                            <img src={job.company.logo} alt="Logo" className="h-full w-full object-cover" />
                        ) : (
                            <span className="text-lg font-medium text-muted-foreground">{job?.company?.name?.charAt(0) || "C"}</span>
                        )}
                    </div>
                    <div>
                        <h1 className='font-semibold text-lg tracking-tight text-foreground'>{job?.company?.name}</h1>
                        <p className='text-xs text-muted-foreground font-light tracking-wide'>{job?.location || "Remote"}</p>
                    </div>
                </div>

                <div className="mb-6">
                    <h1 className='font-bold text-xl my-2 text-foreground tracking-tight leading-tight line-clamp-2'>{job?.title}</h1>
                    <p className='text-sm text-muted-foreground font-light line-clamp-3 leading-relaxed'>
                        {job?.description}
                    </p>
                </div>
            </div>

            <div>
                <div className='flex items-center gap-2 mb-6 flex-wrap'>
                    <span className="inline-flex items-center rounded-full border border-border bg-muted/30 px-2.5 py-0.5 text-xs font-semibold text-foreground">
                        {job?.position} Positions
                    </span>
                    <span className="inline-flex items-center rounded-full border border-border bg-muted/30 px-2.5 py-0.5 text-xs font-semibold text-foreground">
                        {job?.jobType}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-border bg-muted/30 px-2.5 py-0.5 text-xs font-semibold text-foreground">
                        {job?.salary} LPA
                    </span>
                </div>
                
                <div className='flex items-center gap-3 pt-4 border-t border-border/50'>
                    <motion.div whileTap={{ scale: 0.97 }} className="w-full">
                        <Button 
                            onClick={() => navigate(`/description/${job?._id}`)} 
                            variant="secondary" 
                            className="rounded-full w-full shadow-sm font-medium"
                        >
                            View Details
                        </Button>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    )
}

export default Job;
