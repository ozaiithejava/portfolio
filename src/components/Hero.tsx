import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
import { ArrowDown, Terminal, Database, Cpu } from "lucide-react";
import { Section } from "./Section";
import { cn } from "../lib/utils";
import { useEffect, useState } from "react";

function Typewriter({ text, delay = 0 }: { text: string, delay?: number }) {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => {
            let i = 0;
            const timer = setInterval(() => {
                if (i < text.length) {
                    setDisplayedText((prev) => prev + text.charAt(i));
                    i++;
                } else {
                    clearInterval(timer);
                }
            }, 50); // Typing speed
            return () => clearInterval(timer);
        }, delay * 1000);
        return () => clearTimeout(timeout);
    }, [text, delay]);

    return <span>{displayedText}</span>;
}

export function Hero() {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    // Mouse parallax effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        mouseX.set((clientX - left) / width - 0.5);
        mouseY.set((clientY - top) / height - 0.5);
    }

    return (
        <Section
            id="home"
            className="h-[100vh] flex flex-col justify-center items-center text-center relative overflow-hidden perspective-1000"
            onMouseMove={handleMouseMove}
        >
            {/* Dynamic Background Grid */}
            <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

            {/* Floating Abstract Elements */}
            <FloatingIcon icon={Terminal} className="top-[20%] left-[15%] text-primary/20 w-16 h-16" delay={0} />
            <FloatingIcon icon={Database} className="top-[60%] right-[15%] text-secondary-foreground/20 w-20 h-20" delay={2} />
            <FloatingIcon icon={Cpu} className="bottom-[20%] left-[20%] text-accent-foreground/10 w-12 h-12" delay={4} />

            <motion.div
                style={{ y: y1, opacity }}
                className="relative z-10 flex flex-col items-center gap-6 max-w-5xl px-4"
            >
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 backdrop-blur-md border border-border/50 text-sm font-medium text-primary mb-4"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    Available for New Projects
                </motion.div>

                {/* Main Title with Glitch/Hover Effect */}
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter relative z-20">
                    <SplitText text="Yigit" className="text-foreground" delay={0.2} />
                    <span className="text-primary mx-4">Oguz</span>
                </h1>

                {/* Subtitle / Role */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-2xl md:text-4xl font-light text-muted-foreground h-12"
                >
                    <span className="text-foreground font-semibold"><Typewriter text="Backend Engineer" delay={1.2} /></span>
                    <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="inline-block w-[2px] h-8 ml-1 align-middle bg-primary"
                    />
                </motion.div>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2, duration: 0.8 }}
                    className="text-lg md:text-xl text-muted-foreground/80 max-w-2xl mt-4 leading-relaxed"
                >
                    Architecting high-performance scalable systems.
                    <br className="hidden md:block" />
                    Specialized in <span className="text-foreground font-medium">Java Ecosystem</span>, <span className="text-foreground font-medium">Distributed Systems</span>, and <span className="text-foreground font-medium">Game Engines</span>.
                </motion.p>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.5, type: "spring" }}
                    className="flex flex-col sm:flex-row gap-4 mt-8"
                >
                    <CTAButton primary onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
                        View Projects
                    </CTAButton>
                    <CTAButton onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                        Contact Me
                    </CTAButton>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ delay: 3, duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer"
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
                <ArrowDown className="w-8 h-8 text-muted-foreground/50 hover:text-primary transition-colors" />
            </motion.div>
        </Section>
    );
}

function FloatingIcon({ icon: Icon, className, delay }: { icon: any, className?: string, delay: number }) {
    return (
        <motion.div
            className={cn("absolute pointer-events-none opacity-20", className)}
            animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0],
                opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay
            }}
        >
            <Icon className="w-full h-full" />
        </motion.div>
    );
}

function SplitText({ text, className, delay }: { text: string, className?: string, delay: number }) {
    return (
        <span className={className} aria-label={text}>
            {text.split("").map((char, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 100, rotateX: 90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{
                        duration: 0.8,
                        delay: delay + i * 0.1,
                        type: "spring",
                        damping: 12
                    }}
                    className="inline-block hover:text-primary transition-colors duration-300 transform hover:scale-110 cursor-default"
                >
                    {char}
                </motion.span>
            ))}
        </span>
    );
}

function CTAButton({ children, primary, onClick }: { children: React.ReactNode, primary?: boolean, onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group",
                primary
                    ? "bg-primary text-primary-foreground shadow-lg hover:shadow-primary/50"
                    : "bg-transparent text-foreground border border-border hover:bg-secondary/50 hover:border-primary/50"
            )}
        >
            <span className="relative z-10">{children}</span>
            {primary && (
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            )}
        </button>
    );
}
