import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Theme = 'light' | 'obsidian' | 'cyber' | 'neon' | 'graphite' | 'velocity' | 'forest';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEMES: Record<Theme, string> = {
    light: 'light',
    obsidian: 'obsidian',
    cyber: 'cyber',
    neon: 'neon',
    graphite: 'graphite',
    velocity: 'velocity',
    forest: 'forest',
};

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => {
        const stored = localStorage.getItem('theme') as Theme;
        return Object.keys(THEMES).includes(stored) ? stored : 'obsidian';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(...Object.values(THEMES));
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
