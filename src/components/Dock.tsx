import { useRef } from "react";
import { type MotionValue, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useTheme, type Theme } from "../context/ThemeContext";

import {
    Home,
    Code2,
    Terminal,
    FolderGit2,
    Mail,
    Palette,
    Github,
    Linkedin,
    Twitter
} from "lucide-react";

export function Dock() {
    const mousex = useMotionValue(Infinity);
    const { theme, setTheme } = useTheme();

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 h-14 flex items-center gap-2 p-1.5 px-3 rounded-full bg-background/60 backdrop-blur-xl border border-border/30 shadow-2xl z-50">
            <DockIcon mousex={mousex} onClick={() => scrollToSection('home')} icon={<Home />} label="Home" />
            <DockIcon mousex={mousex} onClick={() => scrollToSection('about')} icon={<Terminal />} label="About" />
            <DockIcon mousex={mousex} onClick={() => scrollToSection('skills')} icon={<Code2 />} label="Skills" />
            <DockIcon mousex={mousex} onClick={() => scrollToSection('projects')} icon={<FolderGit2 />} label="Projects" />

            {/* Divider aligned with icons */}
            <div className="w-px h-8 bg-border/60 self-center mx-1" />

            <ThemeToggle mousex={mousex} theme={theme} setTheme={setTheme} />

            <div className="w-px h-8 bg-border/60 self-center mx-1" />

            {/* Socials & Contact */}
            <DockLink mousex={mousex} href="https://github.com" icon={<Github />} label="GitHub" />
            <DockLink mousex={mousex} href="https://linkedin.com" icon={<Linkedin />} label="LinkedIn" />
            <DockLink mousex={mousex} href="https://twitter.com" icon={<Twitter />} label="Twitter" />
            <DockIcon mousex={mousex} onClick={() => scrollToSection('contact')} icon={<Mail />} label="Contact" />
        </div>
    );
}

function DockIcon({ mousex, icon, onClick, label }: { mousex: MotionValue, icon: React.ReactNode, onClick?: () => void, label: string }) {
    const ref = useRef<HTMLDivElement>(null);

    const distance = useTransform(mousex, (val) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
    const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

    return (
        <motion.div
            ref={ref}
            style={{ width }}
            className="aspect-square w-10 rounded-full bg-transparent flex items-center justify-center cursor-pointer border border-transparent hover:bg-white/10 hover:border-white/20 transition-all group relative"
            onClick={onClick}
            onMouseMove={(e) => mousex.set(e.pageX)}
            onMouseLeave={() => mousex.set(Infinity)}
        >
            <div className="w-5 h-5 text-foreground/80 group-hover:text-foreground group-hover:scale-110 transition-all">
                {icon}
            </div>
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-border">
                {label}
            </span>
        </motion.div>
    );
}

function DockLink({ mousex, icon, href, label }: { mousex: MotionValue, icon: React.ReactNode, href: string, label: string }) {
    const ref = useRef<HTMLAnchorElement>(null);

    const distance = useTransform(mousex, (val) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
    const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

    return (
        <motion.a
            ref={ref}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ width }}
            className="aspect-square w-10 rounded-full bg-transparent flex items-center justify-center cursor-pointer border border-transparent hover:bg-white/10 hover:border-white/20 transition-all group relative"
            onMouseMove={(e) => mousex.set(e.pageX)}
            onMouseLeave={() => mousex.set(Infinity)}
        >
            <div className="w-5 h-5 text-foreground/80 group-hover:text-foreground group-hover:scale-110 transition-all">
                {icon}
            </div>
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-border">
                {label}
            </span>
        </motion.a>
    );
}

function ThemeToggle({ mousex, theme, setTheme }: { mousex: MotionValue, theme: Theme, setTheme: (t: Theme) => void }) {
    const themes: Theme[] = ['light', 'dark', 'intellij', 'dracula', 'cyberpunk', 'forest'];

    const cycleTheme = () => {
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex]);
    };

    return (
        <DockIcon
            mousex={mousex}
            onClick={cycleTheme}
            icon={<Palette />}
            label={`Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`}
        />
    );
}

function scrollToSection(id: string) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}
