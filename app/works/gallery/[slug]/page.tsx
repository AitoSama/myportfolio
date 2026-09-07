import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import WindowFrame from "@/components/WindowFrame";
import { getProject } from "@/lib/data";
import { getPublishedArtworkBySlug } from "@/lib/data-access/artworks";

export const dynamic = "force-dynamic";

export default async function ArtworkDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const artwork = await getPublishedArtworkBySlug(slug);

    if (!artwork) {
        notFound();
    }

    const relatedProjects = (artwork.relatedProjects ?? [])
        .map((projectSlug) => getProject(projectSlug))
        .filter((project) => project !== undefined);

    return (
        <div className="min-h-screen pt-24 pb-20 container mx-auto px-6 max-w-5xl">
            <Link href="/works/gallery" className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground hover:text-black mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Gallery
            </Link>
            <div>
                <WindowFrame title={`${artwork.title} - ARTWORK`}>
                    <div className="aspect-video w-full bg-gray-100 border-b border-black relative">
                        {artwork.image ? <Image src={artwork.image} alt={artwork.title} fill sizes="(max-width: 768px) 100vw, 1024px" className="object-contain" /> : <div className="w-full h-full flex items-center justify-center font-mono text-xs uppercase text-gray-500">Image unavailable</div>}
                    </div>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="md:col-span-2 space-y-6">
                            <h1 className="text-4xl font-heading font-bold">{artwork.title}</h1>
                            {artwork.description && <p className="text-muted-foreground leading-relaxed">{artwork.description}</p>}
                            {relatedProjects.length > 0 && <p className="text-muted-foreground">Related projects are available in the Projects archive.</p>}
                        </div>
                        <div className="space-y-6 font-mono text-sm">
                            <p>Format: {artwork.format}</p>
                            <p>Type: {artwork.type}</p>
                            {artwork.publishedAt && <p>Published: {artwork.publishedAt}</p>}
                            {artwork.series && <p>Series: {artwork.series}</p>}
                            {artwork.status && <p>Status: {artwork.status}</p>}
                            {artwork.tools && <p>Tools: {artwork.tools.join(", ")}</p>}
                            {artwork.tags && <p>Tags: {artwork.tags.join(", ")}</p>}
                            {artwork.externalUrl && <a href={artwork.externalUrl} className="underline">External link</a>}
                        </div>
                    </div>
                </WindowFrame>
            </div>
        </div>
    );
}
