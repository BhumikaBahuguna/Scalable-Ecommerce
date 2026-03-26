import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import { User, Mail, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuthStore();
  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Profile</h1>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-8">
        <div className="flex items-center gap-5 mb-8 pb-6" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl gradient-bg text-3xl font-bold text-white shadow-lg glow-brand">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{user.name}</h2>
            <span className={`badge mt-1 ${user.role === 'admin' ? 'badge-warning' : 'badge-info'}`}>
              {user.role.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { icon: User, label: 'Full Name', value: user.name, color: '#818cf8' },
            { icon: Mail, label: 'Email', value: user.email, color: '#a78bfa' },
            { icon: Shield, label: 'Role', value: user.role, color: '#22c55e' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="glass-light rounded-xl p-4 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: `${color}15`, color }}>
                <Icon size={20} />
              </div>
              <div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
                <p className="font-medium capitalize" style={{ color: 'var(--text-primary)' }}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
