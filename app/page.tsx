//app/page.tsx
"use client";

import { motion } from "framer-motion";
import WindowFrame from "@/components/WindowFrame";
import ocImage from "@/app/assets/images/oc-character.png";
import { ArrowRight, Mail, Github, Twitter } from "lucide-react";
import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen pt-24 pb-12 container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[80vh]">

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="lg:col-span-7 space-y-8"
                >
                    <div className="space-y-4">
                        <h2 className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
                            Frontend Developer & UI Designer
                        </h2>
                        <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tighter leading-tight">
                            Crafting digital <br />
                            <span className="bg-black text-white px-2 inline-block transform -rotate-1">experiences</span> with <br />
                            soul & precision.
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
                            I blend technical expertise with artistic vision to build websites that feel like interactive art pieces.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <Link href="/works" className="group bg-black text-white px-8 py-3 font-mono text-sm font-bold uppercase tracking-wider hover:bg-black/80 transition-all flex items-center gap-2">
                            View Works
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/contact" className="bg-white border border-black text-black px-8 py-3 font-mono text-sm font-bold uppercase tracking-wider hover:bg-gray-50 transition-all">
                            Contact Me
                        </Link>
                    </div>

                    <div className="flex gap-6 pt-8 border-t border-border w-fit">
                        <a href="#" className="hover:text-black/60 transition-colors"><Github className="w-5 h-5" /></a>
                        <a href="#" className="hover:text-black/60 transition-colors"><Twitter className="w-5 h-5" /></a>
                        <a href="#" className="hover:text-black/60 transition-colors"><Mail className="w-5 h-5" /></a>
                    </div>
                </motion.div>

                {/* Visual Content */}
                <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="lg:col-span-5 relative"
                >
                    <WindowFrame title="character_sheet.png" className="w-full aspect-[4/5] bg-white overflow-hidden rotate-1 hover:rotate-0 transition-transform duration-500">
                        <img
                            src={ocImage}
                            alt="Anime Character Illustration"
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                        />

                        {/* Overlay UI elements */}
                        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm border border-black p-3 font-mono text-xs">
                            <div className="flex justify-between items-center">
                                <span className="font-bold">STATUS</span>
                                <span className="text-green-600 animate-pulse">● ONLINE</span>
                            </div> 
                            <div className="mt-2 h-1 w-full bg-gray-200">
                                <div className="h-full bg-black w-[75%]" />
                            </div>
                        </div>
                    </WindowFrame>

                    {/* Decorative elements */}
                    <div className="absolute -z-10 top-10 -right-10 w-full h-full border border-black/20 pattern-dots" />
                </motion.div>
            </div>
        </div>
    );
}
