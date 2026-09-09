import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, MailCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post('/user/forgot-password', { email });
      if (res.data.success) {
        setSent(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center px-6 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>

          {sent ? (
            <div className="text-center space-y-4 py-8">
              <div className="mx-auto h-14 w-14 rounded-full bg-muted/50 flex items-center justify-center">
                <MailCheck className="h-7 w-7 text-foreground" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
              <p className="text-muted-foreground max-w-sm mx-auto">
                If an account exists for <span className="font-medium text-foreground">{email}</span>, we've sent a link to reset your password. It expires in 30 minutes.
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-semibold tracking-tight mb-2">Forgot password?</h1>
              <p className="text-muted-foreground mb-8">Enter your email and we'll send you a reset link.</p>

              <form onSubmit={submitHandler} className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-12 bg-muted/40 border border-border/50 hover:bg-muted focus:bg-background transition-all rounded-lg"
                    required
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full h-12 rounded-lg shadow-md">
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Send reset link'}
                </Button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
