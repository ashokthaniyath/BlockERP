'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { Link2, Mail, Lock, User, Shield, Users, Headphones, BarChart3, Eye } from 'lucide-react';
import clsx from 'clsx';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAsRole, availableRoles } = useAuth();
  const [mode, setMode] = useState<'login' | 'demo'>('demo');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await login(email, password);
    
    if (success) {
      router.push('/dashboard');
    } else {
      setError('Invalid email or password');
    }
    
    setIsLoading(false);
  };

  const handleDemoLogin = (role: UserRole) => {
    setIsLoading(true);
    loginAsRole(role);
    setTimeout(() => {
      router.push('/dashboard');
    }, 500);
  };

  const roleInfo: Record<UserRole, { icon: React.ElementType; description: string; color: string }> = {
    admin: {
      icon: Shield,
      description: 'Full access to all features and settings',
      color: 'bg-purple-100 text-purple-700 border-purple-200',
    },
    manager: {
      icon: BarChart3,
      description: 'Manage orders, inventory, and team',
      color: 'bg-blue-100 text-blue-700 border-blue-200',
    },
    sales: {
      icon: Users,
      description: 'Handle customers and sales orders',
      color: 'bg-green-100 text-green-700 border-green-200',
    },
    auditor: {
      icon: Eye,
      description: 'View blockchain records and audit logs',
      color: 'bg-orange-100 text-orange-700 border-orange-200',
    },
    support: {
      icon: Headphones,
      description: 'Manage support tickets and customer issues',
      color: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl shadow-lg mb-4">
            <Link2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">BlockERP</h1>
          <p className="text-gray-500 mt-1">Blockchain-Enabled ERP & CRM System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Tab Switcher */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setMode('demo')}
              className={clsx(
                'flex-1 py-4 text-sm font-medium transition-colors',
                mode === 'demo'
                  ? 'text-primary-600 bg-primary-50 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              Demo Access
            </button>
            <button
              onClick={() => setMode('login')}
              className={clsx(
                'flex-1 py-4 text-sm font-medium transition-colors',
                mode === 'login'
                  ? 'text-primary-600 bg-primary-50 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              Login
            </button>
          </div>

          <div className="p-6">
            {mode === 'login' ? (
              /* Login Form */
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>

                <p className="text-center text-sm text-gray-500">
                  Demo credentials: any registered email with any password
                </p>
              </form>
            ) : (
              /* Demo Role Selection */
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-4">
                  Select a role to explore the system with different permission levels:
                </p>

                {availableRoles.map((role) => {
                  const info = roleInfo[role];
                  const Icon = info.icon;
                  
                  return (
                    <button
                      key={role}
                      onClick={() => handleDemoLogin(role)}
                      disabled={isLoading}
                      className={clsx(
                        'w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all hover:shadow-md disabled:opacity-50',
                        info.color
                      )}
                    >
                      <div className="p-2 bg-white/50 rounded-lg">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold capitalize">{role}</p>
                        <p className="text-sm opacity-80">{info.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 mt-6">
          © 2026 BlockERP. Capstone Project Demo.
        </p>
      </div>
    </div>
  );
}
