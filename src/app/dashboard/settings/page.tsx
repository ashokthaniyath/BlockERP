'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { Button, Input } from '@/components/ui';
import { PageLoader } from '@/components/ui';
import {
  User,
  Shield,
  Bell,
  Palette,
  Database,
  Lock,
  Save,
  CheckCircle2,
  Moon,
  Sun,
} from 'lucide-react';
import clsx from 'clsx';

export default function SettingsPage() {
  const { user } = useAuth();
  const { addNotification, isLoading } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'appearance' | 'security' | 'system'>('profile');
  const [saving, setSaving] = useState(false);

  // Profile settings
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Demo User',
    email: user?.email || 'demo@example.com',
    phone: '+1 (555) 123-4567',
    department: 'Operations',
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    orderAlerts: true,
    stockAlerts: true,
    paymentAlerts: true,
    weeklyReports: false,
  });

  // Appearance settings
  const [appearance, setAppearance] = useState({
    theme: 'light',
    sidebarCollapsed: false,
    compactMode: false,
  });

  if (isLoading) {
    return <PageLoader />;
  }

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);

    addNotification({
      type: 'success',
      title: 'Settings Saved',
      message: 'Your preferences have been updated successfully.',
    });
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'system', label: 'System', icon: Database },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={clsx(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors',
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Profile Settings</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Update your personal information
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-700">
                    {profileData.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{profileData.name}</p>
                  <p className="text-sm text-gray-500">{user?.role || 'Admin'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                />
                <Input
                  label="Email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                />
                <Input
                  label="Phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />
                <Input
                  label="Department"
                  value={profileData.department}
                  onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <Button
                  leftIcon={saving ? undefined : <Save className="w-4 h-4" />}
                  onClick={handleSave}
                  isLoading={saving}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Choose how you want to be notified
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                  { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive browser push notifications' },
                  { key: 'orderAlerts', label: 'Order Alerts', desc: 'Get notified about new orders' },
                  { key: 'stockAlerts', label: 'Low Stock Alerts', desc: 'Get notified when stock is low' },
                  { key: 'paymentAlerts', label: 'Payment Alerts', desc: 'Get notified about payment status' },
                  { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Receive weekly summary reports' },
                ].map((setting) => (
                  <div
                    key={setting.key}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{setting.label}</p>
                      <p className="text-sm text-gray-500">{setting.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notificationSettings[setting.key as keyof typeof notificationSettings]}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            [setting.key]: e.target.checked,
                          })
                        }
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <Button
                  leftIcon={saving ? undefined : <Save className="w-4 h-4" />}
                  onClick={handleSave}
                  isLoading={saving}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Appearance</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Customize the look and feel
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
                  <div className="flex gap-4">
                    {[
                      { id: 'light', label: 'Light', icon: Sun },
                      { id: 'dark', label: 'Dark', icon: Moon },
                    ].map((theme) => {
                      const Icon = theme.icon;
                      return (
                        <button
                          key={theme.id}
                          onClick={() => setAppearance({ ...appearance, theme: theme.id })}
                          className={clsx(
                            'flex items-center gap-3 px-6 py-4 rounded-lg border-2 transition-colors',
                            appearance.theme === theme.id
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          )}
                        >
                          <Icon className={clsx(
                            'w-5 h-5',
                            appearance.theme === theme.id ? 'text-primary-600' : 'text-gray-500'
                          )} />
                          <span className={clsx(
                            'font-medium',
                            appearance.theme === theme.id ? 'text-primary-700' : 'text-gray-700'
                          )}>
                            {theme.label}
                          </span>
                          {appearance.theme === theme.id && (
                            <CheckCircle2 className="w-4 h-4 text-primary-600 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Compact Mode</p>
                    <p className="text-sm text-gray-500">Reduce spacing and padding</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={appearance.compactMode}
                      onChange={(e) =>
                        setAppearance({ ...appearance, compactMode: e.target.checked })
                      }
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <Button
                  leftIcon={saving ? undefined : <Save className="w-4 h-4" />}
                  onClick={handleSave}
                  isLoading={saving}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Manage your account security
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Password</p>
                      <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                    </div>
                    <Button variant="outline" size="sm">Change Password</Button>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline" size="sm">Enable 2FA</Button>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Active Sessions</p>
                      <p className="text-sm text-gray-500">1 active session</p>
                    </div>
                    <Button variant="outline" size="sm">View Sessions</Button>
                  </div>
                </div>

                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-red-700">Delete Account</p>
                      <p className="text-sm text-red-500">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="danger" size="sm">Delete</Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* System Tab */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">System Information</h2>
                <p className="text-sm text-gray-500 mt-1">
                  View system details and status
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Application Version</p>
                  <p className="font-medium text-gray-900">v1.0.0 (Demo)</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Environment</p>
                  <p className="font-medium text-gray-900">Development</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Blockchain Network</p>
                  <p className="font-medium text-blockchain-600">Simulated (Demo Mode)</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">API Status</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <p className="font-medium text-green-600">Connected</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blockchain-50 rounded-lg border border-blockchain-200">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-5 h-5 text-blockchain-600" />
                  <h3 className="font-medium text-blockchain-700">Blockchain Integration</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-blockchain-500">Network</p>
                    <p className="font-medium text-blockchain-700">Simulated Ethereum</p>
                  </div>
                  <div>
                    <p className="text-blockchain-500">Latest Block</p>
                    <p className="font-mono text-blockchain-700">#18,245,891</p>
                  </div>
                  <div>
                    <p className="text-blockchain-500">Smart Contract</p>
                    <p className="font-mono text-blockchain-700 text-xs">0x742d...3a71</p>
                  </div>
                  <div>
                    <p className="text-blockchain-500">Transactions Today</p>
                    <p className="font-medium text-blockchain-700">247</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-700">
                  <strong>Demo Mode:</strong> This is a demonstration system with simulated data. 
                  All blockchain transactions are mock transactions for demonstration purposes.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
