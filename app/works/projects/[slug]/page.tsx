import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, ExternalLink, Github, Layers, Tag } from "lucide-react";
import WindowFrame from "@/components/WindowFrame";
import { getPublishedProjectBySlug } from "@/lib/data-access/projects";
import { getPublishedArtworksBySlugs } from "@/lib/data-access/artworks";
import { resolveProjectMedia } from "@/lib/public-media";

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const projectRecord = await getPublishedProjectBySlug(slug);

    if (!projectRecord) {
        notFound();
    }

    const project = await resolveProjectMedia(projectRecord, ["image"]);

    const relatedArtwork = await getPublishedArtworksBySlugs(project.relatedArtwork);

    return (
        <div className="min-h-screen pt-24 pb-20 container mx-auto px-6 max-w-5xl">
            <Link href="/works/projects" className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground hover:text-black mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Projects
            </Link>

            <div>
                <WindowFrame title={`${project.title} - READ_ONLY`} className="mb-12">
                    <div className="aspect-video w-full bg-gray-100 border-b border-black relative">
                        {project.resolvedImageUrl ? (
                            <Image src={project.resolvedImageUrl} alt={project.title} fill sizes="(max-width: 768px) 100vw, 1024px" className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center font-mono text-xs uppercase text-gray-500">Image unavailable</div>
                        )}
                    </div>
                    <div className="p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-gray-100 pb-8 mb-8">
                            <div>
                                <h1 className="text-4xl font-heading font-bold mb-2">{project.title}</h1>
                                <p className="text-lg text-muted-foreground font-light">{project.category}</p>
                            </div>
                            <div className="flex gap-4">
                                {project.liveUrl ? (
                                    <a href={project.liveUrl} className="bg-black text-white px-6 py-2 font-mono text-xs font-bold uppercase hover:bg-black/80 flex items-center gap-2">Live Demo <ExternalLink className="w-3 h-3" /></a>
                                ) : (
                                    <span className="bg-gray-300 text-gray-500 px-6 py-2 font-mono text-xs font-bold uppercase flex items-center gap-2 cursor-not-allowed">Live Demo <ExternalLink className="w-3 h-3" /></span>
                                )}
                                {project.sourceUrl ? (
                                    <a href={project.sourceUrl} className="border border-black px-6 py-2 font-mono text-xs font-bold uppercase hover:bg-gray-50 flex items-center gap-2">Source <Github className="w-3 h-3" /></a>
                                ) : (
                                    <span className="border border-gray-300 text-gray-500 px-6 py-2 font-mono text-xs font-bold uppercase flex items-center gap-2 cursor-not-allowed">Source <Github className="w-3 h-3" /></span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div className="md:col-span-2 space-y-6">
                                <h3 className="font-bold text-xl">About the Project</h3>
                                <p className="text-muted-foreground leading-relaxed">{project.description ?? project.shortDescription}</p>
                                {project.screenshots && project.screenshots.length > 0 && (
                                    <div className="grid gap-4">
                                        {project.screenshots.map((screenshot) => <Image key={screenshot.url} src={screenshot.url} alt={`${project.title} screenshot`} width={1200} height={675} />)}
                                    </div>
                                )}
                                {relatedArtwork.length > 0 && <p className="text-muted-foreground">Related artwork is available in the Gallery.</p>}
                            </div>
                            <div className="space-y-8">
                                <div><h4 className="font-mono text-xs font-bold uppercase text-gray-500 mb-3 flex items-center gap-2"><Calendar className="w-3 h-3" /> Date</h4><p className="font-mono">{project.date}</p></div>
                                {project.technologies && <div><h4 className="font-mono text-xs font-bold uppercase text-gray-500 mb-3 flex items-center gap-2"><Layers className="w-3 h-3" /> Technologies</h4><div className="flex flex-wrap gap-2">{project.technologies.map((technology) => <span key={technology} className="bg-gray-100 px-2 py-1 font-mono text-xs">{technology}</span>)}</div></div>}
                                {project.role && <div><h4 className="font-mono text-xs font-bold uppercase text-gray-500 mb-3 flex items-center gap-2"><Tag className="w-3 h-3" /> Role</h4><p className="font-mono text-sm">{project.role}</p></div>}
                                {project.status && <p className="font-mono text-sm">Status: {project.status}</p>}
                            </div>
                        </div>
                    </div>
                </WindowFrame>
            </div>
        </div>
    );
}
