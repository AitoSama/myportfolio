"use client";

import { motion } from "framer-motion";
import WindowFrame from "@/components/WindowFrame";
import { useState } from "react";
import Link from "next/link";
import { PROJECTS } from "@/lib/data";

export default function Works() {
    const [filter, setFilter] = useState("ALL");

    const categories = ["ALL", "WEB APP", "WEBSITE", "EXPERIMENT"];

    const filteredProjects = filter === "ALL"
        ? PROJECTS
        : PROJECTS.filter(p => p.category.toUpperCase() === filter);

    return (
        <div className="min-h-screen pt-24 pb-20 container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div>
                    <h1 className="text-4xl font-heading font-bold tracking-tight mb-2">SELECTED WORKS</h1>
                    <p className="font-mono text-muted-foreground">Archive 2022 — 2024</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-1.5 font-mono text-xs border transition-all ${filter === cat
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-black border-gray-300 hover:border-black"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredProjects.map((project, i) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Link href={`/works/${project.id}`} className="block h-full">
                            <WindowFrame title={`${project.title}.exe`} className="h-full flex flex-col group cursor-pointer hover:shadow-xl transition-shadow">
                                <div className="aspect-video bg-gray-100 overflow-hidden border-b border-black relative">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                </div>

                                <div className="p-5 flex-grow flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-xl">{project.title}</h3>
                                            <span className="font-mono text-xs bg-gray-100 px-2 py-1">{project.year}</span>
                                        </div>
                                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                                            {project.desc}
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                                        <span className="font-mono text-xs text-gray-500 uppercase">{project.category}</span>
                                        <div className="flex gap-3 text-black">
                                            <span className="text-xs font-bold uppercase tracking-wider group-hover:underline">View Project</span>
                                        </div>
                                    </div>
                                </div>
                            </WindowFrame>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
