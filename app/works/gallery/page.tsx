import Link from "next/link";
import WindowFrame from "@/components/WindowFrame";
import { getPublishedArtworks } from "@/lib/data-access/artworks";
import type { Artwork } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function Gallery() {
    let artworks: Artwork[] = [];
    let artworksUnavailable = false;

    try {
        artworks = await getPublishedArtworks();
    } catch (error) {
        console.error("Loading public artworks failed:", error);
        artworksUnavailable = true;
    }

    return (
        <div className="min-h-screen pt-24 pb-20 container mx-auto px-6">
            <div className="mb-12">
                <h1 className="text-4xl font-heading font-bold tracking-tight mb-2">GALLERY</h1>
                <p className="font-mono text-muted-foreground">Visual artwork archive</p>
            </div>

            {artworksUnavailable ? (
                <div role="alert">
                    <WindowFrame title="gallery.archive" className="max-w-2xl">
                        <div className="p-8">
                            <h2 className="text-2xl font-bold mb-3">Gallery temporarily unavailable</h2>
                            <p className="text-muted-foreground">Published artworks could not be loaded right now.</p>
                        </div>
                    </WindowFrame>
                </div>
            ) : artworks.length === 0 ? (
                <WindowFrame title="gallery.archive" className="max-w-2xl">
                    <div className="p-8">
                        <h2 className="text-2xl font-bold mb-3">No published artworks yet</h2>
                        <p className="text-muted-foreground">There are no published artworks to display.</p>
                    </div>
                </WindowFrame>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {artworks.map((artwork) => (
                        <Link key={artwork.slug} href={`/works/gallery/${artwork.slug}`} className="block border border-black p-6">
                            <h2 className="font-bold text-xl">{artwork.title}</h2>
                            <p className="font-mono text-xs uppercase text-muted-foreground mt-2">{artwork.format} / {artwork.type}</p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
