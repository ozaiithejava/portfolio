import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Section } from "./Section";
import {
    Github,
    Mail,
    Linkedin,
    Twitter,
    Sparkles,
    ArrowUpRight,
    Star,
    GitFork,
    TerminalSquare,
    Activity,
    Cpu,
} from "lucide-react";

/** ---------- Minimal Typewriter ---------- */
function useTypeLines(lines: string[], speed = 22, pause = 800) {
    const [lineIndex, setLineIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [rendered, setRendered] = useState<string[]>(() =>
        new Array(lines.length).fill("")
    );
    const [phase, setPhase] = useState<"typing" | "hold" | "deleting">("typing");

    useEffect(() => {
        const current = lines[lineIndex] ?? "";

        const t = setTimeout(() => {
            if (phase === "typing") {
                const nextChar = charIndex + 1;
                setRendered((prev) => {
                    const copy = [...prev];
                    copy[lineIndex] = current.slice(0, nextChar);
                    return copy;
                });

                if (nextChar >= current.length) {
                    setPhase("hold");
                } else {
                    setCharIndex(nextChar);
                }
            } else if (phase === "hold") {
                setPhase("deleting");
            } else {
                const nextChar = Math.max(charIndex - 1, 0);
                setRendered((prev) => {
                    const copy = [...prev];
                    copy[lineIndex] = current.slice(0, nextChar);
                    return copy;
                });

                if (nextChar <= 0) {
                    setPhase("typing");
                    setCharIndex(0);
                    setLineIndex((i) => (i + 1) % lines.length);
                    setRendered(new Array(lines.length).fill(""));
                } else {
                    setCharIndex(nextChar);
                }
            }
        }, phase === "hold" ? pause : phase === "deleting" ? Math.max(12, speed - 8) : speed);

        return () => clearTimeout(t);
    }, [lines, lineIndex, charIndex, phase, speed, pause]);

    return rendered;
}

/** ---------- UI Bits ---------- */
function Badge({
    label,
    value,
    icon: Icon,
}: {
    label: string;
    value: string;
    icon: React.ElementType;
}) {
    return (
        <motion.div
            whileHover={{ y: -2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                 bg-card/20 backdrop-blur-md border border-white/10
                 text-muted-foreground hover:text-foreground transition-colors"
        >
            <Icon className="w-4 h-4 opacity-80" />
            <span className="text-xs font-mono uppercase tracking-wider opacity-70">
                {label}
            </span>
            <span className="font-mono text-sm font-semibold">{value}</span>
        </motion.div>
    );
}

function ReadmeHero() {
    const lines = useMemo(
        () => [
            "Java Developer • Minecraft Ecosystem",
            "Netty • MCP/Forge • Spigot/Paper",
            "Modern UI • Performance-first • Clean architecture",
        ],
        []
    );
    const typed = useTypeLines(lines, 18, 950);

    return (
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-card/10 backdrop-blur-md">
            {/* Minimal header */}
            <div className="relative p-7 sm:p-9">
                {/* subtle gradient wash */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.22]"
                    style={{
                        background:
                            "radial-gradient(900px circle at 15% 10%, rgba(59,130,246,0.25), transparent 60%)," +
                            "radial-gradient(700px circle at 85% 20%, rgba(168,85,247,0.20), transparent 58%)," +
                            "radial-gradient(800px circle at 40% 95%, rgba(34,197,94,0.16), transparent 60%)",
                    }}
                />
                <div className="pointer-events-none absolute inset-0 bg-grid-white/[0.02]" />

                <div className="relative">
                    <div className="flex items-center gap-2 text-primary/90 font-mono text-xs tracking-widest uppercase">
                        <Sparkles className="w-4 h-4" />
                        Readme
                    </div>

                    <div className="mt-3 flex items-end justify-between gap-6">
                        <div>
                            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">
                                ozaii
                            </h3>
                            <p className="text-muted-foreground mt-1">
                                Backend • Minecraft • performance
                            </p>
                        </div>

                        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground font-mono">
                            <span className="px-3 py-1 rounded-full border border-white/10 bg-card/20">
                                @ozaiithejava
                            </span>
                        </div>
                    </div>

                    {/* terminal */}
                    <div className="mt-6 rounded-[1.5rem] bg-secondary/15 border border-white/10 p-5">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-3">
                            <TerminalSquare className="w-4 h-4" />
                            terminal
                        </div>

                        <div className="space-y-2 font-mono text-sm">
                            {lines.map((_, i) => (
                                <div key={i} className="flex items-start gap-2">
                                    <span className="text-muted-foreground/70 select-none">$</span>
                                    <span className="text-foreground">
                                        {typed[i] || ""}
                                        <motion.span
                                            className="inline-block w-[8px] ml-1"
                                            animate={{ opacity: [0, 1, 0] }}
                                            transition={{ duration: 0.9, repeat: Infinity }}
                                        >
                                            ▋
                                        </motion.span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* badges */}
                    <div className="mt-6 flex flex-wrap gap-3">
                        <Badge label="Main" value="Java" icon={Cpu} />
                        <Badge label="Zone" value="MCP • Spigot" icon={Activity} />
                        <Badge label="Profile" value="@ozaiithejava" icon={Github} />
                    </div>
                </div>
            </div>
        </div>
    );
}

/** ---------- About + Contact (minimal) ---------- */

export function About() {
    return (
        <Section id="about" className="relative py-24 overflow-hidden">
            <div className="max-w-6xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.55 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                        About
                    </h2>
                    <div className="h-1 w-16 bg-primary mx-auto rounded-full mt-4" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.55 }}
                >
                    <ReadmeHero />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <ReadmeCard
                        title="What I build"
                        subtitle="Minecraft ecosystem & backend"
                        bullets={[
                            "MCP/Forge (client) — ClickGUI, profiles, HUD, cosmetics",
                            "Spigot/Paper (server) — gameplay systems, perf tuning",
                            "Netty & packets — low latency, minimal allocations",
                        ]}
                        icon={GitFork}
                    />
                    <ReadmeCard
                        title="How I work"
                        subtitle="performance-first + clean patterns"
                        bullets={[
                            "Caching & pre-rendering to avoid per-frame cost",
                            "Service patterns (start/stop/restart) for integrations",
                            "Readable code with maintainable structure",
                        ]}
                        icon={Star}
                    />
                </div>
            </div>
        </Section>
    );
}

function ReadmeCard({
    title,
    subtitle,
    bullets,
    icon: Icon,
}: {
    title: string;
    subtitle: string;
    bullets: string[];
    icon: React.ElementType;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="rounded-[2rem] border border-white/10 bg-card/10 backdrop-blur-md overflow-hidden"
        >
            <div className="p-7">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="text-xs font-mono tracking-widest uppercase text-muted-foreground">
                            {subtitle}
                        </div>
                        <h3 className="text-2xl font-bold mt-1">{title}</h3>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                        <Icon className="w-6 h-6 text-muted-foreground" />
                    </div>
                </div>

                <ul className="mt-5 space-y-2 text-muted-foreground leading-relaxed">
                    {bullets.map((b) => (
                        <li key={b} className="flex gap-3">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-muted-foreground/50 flex-shrink-0" />
                            <span>{b}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
}

export function Contact() {
    return (
        <Section id="contact" className="py-24 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50" />

            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="rounded-[2.5rem] border border-white/10 bg-card/30 backdrop-blur-2xl overflow-hidden p-8 md:p-12 text-center"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-mono text-xs tracking-widest uppercase mb-6">
                        <Sparkles className="w-4 h-4" />
                        Available for hire
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Let's Work Together
                    </h2>

                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                        Building high-performance Minecraft backends or scalable server architectures?
                        Let's discuss how we can elevate your project.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        <SocialPill
                            href="mailto:ozaiithejava@gmail.com"
                            label="Email Me"
                            icon={Mail}
                            primary
                        />
                        <SocialPill
                            href="https://github.com/ozaiithejava"
                            label="GitHub"
                            icon={Github}
                        />
                        <SocialPill
                            href="https://linkedin.com"
                            label="LinkedIn"
                            icon={Linkedin}
                        />
                        <SocialPill
                            href="https://twitter.com"
                            label="Twitter"
                            icon={Twitter}
                        />
                    </div>

                    <div className="pt-8 border-t border-white/5 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground/60 font-mono">
                        <span className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Online & Ready
                        </span>
                        <span>Located in Turkey</span>
                        <span>Timezone: GMT+3</span>
                    </div>
                </motion.div>
            </div>
        </Section>
    );
}

function SocialPill({
    href,
    label,
    icon: Icon,
    primary = false,
}: {
    href: string;
    label: string;
    icon: React.ElementType;
    primary?: boolean;
}) {
    return (
        <motion.a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className={`
                group inline-flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300
                ${primary
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 border border-primary/20"
                    : "bg-surface border border-white/10 hover:border-white/20 hover:bg-white/5 text-muted-foreground hover:text-foreground"}
            `}
        >
            <Icon className={`w-5 h-5 ${primary ? "animate-pulse" : "opacity-70 group-hover:opacity-100"}`} />
            <span className="font-semibold tracking-wide">{label}</span>
            {!primary && <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />}
        </motion.a>
    );
}
