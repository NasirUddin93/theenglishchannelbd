'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowRight, Sparkles, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, register } = useAuth();

  const handleTestLogin = () => {
    setLoading(true);
    login('john@example.com', 'password123')
      .then(() => {
        router.push('/');
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleStaffLogin = () => {
    setLoading(true);
    login('admin@luminabooks.com', 'admin123')
      .then(() => {
        router.push('/staff');
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register({
          name,
          email,
          password,
          password_confirmation: password,
        });
      }
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-[80vh] gap-8 p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-orange-900/5 p-8 md:p-12"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-50 rounded-2xl text-orange-600 mb-6">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-500">
            {isLogin ? 'Sign in to access your library and reviews.' : 'Join our community of readers today.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-2">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text"
                placeholder="Full Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="email"
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-orange-600 font-bold hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </motion.div>

      <div className="flex flex-col gap-4">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-xs bg-orange-600 rounded-[32px] p-8 text-white shadow-2xl shadow-orange-600/20 flex flex-col items-center text-center space-y-6"
        >
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <UserCheck className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold mb-2">Test Customer</h3>
            <p className="text-orange-100 text-sm">Instantly log in as a test customer to explore all features without signing up.</p>
          </div>
          <button
            onClick={handleTestLogin}
            disabled={loading}
            className="w-full py-4 bg-white text-orange-600 rounded-2xl font-bold hover:bg-orange-50 transition-all transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Logging in...' : 'Login as Customer'}
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-[10px] uppercase tracking-widest font-bold text-orange-200">For Testing Purposes Only</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-xs bg-gray-900 rounded-[32px] p-8 text-white shadow-2xl shadow-gray-900/20 flex flex-col items-center text-center space-y-6"
        >
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold mb-2">Staff Portal</h3>
            <p className="text-gray-400 text-sm">Access the staff dashboard to manage books and monitor stock alerts.</p>
          </div>
          <button
            onClick={handleStaffLogin}
            disabled={loading}
            className="w-full py-4 bg-white text-gray-900 rounded-2xl font-bold hover:bg-gray-50 transition-all transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Logging in...' : 'Login as Staff'}
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Staff Access Only</p>
        </motion.div>
      </div>
    </div>
  );
}
