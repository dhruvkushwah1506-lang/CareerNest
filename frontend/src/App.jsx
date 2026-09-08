import {  createBrowserRouter } from "react-router-dom"
import { RouterProvider } from "react-router-dom"
import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import Home from "./components/Home"
import SplashScreen from "./components/shared/SplashScreen.jsx"
import SignUp from "./components/auth/SignUp.jsx"
import Login from "./components/auth/Login.jsx"
import Jobs from "./components/Jobs.jsx"
import Browse from "./components/Browse.jsx"
import AdminJobs from "./components/admin/AdminJobs.jsx"
import Companies from "./components/admin/Companies.jsx"
import CompanyCreate from "./components/admin/CompanyCreate.jsx"
import CompanySetup from "./components/admin/CompanySetup.jsx"
import PostJob from "./components/admin/PostJob.jsx"
import Applicants from "./components/admin/Applicants.jsx"
import JobDescription from "./components/JobDescription.jsx"
import Profile from "./components/Profile.jsx"
import MyApplications from "./components/MyApplications.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import AdminRoute from "./components/admin/AdminRoute.jsx"
import StudentRoute from "./components/StudentRoute.jsx"
import JobSetup from "./components/admin/JobSetup.jsx"
import { Toaster } from 'sonner'

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  const appRouter=createBrowserRouter([
    {
      path:'/',
      element:<Home/>
    },
    {
      path:'/profile',
      element:<ProtectedRoute><Profile/></ProtectedRoute>
    },
    {
      path:'/admin/jobs',
      element:<AdminRoute><AdminJobs/></AdminRoute>
    },
    {
      path:'/admin/jobs/create',
      element:<AdminRoute><PostJob/></AdminRoute>
    },
    {
      path:'/admin/jobs/:id/applicants',
      element:<AdminRoute><Applicants/></AdminRoute>
    },
    {
      path:'/admin/jobs/:id/edit',
      element:<AdminRoute><JobSetup/></AdminRoute>
    },
    {
      path:'/admin/companies',
      element:<AdminRoute><Companies/></AdminRoute>
    },
    {
      path:'/admin/companies/create',
      element:<AdminRoute><CompanyCreate/></AdminRoute>
    },
    {
      path:'/admin/companies/:id',
      element:<AdminRoute><CompanySetup/></AdminRoute>
    },
    {
      path:'/jobs',
      element:<Jobs/>
    },
    {
      path:'/description/:id',
      element:<JobDescription/>
    },
    {
      path:'/browse',
      element:<Browse/>
    },
    {
      path:'/applications',
      element:<StudentRoute><MyApplications/></StudentRoute>
    },
    {
      path:'/signup',
      element:<SignUp/>
    },
    {
      path:'/login',
      element:<Login/>
    }
  ])
  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen key="splash" />}
      </AnimatePresence>
      <RouterProvider router={appRouter}/>
      <Toaster position="top-center" />
    </>
  )
}

export default App
