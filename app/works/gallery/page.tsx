import Link from "next/link";
import WindowFrame from "@/components/WindowFrame";
import { ARTWORKS } from "@/lib/data";

export default function Gallery() {
    return (
        <div className="min-h-screen pt-24 pb-20 container mx-auto px-6">
            <div className="mb-12">
                <h1 className="text-4xl font-heading font-bold tracking-tight mb-2">GALLERY</h1>
                <p className="font-mono text-muted-foreground">Visual artwork archive</p>
            </div>

            {ARTWORKS.length === 0 ? (
                <WindowFrame title="gallery.archive" className="max-w-2xl">
                    <div className="p-8">
                        <h2 className="text-2xl font-bold mb-3">Gallery records unavailable</h2>
                        <p className="text-muted-foreground">Artwork can be added to the centralized gallery data without changing the project archive.</p>
                    </div>
                </WindowFrame>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {ARTWORKS.map((artwork) => (
                        <Link key={artwork.id} href={`/works/gallery/${artwork.slug}`} className="block border border-black p-6">
                            <h2 className="font-bold text-xl">{artwork.title}</h2>
                            <p className="font-mono text-xs uppercase text-muted-foreground mt-2">{artwork.format} / {artwork.type}</p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
