import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import { Button } from './ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Linkedin, Github, Instagram } from 'lucide-react';
import { setSearchedQuery } from '@/redux/jobSlice';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const fadeInView = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const Home = () => {
  const { user } = useSelector(store => store.auth);
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate("/jobs");
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background">
      <Navbar />
      
      {/* Hero Section */}
      <motion.main
        className="pt-32 pb-16 md:pt-48 md:pb-32 px-6 max-w-7xl mx-auto flex flex-col items-center text-center"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        
        {/* Subtle Badge */}
        <motion.div variants={item} className="inline-flex items-center rounded-full border border-border bg-muted/30 px-3 py-1 text-sm font-medium text-muted-foreground mb-8">
          <span className="flex h-2 w-2 rounded-full bg-foreground mr-2 animate-pulse"></span>
          Revolutionizing Hiring
        </motion.div>

        <motion.h1 variants={item} className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tighter text-foreground leading-[1.1] max-w-4xl mx-auto">
          Find the perfect <br />
          <span className="text-muted-foreground font-light">opportunity for you.</span>
        </motion.h1>
        
        <motion.p variants={item} className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
          Search, apply, and land your dream job with our ultra-clean, minimal platform. Employers and students connect in a frictionless ecosystem.
        </motion.p>

        <motion.div variants={item} className="mt-12 flex flex-col items-center gap-6 w-full max-w-lg mx-auto">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
            <input 
              type="text"
              placeholder="Find your dream job..."
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-14 pl-12 pr-4 bg-muted/20 border-transparent rounded-full focus:bg-background focus:ring-2 focus:ring-ring transition-all outline-none text-lg font-light shadow-sm"
            />
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="absolute right-2 top-2">
              <Button 
                onClick={searchJobHandler}
                className="h-10 px-6 rounded-full shadow-md"
              >
                Search
              </Button>
            </motion.div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
              <Link to="/jobs" onClick={() => dispatch(setSearchedQuery(""))}>
                <Button variant="outline" className="w-full sm:w-auto text-base h-12 px-8 rounded-full border-border hover:bg-muted/50 transition-all">
                  Browse All Jobs
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
              <Link to={user?.role === 'Recruiter' ? "/admin/jobs" : user?.role === 'Student' ? "/applications" : "/signup"}>
                <Button variant="ghost" className="w-full sm:w-auto text-base h-12 px-8 rounded-full hover:bg-muted/50">
                  {user?.role === 'Student' ? 'My Applications' : 'Post a Job'}
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.main>

      {/* Features Section */}
      <section className="py-24 md:py-32 bg-secondary/30 border-t border-border/40">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeInView}
          >
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-4">
              Designed for speed.
            </h2>
            <p className="text-muted-foreground text-lg font-light">
              No clutter. No visual noise. Just the features you need to hire or get hired.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-12 lg:gap-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={container}
          >
            
            {/* Feature 1 */}
            <motion.div variants={item} whileHover={{ y: -6 }} className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-background border border-border flex items-center justify-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              </div>
              <h3 className="text-xl font-medium tracking-tight">Seamless Applications</h3>
              <p className="text-muted-foreground font-light leading-relaxed max-w-xs">
                Apply to roles with a single click. Your profile and resume are injected instantly into the recruiter's workflow.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={item} whileHover={{ y: -6 }} className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-background border border-border flex items-center justify-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3 className="text-xl font-medium tracking-tight">Enterprise Grade</h3>
              <p className="text-muted-foreground font-light leading-relaxed max-w-xs">
                Built on top of leading security standards, utilizing strict JWT authentication and password hashing.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={item} whileHover={{ y: -6 }} className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-background border border-border flex items-center justify-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              </div>
              <h3 className="text-xl font-medium tracking-tight">Minimal Architecture</h3>
              <p className="text-muted-foreground font-light leading-relaxed max-w-xs">
                Experience a brutally minimalist interface. No useless data, no heavy visual elements to dilute your focus.
              </p>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/30 bg-background text-muted-foreground">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-sm">
          <p>© 2026 CareerNest. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0 font-medium">
            <motion.a
              href="https://www.linkedin.com/in/opt%C3%AFm%C3%BCs-kushwah-63181640a"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </motion.a>

            <motion.a
              href="https://github.com/dhruvkushwah1506-lang"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              GitHub
            </motion.a>

            <motion.a
              href="https://www.instagram.com/dhruv__kushwah_/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <Instagram className="h-4 w-4" />
              Instagram
            </motion.a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;