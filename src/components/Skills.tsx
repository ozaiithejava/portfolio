import { useMemo, useState } from "react";
import type React from "react";
import { motion } from "framer-motion";
import { Section } from "./Section";
import { cn } from "../lib/utils";
import {
    Box,
    ScrollText,
    Layers,
    Server,
    Database,
    PlugZap,
    Blocks,
    Wrench,
    Braces,
    ShieldCheck,
} from "lucide-react";

// Types
interface TechItem {
    name: string;
    level: number; // 0-100
    color: string;
    iconSlug?: string; // for simple-icons
    details?: string;
    lucideIcon?: React.ElementType; // Fallback if no brand icon
}

interface LanguageGroup {
    language: TechItem;
    startDate: Date;
    libs: TechItem[];
}

// Helper for duration (more accurate than day/365/30)
function getDuration(startDate: Date): string {
    const now = new Date();
    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();

    if (months < 0) {
        years -= 1;
        months += 12;
    }

    if (years <= 0) return `${Math.max(months, 0)}m`;
    if (months === 0) return `${years}y`;
    return `${years}y ${months}m`;
}

// Component to render a single icon (CDN or Lucide)
function TechIcon({
    slug,
    color,
    LucideIcon,
    className,
}: {
    slug?: string;
    color: string;
    LucideIcon?: React.ElementType;
    className?: string;
}) {
    const [error, setError] = useState(false);

    if (slug && !error) {
        const safeColor = color.replace("#", "");
        return (
            <img
                src={`https://cdn.simpleicons.org/${slug}/${safeColor}`}
                alt={slug}
                className={cn("object-contain", className)}
                loading="lazy"
                onError={() => setError(true)}
            />
        );
    }

    if (LucideIcon) {
        return <LucideIcon className={className} style={{ color }} />;
    }

    return <Layers className={className} style={{ color }} />;
}

// Data Definition (senin profile göre)
const TECH_STACK: LanguageGroup[] = [
    {
        // JAVA (main)
        startDate: new Date("2019-01-01"),
        language: { name: "Java", level: 99, color: "#e36209", iconSlug: "java" },
        libs: [
            {
                name: "Spigot / Bukkit",
                level: 100,
                color: "#ea9c20",
                lucideIcon: Box,
                details: "Minecraft Server API",
            },
            {
                name: "MCP / Forge",
                level: 96,
                color: "#2ea043",
                iconSlug: "minecraftforge",
                details: "Client modding (1.8.x+)",
            },
            {
                name: "Netty",
                level: 96,
                color: "#1d71b8",
                lucideIcon: PlugZap,
                details: "High-perf networking",
            },
            {
                name: "Spring Boot",
                level: 92,
                color: "#6db33f",
                iconSlug: "springboot",
                details: "Backend & REST",
            },
            {
                name: "Gradle",
                level: 92,
                color: "#02303a",
                iconSlug: "gradle",
                details: "Build & tooling",
            },
            {
                name: "Maven",
                level: 85,
                color: "#c71a36",
                iconSlug: "apachemaven",
                details: "Build & deps",
            },
            {
                name: "SLF4J",
                level: 95,
                color: "#d93025",
                lucideIcon: ScrollText,
                details: "Logging facade",
            },
        ],
    },
    {
        // Kotlin (server/plugin tarafında)
        startDate: new Date("2021-01-01"),
        language: {
            name: "Kotlin",
            level: 88,
            color: "#7f52ff",
            iconSlug: "kotlin",
        },
        libs: [
            {
                name: "Kotlin JVM",
                level: 88,
                color: "#7f52ff",
                iconSlug: "kotlin",
                details: "Modern JVM",
            },
            {
                name: "Plugin Dev",
                level: 86,
                color: "#ea9c20",
                lucideIcon: Server,
                details: "Spigot plugins",
            },
        ],
    },
    {
        // Node.js / TS (tooling, script, panel, bot vs)
        startDate: new Date("2020-06-01"),
        language: {
            name: "Node.js",
            level: 86,
            color: "#68a063",
            iconSlug: "nodedotjs",
        },
        libs: [
            {
                name: "TypeScript",
                level: 82,
                color: "#3178c6",
                iconSlug: "typescript",
                details: "Safer JS",
            },
            {
                name: "JavaScript",
                level: 85,
                color: "#f7df1e",
                iconSlug: "javascript",
                details: "Tooling",
            },
            {
                name: "REST / Fetch",
                level: 80,
                color: "#10b981",
                lucideIcon: Braces,
                details: "APIs & automation",
            },
        ],
    },
    {
        // Python (yardımcı araçlar)
        startDate: new Date("2021-01-01"),
        language: {
            name: "Python",
            level: 78,
            color: "#3776ab",
            iconSlug: "python",
        },
        libs: [
            {
                name: "Automation",
                level: 78,
                color: "#3776ab",
                lucideIcon: Wrench,
                details: "Scripts & tooling",
            },
        ],
    },
    {
        // Rust (öğrenme / sistem işleri)
        startDate: new Date("2024-01-01"),
        language: { name: "Rust", level: 55, color: "#000000", iconSlug: "rust" },
        libs: [
            {
                name: "Systems",
                level: 55,
                color: "#111827",
                lucideIcon: ShieldCheck,
                details: "Learning & practice",
            },
        ],
    },
];

// OPTIONAL: “Platform / Tools” gibi bir grup daha istersen ekleyebilirsin
const PLATFORM_STACK: LanguageGroup[] = [
    {
        startDate: new Date("2020-01-01"),
        language: {
            name: "Platform",
            level: 90,
            color: "#a855f7",
            lucideIcon: Blocks,
        },
        libs: [
            {
                name: "Git",
                level: 90,
                color: "#f05032",
                iconSlug: "git",
                details: "Version control",
            },
            {
                name: "Docker",
                level: 78,
                color: "#2496ed",
                iconSlug: "docker",
                details: "Containers",
            },
            {
                name: "MySQL",
                level: 80,
                color: "#4479a1",
                iconSlug: "mysql",
                details: "Database",
            },
            {
                name: "PostgreSQL",
                level: 72,
                color: "#4169e1",
                iconSlug: "postgresql",
                details: "Database",
            },
            {
                name: "Redis",
                level: 70,
                color: "#dc382d",
                iconSlug: "redis",
                details: "Cache / pubsub",
            },
            {
                name: "DB Design",
                level: 78,
                color: "#22c55e",
                lucideIcon: Database,
                details: "Schema & perf",
            },
        ],
    },
];

export function Skills() {
    // Tek liste istersen birleştir:
    const STACK = useMemo(() => [...TECH_STACK, ...PLATFORM_STACK], []);

    return (
        <Section id="skills" className="relative py-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-20 relative z-10"
            >
                <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                    Tech Ecosystem
                </h2>
                <div className="h-1 w-20 bg-primary mx-auto rounded-full mb-4" />
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Java & Minecraft-focused stack — with supporting tooling.
                </p>
            </motion.div>

            <div className="flex flex-col gap-8 max-w-5xl mx-auto relative z-10">
                {STACK.map((group, groupIndex) => (
                    <motion.div
                        key={group.language.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: groupIndex * 0.08 }}
                        className="group relative p-8 rounded-[2rem] bg-card/30 backdrop-blur-md border border-white/5 hover:border-white/10 transition-all overflow-hidden"
                    >
                        {/* Ambient Glow */}
                        <div
                            className="absolute -top-24 -right-24 w-64 h-64 blur-[80px] rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
                            style={{ backgroundColor: group.language.color }}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8 items-start">
                            {/* Left Column: Language Info */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-2xl bg-secondary/30 border border-white/5">
                                        <TechIcon
                                            slug={group.language.iconSlug}
                                            color={group.language.color}
                                            LucideIcon={group.language.lucideIcon}
                                            className="w-10 h-10"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold">{group.language.name}</h3>
                                        <span
                                            className="text-sm font-semibold tracking-wider"
                                            style={{ color: group.language.color }}
                                        >
                                            {getDuration(group.startDate)}
                                        </span>
                                    </div>
                                </div>

                                {/* Proficiency Bar */}
                                <div className="space-y-1 mt-2">
                                    <div className="flex justify-between text-xs text-muted-foreground uppercase tracking-wider">
                                        <span>Mastery</span>
                                        <span>{group.language.level}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full rounded-full shadow-[0_0_10px_currentColor]"
                                            style={{
                                                backgroundColor: group.language.color,
                                                color: group.language.color,
                                            }}
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${group.language.level}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1, delay: 0.25 }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Libraries & Frameworks */}
                            <div className="relative">
                                {group.libs.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {group.libs.map((lib, i) => (
                                            <motion.div
                                                key={lib.name}
                                                initial={{ opacity: 0, x: -10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.35 + i * 0.07 }}
                                                className="flex items-center gap-3 p-3 rounded-xl bg-secondary/20 border border-white/5 hover:bg-secondary/40 transition-colors"
                                                title={lib.details ?? lib.name}
                                            >
                                                <div className="p-2 rounded-lg bg-background/50">
                                                    <TechIcon
                                                        slug={lib.iconSlug}
                                                        color={lib.color}
                                                        LucideIcon={lib.lucideIcon}
                                                        className="w-6 h-6"
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-sm">{lib.name}</span>
                                                    {lib.details && (
                                                        <span className="text-[10px] text-muted-foreground uppercase">
                                                            {lib.details}
                                                        </span>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-full flex items-center">
                                        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </Section>
    );
}
