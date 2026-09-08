import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';

const Login = () => {
  const [input, setInput] = useState({
    email: '',
    password: '',
    role: 'Student'
  });
  const [captchaToken, setCaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
      toast.error("Please complete the CAPTCHA validation");
      return;
    }
    
    try {
      setLoading(true);
      const res = await api.post('/user/login', { ...input, captchaToken });
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        toast.success(res.data.msg);
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <div className="flex-1 flex justify-center items-center px-6">
        <form onSubmit={submitHandler} autoComplete="off" className="w-full max-w-sm">
          
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Welcome back</h1>
            <p className="text-muted-foreground mt-2 font-light">Enter your credentials to continue</p>
          </div>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</Label>
              <Input 
                type="email" 
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                placeholder="name@example.com" 
                autoComplete="off"
                className="h-12 bg-muted/30 border-transparent hover:bg-muted/50 focus:bg-background focus:border-ring focus:ring-4 focus:ring-ring/20 transition-all rounded-lg" 
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Password</Label>
              <Input 
                type="password" 
                name="password"
                value={input.password}
                onChange={changeEventHandler}
                placeholder="••••••••" 
                autoComplete="new-password"
                className="h-12 bg-muted/30 border-transparent hover:bg-muted/50 focus:bg-background focus:border-ring focus:ring-4 focus:ring-ring/20 transition-all rounded-lg" 
                required
              />
            </div>

            <div className="space-y-2 pt-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setInput({ ...input, role: 'Student' })}
                  className={`h-12 rounded-lg text-sm font-medium transition-colors border ${input.role === 'Student' ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-transparent hover:bg-muted/50'}`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setInput({ ...input, role: 'Recruiter' })}
                  className={`h-12 rounded-lg text-sm font-medium transition-colors border ${input.role === 'Recruiter' ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-transparent hover:bg-muted/50'}`}
                >
                  Recruiter
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-4 flex justify-center">
              <Turnstile 
                siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"} 
                onSuccess={(token) => setCaptchaToken(token)} 
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-12 rounded-lg text-base shadow-md">
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Log In'}
            </Button>
            <p className="mt-6 text-center text-sm text-muted-foreground font-light">
              Don't have an account? <Link to="/signup" className="text-foreground font-medium hover:underline hover:underline-offset-4">Sign up</Link>
            </p>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default Login;