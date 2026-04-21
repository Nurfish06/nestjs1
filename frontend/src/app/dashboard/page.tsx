'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { 
  Upload, 
  Mail, 
  Cpu, 
  Database, 
  Users, 
  LogOut, 
  Loader2, 
  CheckCircle2, 
  FileText,
  Clock
} from 'lucide-react';

export default function DashboardPage() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [taskLoading, setTaskLoading] = useState(null);
  const [helloMessage, setHelloMessage] = useState('');
  const [cacheLoading, setCacheLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
    testCache();
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await api.get('/api/users');
      setUsers(res.data);
    } catch (err) {
      toast.error('Failed to fetch users. Access Denied?');
      if (err.response?.status === 401) router.push('/login');
    } finally {
      setLoadingUsers(false);
    }
  };

  const testCache = async () => {
    setCacheLoading(true);
    try {
      const res = await api.get('/');
      setHelloMessage(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setCacheLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('File uploaded and scanned successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const triggerTask = async (type: 'heavy' | 'email') => {
    setTaskLoading(type);
    try {
      if (type === 'heavy') {
        await api.post('/background-tasks/heavy', { name: 'Dashboard Task', timestamp: new Date() });
      } else {
        await api.post('/background-tasks/email', { email: 'user@example.com', name: 'Dashboard User' });
      }
      toast.success(`${type === 'heavy' ? 'Heavy task' : 'Email'} queued successfully!`);
    } catch (err) {
      toast.error('Failed to trigger task');
    } finally {
      setTaskLoading(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
    toast.success('Logged out');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-12">
      {/* Header */}
      <nav className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Portfolio Admin</span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: System Status & Cache */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Redis Caching
                </h3>
                <button 
                  onClick={testCache} 
                  className="text-xs bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded transition-colors"
                >
                  Refresh
                </button>
              </div>
              <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 relative overflow-hidden">
                {cacheLoading && (
                  <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 text-base">Backend Message:</span>
                  <span className="text-emerald-500 font-medium text-base">{helloMessage || 'Loading...'}</span>
                </div>
                <p className="mt-2 text-xs text-zinc-500">Served from Redis (30s TTL)</p>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Upload className="w-5 h-5 text-purple-500" />
                Secure Upload
              </h3>
              <div className="space-y-4">
                <label className="group relative block w-full aspect-video border-2 border-dashed border-zinc-800 hover:border-purple-500/50 rounded-2xl bg-zinc-950/50 transition-all cursor-pointer overflow-hidden">
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileUpload}
                    accept=".jpg,.jpeg,.png,.pdf"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3">
                    {uploading ? (
                      <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-zinc-600 group-hover:text-purple-500 transition-colors" />
                        <span className="text-sm text-zinc-500">Images or PDF (max 5MB)</span>
                      </>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Tasks & Users */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-orange-500" />
                Background Processing (Bull MQ)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => triggerTask('heavy')}
                  disabled={taskLoading !== null}
                  className="flex items-center justify-between p-4 bg-zinc-950/50 border border-zinc-800 hover:border-orange-500/50 rounded-xl transition-all group"
                >
                  <div className="flex items-center space-x-3 text-base">
                    <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                      <Cpu className="w-6 h-6 text-orange-500" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold">Heavy Task</p>
                      <p className="text-xs text-zinc-500 italic">5s simulated load</p>
                    </div>
                  </div>
                  {taskLoading === 'heavy' ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5 text-zinc-800 group-hover:text-orange-500/30" />}
                </button>

                <button 
                  onClick={() => triggerTask('email')}
                  disabled={taskLoading !== null}
                  className="flex items-center justify-between p-4 bg-zinc-950/50 border border-zinc-800 hover:border-blue-500/50 rounded-xl transition-all group"
                >
                  <div className="flex items-center space-x-3 text-base">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                      <Mail className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold">Send Mail</p>
                      <p className="text-xs text-zinc-500 italic">Background worker</p>
                    </div>
                  </div>
                  {taskLoading === 'email' ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5 text-zinc-800 group-hover:text-blue-500/30" />}
                </button>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-500" />
                  System Users
                </h3>
                <span className="text-xs bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full border border-emerald-500/20">
                  {users.length} Total
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500">User</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500">Role</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {loadingUsers ? (
                      [1,2,3].map(i => (
                        <tr key={i} className="animate-pulse">
                          <td colSpan={3} className="py-4 px-4 h-12 bg-zinc-800/20 rounded-lg mb-2 block"></td>
                        </tr>
                      ))
                    ) : (
                      users.map((user: any) => (
                        <tr key={user.id} className="hover:bg-zinc-850 transition-colors transition-all">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3 text-base">
                              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-400">
                                {user.name[0]?.toUpperCase()}
                              </div>
                              <span className="font-medium">{user.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-base">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-amber-500/10 text-amber-500' : 'bg-zinc-800 text-zinc-400'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-base">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 rounded-full bg-emerald-500" />
                              <span className="text-zinc-500 text-sm">Active</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
