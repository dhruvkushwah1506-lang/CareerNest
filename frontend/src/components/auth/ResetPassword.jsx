import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/user/reset-password', { token, newPassword });
      if (res.data.success) {
        toast.success('Password reset successfully — please log in.');
        navigate('/login');
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

          <h1 className="text-3xl font-semibold tracking-tight mb-2">Set a new password</h1>
          <p className="text-muted-foreground mb-8">Choose a new password for your account.</p>

          <form onSubmit={submitHandler} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">New Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="h-12 bg-muted/40 border border-border/50 hover:bg-muted focus:bg-background transition-all rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Confirm Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                className="h-12 bg-muted/40 border border-border/50 hover:bg-muted focus:bg-background transition-all rounded-lg"
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 rounded-lg shadow-md">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Reset password'}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
