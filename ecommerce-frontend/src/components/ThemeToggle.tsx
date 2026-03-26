import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';

export default function ThemeToggle() {
  const { theme, toggle } = useThemeStore();

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggle}
      className="relative p-2 rounded-xl transition-colors"
      style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)' }}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'dark' ? (
          <Moon size={18} style={{ color: 'var(--text-secondary)' }} />
        ) : (
          <Sun size={18} style={{ color: '#f59e0b' }} />
        )}
      </motion.div>
    </motion.button>
  );
}
