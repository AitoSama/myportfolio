import Image from "next/image";
import Link from "next/link";
import WindowFrame from "@/components/WindowFrame";
import type { Project } from "@/types/database";

interface ProjectCardProps {
    project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    return (
        <Link href={`/works/projects/${project.slug}`} className="block h-full">
            <WindowFrame title={`${project.title}.exe`} className="h-full flex flex-col group cursor-pointer hover:shadow-xl transition-shadow">
                <div className="aspect-video bg-gray-100 overflow-hidden border-b border-black relative">
                    {project.thumbnail ? (
                        <Image
                            src={project.thumbnail}
                            alt={project.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center font-mono text-xs uppercase text-gray-500">
                            Image unavailable
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>

                <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-xl">{project.title}</h3>
                            <span className="font-mono text-xs bg-gray-100 px-2 py-1">{project.date}</span>
                        </div>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                            {project.shortDescription}
                        </p>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                        <span className="font-mono text-xs text-gray-500 uppercase">{project.category}</span>
                        <span className="text-xs font-bold uppercase tracking-wider group-hover:underline">View Project</span>
                    </div>
                </div>
            </WindowFrame>
        </Link>
    );
}
