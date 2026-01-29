import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export function BackgroundFlow() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = 0;
        let height = 0;

        // Configuration
        const gridSize = 40; // Size of the grid cells
        const packetCount = 40; // Number of active data packets
        const speed = 2; // Movement speed (pixels per frame)

        // Theme colors retrieval
        const getThemeColors = () => {
            const style = getComputedStyle(document.documentElement);
            const primary = style.getPropertyValue('--primary') || '210 100% 50%';
            const accent = style.getPropertyValue('--accent') || '150 100% 50%';
            return {
                primary: `hsl(${primary.trim()})`,
                accent: `hsl(${accent.trim()})`
            };
        };

        let colors = getThemeColors();

        class Packet {
            x: number;
            y: number;
            vx: number;
            vy: number;
            history: { x: number; y: number }[];
            maxHistory: number;
            color: string;
            dashOffset: number;
            dead: boolean;

            constructor(w: number, h: number) {
                // Snap to grid
                this.x = Math.floor(Math.random() * (w / gridSize)) * gridSize;
                this.y = Math.floor(Math.random() * (h / gridSize)) * gridSize;

                // Random cardinal direction
                const dir = Math.floor(Math.random() * 4);
                this.vx = dir === 0 ? speed : dir === 1 ? -speed : 0;
                this.vy = dir === 2 ? speed : dir === 3 ? -speed : 0;

                this.history = [];
                this.maxHistory = Math.floor(Math.random() * 20) + 10;

                // Randomize color between primary and accent (redish)
                this.color = Math.random() > 0.7 ? colors.accent : colors.primary;
                this.dashOffset = 0;
                this.dead = false;
            }

            update(w: number, h: number) {
                this.x += this.vx;
                this.y += this.vy;
                this.dashOffset -= speed; // Animate dashes

                this.history.push({ x: this.x, y: this.y });
                if (this.history.length > this.maxHistory) {
                    this.history.shift();
                }

                // Turn logic at grid intersections
                if (this.x % gridSize === 0 && this.y % gridSize === 0) {
                    if (Math.random() < 0.3) { // 30% chance to turn
                        const turn = Math.random() < 0.5 ? 1 : -1;
                        if (this.vx !== 0) {
                            this.vy = this.vx * turn;
                            this.vx = 0;
                        } else {
                            this.vx = this.vy * turn;
                            this.vy = 0;
                        }
                    }
                }

                // Bounds check - kill if out of bounds to respawn elsewhere
                if (this.x < -100 || this.x > w + 100 || this.y < -100 || this.y > h + 100) {
                    this.dead = true;
                }
            }

            draw(context: CanvasRenderingContext2D) {
                if (this.history.length < 2) return;

                context.beginPath();
                context.moveTo(this.history[0].x, this.history[0].y);
                for (let i = 1; i < this.history.length; i++) {
                    context.lineTo(this.history[i].x, this.history[i].y);
                }

                context.strokeStyle = this.color;
                context.lineWidth = 1.5;
                // Create dashed line effect
                context.setLineDash([5, 15]);
                context.lineDashOffset = this.dashOffset;
                context.stroke();

                // Draw "Head"
                context.setLineDash([]);
                context.fillStyle = this.color;
                context.beginPath();
                context.arc(this.x, this.y, 2, 0, Math.PI * 2);
                context.fill();

                // Occasional "Glitch" rect
                if (Math.random() < 0.05) {
                    context.fillStyle = this.color;
                    context.fillRect(this.x - 2, this.y - 2, 4, 4);
                }
            }
        }

        let packets: Packet[] = [];

        const init = () => {
            const dpr = window.devicePixelRatio || 1;
            width = window.innerWidth;
            height = window.innerHeight;

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            ctx.scale(dpr, dpr);

            packets = [];
            for (let i = 0; i < packetCount; i++) {
                packets.push(new Packet(width, height));
            }
            colors = getThemeColors();
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw faint grid dots for context
            ctx.fillStyle = colors.primary;
            ctx.globalAlpha = 0.05;
            for (let x = 0; x < width; x += gridSize) {
                for (let y = 0; y < height; y += gridSize) {
                    if (Math.random() > 0.95) ctx.fillRect(x - 1, y - 1, 2, 2);
                }
            }
            ctx.globalAlpha = 1;

            packets.forEach((p, index) => {
                p.update(width, height);
                p.draw(ctx);
                if (p.dead) {
                    packets[index] = new Packet(width, height);
                }
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        const handleResize = () => init();

        init();
        animate();

        window.addEventListener('resize', handleResize);
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, [theme]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ opacity: 0.25 }} // Slightly clearer than before
        />
    );
}
