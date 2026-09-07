"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import WindowFrame from "@/components/WindowFrame";
import type { ResolvedProject } from "@/lib/public-media";

interface ProjectsContentProps {
    projects: ResolvedProject[];
    projectsUnavailable: boolean;
}

export default function ProjectsContent({ projects, projectsUnavailable }: ProjectsContentProps) {
    const [filter, setFilter] = useState("ALL");
    const categories = ["ALL", ...Array.from(new Set(projects.map((project) => project.category.toUpperCase())))];
    const filteredProjects = filter === "ALL"
        ? projects
        : projects.filter((project) => project.category.toUpperCase() === filter);

    return (
        <div className="min-h-screen pt-24 pb-20 container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div>
                    <h1 className="text-4xl font-heading font-bold tracking-tight mb-2">PROJECTS</h1>
                    <p className="font-mono text-muted-foreground">Development and design archive</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            type="button"
                            onClick={() => setFilter(category)}
                            className={`px-4 py-1.5 font-mono text-xs border transition-all ${filter === category
                                ? "bg-black text-white border-black"
                                : "bg-white text-black border-gray-300 hover:border-black"
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {projectsUnavailable ? (
                <div role="alert">
                    <WindowFrame title="projects.archive" className="max-w-2xl">
                        <div className="p-8">
                            <h2 className="text-2xl font-bold mb-3">Projects temporarily unavailable</h2>
                            <p className="text-muted-foreground">Published projects could not be loaded right now.</p>
                        </div>
                    </WindowFrame>
                </div>
            ) : filteredProjects.length === 0 ? (
                <WindowFrame title="projects.archive" className="max-w-2xl">
                    <div className="p-8">
                        <h2 className="text-2xl font-bold mb-3">No published projects yet</h2>
                        <p className="text-muted-foreground">There are no published projects to display.</p>
                    </div>
                </WindowFrame>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredProjects.map((project, index) => (
                        <motion.div
                            key={project.slug}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <ProjectCard project={project} />
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
