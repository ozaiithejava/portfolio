import { useState } from 'react';
import { useTheme, type Theme } from '../context/ThemeContext';
import { Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function FloatingThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const themes: Theme[] = ['light', 'obsidian', 'cyber', 'neon', 'graphite', 'velocity', 'forest'];

    return (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end gap-2">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="p-3 rounded-full bg-background/50 backdrop-blur-md border border-border shadow-lg hover:shadow-xl transition-all"
            >
                <Palette className="w-6 h-6" />
                <span className="sr-only">Toggle Theme Menu</span>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.8 }}
                        className="absolute right-14 top-0 flex flex-col gap-2 p-2 rounded-2xl bg-card/80 backdrop-blur-xl border border-border shadow-2xl"
                    >
                        {themes.map((t) => (
                            <button
                                key={t}
                                onClick={() => setTheme(t)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all text-right
                                    ${theme === t ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'}
                                `}
                            >
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
