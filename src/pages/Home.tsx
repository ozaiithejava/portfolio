import { Hero } from '../components/Hero';
import { About, Contact } from '../components/AboutContact';
import { Skills } from '../components/Skills';
import { Projects } from '../components/Projects';
import { BackgroundFlow } from '../components/BackgroundFlow';

export function Home() {
    return (
        <>
            <main className="flex flex-col w-full relative z-10">
                <Hero />
                <About />
                <Skills />
                <Projects />
                <Contact />
            </main>
            <BackgroundFlow />
            {/* Ambient Glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]" />
            </div>
        </>
    );
}
