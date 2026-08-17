"use client";

import { PROJECTS } from "@/lib/data";
import WindowFrame from "@/components/WindowFrame";
import { ArrowLeft, ExternalLink, Github, Calendar, Tag, Layers } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProjectDetail({ params }: { params: { slug: string } }) {
    const project = PROJECTS.find(p => p.id === params.slug);

    if (!project) {
        notFound();
    }

    return (
        <div className="min-h-screen pt-24 pb-20 container mx-auto px-6 max-w-5xl">
            <Link href="/works" className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground hover:text-black mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Archives
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <WindowFrame title={`${project.title} - READ_ONLY`} className="mb-12">
                    <div className="aspect-video w-full bg-gray-100 border-b border-black">
                        <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-gray-100 pb-8 mb-8">
                            <div>
                                <h1 className="text-4xl font-heading font-bold mb-2">{project.title}</h1>
                                <p className="text-lg text-muted-foreground font-light">{project.category}</p>
                            </div>
                            <div className="flex gap-4">
                                <a href="#" className="bg-black text-white px-6 py-2 font-mono text-xs font-bold uppercase hover:bg-black/80 flex items-center gap-2">
                                    Live Demo <ExternalLink className="w-3 h-3" />
                                </a>
                                <a href="#" className="border border-black px-6 py-2 font-mono text-xs font-bold uppercase hover:bg-gray-50 flex items-center gap-2">
                                    Source <Github className="w-3 h-3" />
                                </a>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div className="md:col-span-2 space-y-6">
                                <h3 className="font-bold text-xl">About the Project</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {project.desc} This project explores the relationship between user interaction and generative visuals. It challenges the standard interface paradigms by introducing non-linear navigation flows and experimental typography.
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    The goal was to create something that feels less like a tool and more like an instrument. Every interaction produces a unique visual feedback loop, making the user a co-creator of the experience.
                                </p>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h4 className="font-mono text-xs font-bold uppercase text-gray-500 mb-3 flex items-center gap-2">
                                        <Calendar className="w-3 h-3" /> Year
                                    </h4>
                                    <p className="font-mono">{project.year}</p>
                                </div>
                                <div>
                                    <h4 className="font-mono text-xs font-bold uppercase text-gray-500 mb-3 flex items-center gap-2">
                                        <Layers className="w-3 h-3" /> Tech Stack
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tools?.map(tool => (
                                            <span key={tool} className="bg-gray-100 px-2 py-1 font-mono text-xs">
                                                {tool}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-mono text-xs font-bold uppercase text-gray-500 mb-3 flex items-center gap-2">
                                        <Tag className="w-3 h-3" /> Role
                                    </h4>
                                    <p className="font-mono text-sm">Design & Development</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </WindowFrame>
            </motion.div>
        </div>
    );
}
