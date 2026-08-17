"use client";

import { motion } from "framer-motion";
import WindowFrame from "@/components/WindowFrame";
import ocImage from "@/app/assets/images/oc-character.png";

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
                            <img
                                src={ocImage}
                                alt="Artist Profile"
                                className="w-full h-full object-cover grayscale opacity-90"
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
                        <h1 className="text-4xl font-heading font-bold mb-6">BEHIND THE SCREEN</h1>
                        <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
                            <p>
                                Hello. I'm a multidisciplinary creative based in the digital realm. My work exists at the intersection of logical code and expressive design.
                            </p>
                            <p>
                                Unlike traditional developers who focus solely on function, I treat every project as an interactive canvas. I believe software should have personality—a digital soul that resonates with its user.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-mono text-sm font-bold uppercase border-b border-black pb-2">Technical Arsenal</h3>
                        <div className="flex flex-wrap gap-2">
                            {["React", "TypeScript", "Next.js", "WebGL", "Three.js", "Tailwind", "Framer Motion", "Node.js"].map(skill => (
                                <span key={skill} className="px-3 py-1 bg-gray-100 border border-gray-200 text-sm font-mono hover:bg-black hover:text-white transition-colors cursor-default">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-mono text-sm font-bold uppercase border-b border-black pb-2">Creative Arsenal</h3>
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
