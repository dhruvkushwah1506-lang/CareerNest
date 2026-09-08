import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Loader2, UploadCloud } from "lucide-react";
import { Turnstile } from '@marsidev/react-turnstile';

const SignUp = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "Student",
    file: ""
  });
  const [captchaToken, setCaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  
  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only images (JPEG, PNG, WebP, GIF) are allowed");
        e.target.value = ""; // Reset input
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File size must be less than 5MB");
        e.target.value = ""; // Reset input
        return;
      }
    }
    setInput({ ...input, file: file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
      toast.error("Please complete the CAPTCHA validation");
      return;
    }

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    formData.append("captchaToken", captchaToken);
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      setLoading(true);
      const res = await api.post('/user/register', formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data.success) {
        toast.success(res.data.msg);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <div className="flex-1 flex justify-center py-24 px-6 md:pt-32">
        <form onSubmit={submitHandler} className="w-full max-w-md">
          
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Create an account</h1>
            <p className="text-muted-foreground mt-2 font-light">Join thousands of professionals today.</p>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Full Name</Label>
                <Input 
                  type="text" 
                  name="fullname"
                  value={input.fullname}
                  onChange={changeEventHandler}
                  placeholder="Dhruv Kushwah" 
                  className="h-12 bg-muted/30 border-transparent hover:bg-muted/50 focus:bg-background focus:border-ring focus:ring-4 focus:ring-ring/20 transition-all rounded-lg" 
                  required
                />
              </div>
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone</Label>
                <Input 
                  type="text" 
                  name="phoneNumber"
                  value={input.phoneNumber}
                  onChange={changeEventHandler}
                  placeholder="79*****638" 
                  className="h-12 bg-muted/30 border-transparent hover:bg-muted/50 focus:bg-background focus:border-ring focus:ring-4 focus:ring-ring/20 transition-all rounded-lg" 
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</Label>
              <Input 
                type="email" 
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                placeholder="name@example.com" 
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
                placeholder="Create a strong password" 
                className="h-12 bg-muted/30 border-transparent hover:bg-muted/50 focus:bg-background focus:border-ring focus:ring-4 focus:ring-ring/20 transition-all rounded-lg" 
                required
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-border/50">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">I am a...</Label>
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

            <div className="space-y-2 pt-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Profile Photo (Optional)</Label>
              <div className="relative group cursor-pointer">
                <div className="flex h-12 w-full items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <UploadCloud className="h-4 w-4" />
                    <span>{input.file ? input.file.name : "Click to upload an image"}</span>
                  </div>
                </div>
                <input
                  accept=".jpg,.jpeg,.png,.webp,.gif"
                  type="file"
                  onChange={changeFileHandler}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
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
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Create Account'}
            </Button>
            <p className="mt-6 text-center text-sm text-muted-foreground font-light">
              Already have an account? <Link to="/login" className="text-foreground font-medium hover:underline hover:underline-offset-4">Log in</Link>
            </p>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default SignUp;
