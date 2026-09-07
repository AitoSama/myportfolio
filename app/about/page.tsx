"use client";

import { motion } from "framer-motion";
import WindowFrame from "@/components/WindowFrame";
import Image from "next/image";
import { PROFILE } from "@/lib/data";

export default function About() {
    return (
        <div className="min-h-screen pt-24 pb-20 container mx-auto px-6 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <WindowFrame title="profile.jpg" className="w-full">
                        <div className="aspect-[3/4] overflow-hidden bg-gray-50 relative">
                            <Image
                                src="/assets/image/cover-web.png"
                                alt="Artist Profile"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="w-full h-full object-cover grayscale opacity-90"
                                priority
                            />
                            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                                <p className="font-mono text-xs">LVL 24 CREATIVE DEV</p>
                            </div>
                        </div>
                    </WindowFrame>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="space-y-8"
                >
                    <div>
                        <p className="font-mono text-sm uppercase text-muted-foreground mb-2">{PROFILE.brand} / {PROFILE.name}</p>
                        <h1 className="text-4xl font-heading font-bold mb-6">BEHIND THE SCREEN</h1>
                        <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
                            <p>
                                {PROFILE.bio} {PROFILE.name} works across development, frontend, UI/UX, creative technology, and digital art.
                            </p>
                            <p>
                                Unlike traditional developers who focus solely on function, I treat every project as an interactive canvas. I believe software should have personality—a digital soul that resonates with its user.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="font-mono text-sm font-bold uppercase border-b border-black pb-2">Technical Arsenal</h2>
                        <div className="flex flex-wrap gap-2">
                            {["React", "TypeScript", "Next.js", "WebGL", "Three.js", "Tailwind", "Framer Motion", "Node.js"].map(skill => (
                                <span key={skill} className="px-3 py-1 bg-gray-100 border border-gray-200 text-sm font-mono hover:bg-black hover:text-white transition-colors cursor-default">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="font-mono text-sm font-bold uppercase border-b border-black pb-2">Creative Arsenal</h2>
                        <div className="flex flex-wrap gap-2">
                            {["UI/UX Design", "Illustration", "Motion Graphics", "3D Modeling", "Generative Art"].map(skill => (
                                <span key={skill} className="px-3 py-1 bg-gray-100 border border-gray-200 text-sm font-mono hover:bg-black hover:text-white transition-colors cursor-default">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
