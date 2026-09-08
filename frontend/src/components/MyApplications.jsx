import React from 'react'
import Navbar from './shared/Navbar'
import AppliedJobTable from './AppliedJobTable'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'

const MyApplications = () => {
    useGetAppliedJobs();
    return (
    <div className='min-h-screen bg-background text-foreground'>
      <Navbar />
      <div className='max-w-7xl mx-auto px-6 pt-32 pb-16'>
        <div className='mb-10'>
          <h1 className='text-4xl font-bold tracking-tight text-foreground'>My Applications</h1>
          <p className='text-muted-foreground mt-2 font-light'>Track the status of all your submitted job applications.</p>
        </div>
        
        <div className='bg-card border border-border/50 rounded-2xl p-8 shadow-sm'>
          <AppliedJobTable />
        </div>
      </div>
    </div>
  )
}

export default MyApplications
