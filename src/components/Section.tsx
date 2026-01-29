import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "../lib/utils";

interface SectionProps extends HTMLMotionProps<"section"> {
    id: string;
    children: React.ReactNode;
    className?: string; // Explicitly kept for clarity, though HTMLMotionProps has it
}

export function Section({ id, children, className, ...props }: SectionProps) {
    return (
        <motion.section
            id={id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={cn("min-h-screen w-full flex flex-col justify-center items-center px-4 md:px-10 py-20", className)}
            {...props}
        >
            {children}
        </motion.section>
    );
}
