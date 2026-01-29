import type React from "react";
import {
    motion,
    useMotionTemplate,
    useMotionValue,
    useSpring,
    useTransform,
} from "framer-motion";
import {
    ExternalLink,
    Github,
    Star,
    History,
    FolderGit2,
    Shield,
    Cpu,
    Code2,
    Boxes,
    Zap,
} from "lucide-react";
import { Section } from "./Section";
import { cn } from "../lib/utils";

interface Project {
    repo: string;          // owner/name
    title: string;         // display title
    description: string;   // short summary
    tags: string[];
    githubUrl: string;
    demoUrl?: string;

    gradient: string;      // tailwind: "from-x to-y"
    accent: string;        // hex for glow
    icon: React.ElementType;

    stars: number;
    lastUpdated: string;   // "Jan 27, 2026"
    readmePreview?: string;
}

const PROJECTS: Project[] = [
    {
        repo: "ozaiithejava/ozaiithejava",
        title: "GitHub Profile (README)",
        description:
            "My profile README repo — widgets, social links and live status sections.",
        tags: ["README", "Profile", "Badges", "Widgets"],
        githubUrl: "https://github.com/ozaiithejava/ozaiithejava",
        gradient: "from-sky-500 to-blue-700",
        accent: "#3b82f6",
        icon: FolderGit2,
        stars: 11,
        lastUpdated: "Jan 27, 2026",
        readmePreview:
            "Sections like “Currently Listening on Spotify” and “Currently Coding (Discord Presence)”.",
    },
    {
        repo: "ozaiithejava/Makcucolorbot",
        title: "Makcucolorbot (Fork)",
        description: "Forked project (Python).",
        tags: ["Python", "Fork", "Tooling"],
        githubUrl: "https://github.com/ozaiithejava/Makcucolorbot",
        gradient: "from-violet-500 to-fuchsia-700",
        accent: "#a855f7",
        icon: Cpu,
        stars: 0,
        lastUpdated: "Jan 3, 2026",
        readmePreview: "README present (see repo for full details).",
    },
    {
        repo: "ozaiithejava/visual-programming-Epsolides",
        title: "Visual Programming — Episodes",
        description: "C# learning / episode-based examples.",
        tags: ["C#", "Examples", "Learning"],
        githubUrl: "https://github.com/ozaiithejava/visual-programming-Epsolides",
        gradient: "from-emerald-500 to-green-700",
        accent: "#22c55e",
        icon: Code2,
        stars: 0,
        lastUpdated: "Dec 3, 2025",
        readmePreview: "README present (basic repository title).",
    },
    {
        repo: "ozaiithejava/AntiAFK",
        title: "AntiAFK (Fork)",
        description:
            "Minecraft servers için performans odaklı, çok katmanlı AntiAFK sistemi.",
        tags: ["Java", "Spigot", "Plugin", "Performance"],
        githubUrl: "https://github.com/ozaiithejava/AntiAFK",
        gradient: "from-orange-500 to-red-600",
        accent: "#f97316",
        icon: Shield,
        stars: 0,
        lastUpdated: "Sep 15, 2025",
        readmePreview:
            "4 katmanlı tespit yaklaşımı + captcha (Turing testi) gibi doğrulama mekanikleri.",
    },
];

import { useEffect, useState } from "react";
import { api } from "../lib/api";

// ... (existing imports)

export function Projects() {
    const [projects, setProjects] = useState<Project[]>(PROJECTS);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await api.getProjects();
                if (data && data.length > 0) {
                    // Map DB data to UI Project interface (adding visual flair)
                    const mapped = data.map((p: any, i: number) => ({
                        repo: p.repo_url.split('github.com/')[1] || "user/repo",
                        title: p.title,
                        description: p.description,
                        tags: p.tags,
                        githubUrl: p.repo_url,
                        demoUrl: p.demo_url,
                        gradient: PROJECTS[i % PROJECTS.length].gradient, // Cycle through existing gradients
                        accent: PROJECTS[i % PROJECTS.length].accent,
                        icon: PROJECTS[i % PROJECTS.length].icon,
                        stars: p.stats.CCU ? parseInt(p.stats.CCU) : 0, // Mock mapping
                        lastUpdated: "Recently",
                        readmePreview: p.stats.Latency ? `Performance: ${p.stats.Latency}` : undefined
                    }));
                    setProjects(mapped);
                }
            } catch (err) {
                console.error("Failed to load projects from backend, using static fallback.");
            }
        };
        fetchProjects();
    }, []);

    return (
        <Section id="projects" className="py-32">
            <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
                className="text-center mb-20"
            >
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Zap className="w-6 h-6 text-yellow-500 fill-yellow-500 animate-pulse" />
                    <span className="text-primary font-mono text-sm tracking-widest uppercase">
                        Selected Works
                    </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                    Featured Work
                </h2>
                <div className="h-1 w-20 bg-primary mx-auto rounded-full" />

                <p className="text-muted-foreground mt-5 max-w-2xl mx-auto">
                    Live from the database.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl px-4">
                {projects.map((project, index) => (
                    <ProjectCard key={project.repo + index} project={project} index={index} />
                ))}
            </div>
        </Section>
    );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rX = useSpring(useTransform(mouseY, [0, 320], [10, -10]), {
        stiffness: 140,
        damping: 18,
    });
    const rY = useSpring(useTransform(mouseX, [0, 520], [-10, 10]), {
        stiffness: 140,
        damping: 18,
    });

    const lift = useSpring(0, { stiffness: 220, damping: 20 });

    function handleMouseMove({
        currentTarget,
        clientX,
        clientY,
    }: React.MouseEvent) {
        const rect = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - rect.left);
        mouseY.set(clientY - rect.top);
    }

    const spotlight = useMotionTemplate`
    radial-gradient(
      700px circle at ${mouseX}px ${mouseY}px,
      rgba(255,255,255,0.14),
      transparent 72%
    )
  `;

    const borderGlow = useMotionTemplate`
    radial-gradient(
      520px circle at ${mouseX}px ${mouseY}px,
      ${hexToRgba(project.accent, 0.55)},
      transparent 70%
    )
  `;

    return (
        <motion.div
            initial={{ opacity: 0, y: 46 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: index * 0.06 }}
            className="relative"
            style={{ perspective: 900 }}
        >
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseEnter={() => lift.set(-10)}
                onMouseLeave={() => lift.set(0)}
                style={{ rotateX: rX, rotateY: rY, y: lift }}
                className="group relative rounded-[2rem] border border-white/10 bg-card/10 backdrop-blur-md overflow-hidden will-change-transform"
            >
                {/* Border glow */}
                <motion.div
                    className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 group-hover:opacity-100 transition duration-300"
                    style={{ background: borderGlow }}
                />

                {/* Spotlight */}
                <motion.div
                    className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 group-hover:opacity-100 transition duration-300"
                    style={{ background: spotlight }}
                />

                {/* Ambient blob */}
                <div
                    className="absolute -top-28 -right-28 h-64 w-64 rounded-full blur-[90px] opacity-10 group-hover:opacity-20 transition-opacity"
                    style={{ backgroundColor: project.accent }}
                />

                <div className="relative h-full p-8 flex flex-col">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                            <div
                                className={cn(
                                    "p-3 rounded-2xl bg-gradient-to-br shadow-inner ring-1 ring-white/10",
                                    project.gradient
                                )}
                            >
                                <project.icon className="w-6 h-6 text-white" />
                            </div>

                            <div className="flex flex-col">
                                <span className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
                                    {project.repo}
                                </span>
                                <div className="h-px w-28 bg-gradient-to-r from-transparent via-white/15 to-transparent mt-2" />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <IconLink href={project.githubUrl} title="View Code" icon={Github} />
                            {project.demoUrl && (
                                <IconLink href={project.demoUrl} title="Live Demo" icon={ExternalLink} />
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45, delay: 0.1 }}
                        className="mb-auto"
                    >
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                            {project.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed mb-5">
                            {project.description}
                        </p>

                        {project.readmePreview && (
                            <div className="rounded-2xl bg-secondary/20 border border-white/5 p-4">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-2">
                                    <Boxes className="w-4 h-4" />
                                    README.md
                                </div>
                                <p className="text-sm text-muted-foreground/90 leading-relaxed">
                                    {project.readmePreview}
                                </p>
                            </div>
                        )}
                    </motion.div>

                    {/* Meta row (stars + updated) */}
                    <div className="grid grid-cols-2 gap-4 mt-6 py-4 border-t border-b border-white/5">
                        <MetaStat icon={Star} label="Stars" value={String(project.stars)} />
                        <MetaStat icon={History} label="Updated" value={project.lastUpdated} />
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-6">
                        {project.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-3 py-1 text-xs font-medium rounded-full bg-white/5 border border-white/5 text-muted-foreground/80
                           hover:text-white hover:border-white/15 hover:bg-white/10 transition-colors"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Micro footer */}
                    <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground/70">
                        <FolderGit2 className="w-4 h-4" />
                        <span className="font-mono">repo showcase • hover-tilt • glow</span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

function IconLink({
    href,
    title,
    icon: Icon,
}: {
    href: string;
    title: string;
    icon: React.ElementType;
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-muted-foreground hover:text-white"
            title={title}
        >
            <Icon className="w-5 h-5" />
        </a>
    );
}

function MetaStat({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            className="flex items-center gap-3"
        >
            <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                <Icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    {label}
                </span>
                <span className="font-mono text-lg font-semibold text-foreground">
                    {value}
                </span>
            </div>
        </motion.div>
    );
}

function hexToRgba(hex: string, alpha: number) {
    const h = hex.replace("#", "").trim();
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
}
